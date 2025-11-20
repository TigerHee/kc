import axios from 'axios';
import { gcm } from '@noble/ciphers/aes';
import { utf8ToBytes } from '@noble/ciphers/utils';
import base64js from 'base64-js';
const IV = new Uint8Array(12);
const wildcardMatch = (str, pattern) => {
    if (!str || !pattern || pattern.length === 0)
        return false;
    const path = str.startsWith('http') ? new URL(str).pathname : str.split('?')[0];
    return pattern.some((v) => (v instanceof RegExp ? v.test(path) : v === path));
};
const encrypt = (data, key, iv = IV) => gcm(key, iv).encrypt(utf8ToBytes(data));
const encryptInfo = {
    loaded: false,
    needEncrypt: false,
};
const closeEncryptFeature = () => {
    encryptInfo.key = null;
    encryptInfo.needEncrypt = false;
};
export const encryptRequest = ({ sentry, xVersion, kcStorage, xSite }) => {
    function captureEvent(message, level = 'error', tags, extra) {
        try {
            sentry?.captureEvent({
                message,
                level,
                tags: {
                    interceptor: 'encryptRequest',
                    ...tags,
                },
                fingerprint: '网络请求库',
                extra,
            });
        }
        catch (e) {
            console.error(`[http-client] sentry report error,  ${e}`);
        }
    }
    function initEncryptInfo() {
        return new Promise(async (resolve) => {
            try {
                const _xVersion = xVersion || kcStorage?.getItem('_x_version');
                const res = await axios.get('/_api/get_encrypt_key', {
                    params: { 'x-version': _xVersion },
                    headers: {
                        'X-VERSION': _xVersion,
                    },
                });
                const { data } = res.data;
                encryptInfo.remoteEncryptConfig = data;
                encryptInfo.needEncrypt = data.needEncrypt;
                if (encryptInfo.needEncrypt) {
                    encryptInfo.key = base64js.toByteArray(data.encryptKey);
                    encryptInfo.urlPatterns = (data.urlList || []).map((v) => {
                        if (v.includes('*')) {
                            const regexPattern = `^${v.replace(/\*/g, '.*')}$`;
                            const regex = new RegExp(regexPattern);
                            return regex;
                        }
                        return v;
                    });
                }
            }
            catch (e) {
                console.error(`[http-client] 初始化加解密信息失败,  ${e}`);
                closeEncryptFeature();
                captureEvent(`请求/api_/get_encrypt_key失败，${e}`);
            }
            encryptInfo.loaded = true;
            resolve(encryptInfo);
        });
    }
    let initEncryptInfoPromise;
    return {
        name: 'encryptRequest',
        description: '自动根据配置对请求数据进行加密',
        priority: -99,
        async onFulfilled(requestConfig) {
            if (!encryptInfo.loaded) {
                if (!initEncryptInfoPromise) {
                    initEncryptInfoPromise = initEncryptInfo();
                }
                await initEncryptInfoPromise;
                initEncryptInfoPromise = null;
            }
            if (!encryptInfo.needEncrypt ||
                !requestConfig.data ||
                !encryptInfo.key ||
                !wildcardMatch(requestConfig.url, encryptInfo.urlPatterns) ||
                requestConfig.data instanceof FormData) {
                return requestConfig;
            }
            try {
                const encryptData = encrypt(JSON.stringify(requestConfig.data), encryptInfo.key);
                const encryptData2Base64 = base64js.fromByteArray(encryptData);
                const data = utf8ToBytes(encryptData2Base64);
                const contentType = requestConfig.headers['content-type'] || requestConfig.headers['Content-Type'];
                return {
                    ...requestConfig,
                    data,
                    headers: {
                        ...requestConfig.headers,
                        'Content-Type': contentType || 'application/json',
                        'Content-Encrypted': '0',
                    },
                    __encrypt__: 1,
                };
            }
            catch (e) {
                console.error(`[http-client] 数据加密失败,  ${e}`);
                closeEncryptFeature();
                captureEvent(`客户端加密失败: ${e}`);
                return requestConfig;
            }
        },
    };
};
export const decryptResponse = ({ sentry }) => {
    function captureEvent(message, level = 'error', tags, extra) {
        try {
            sentry?.captureEvent({
                message,
                level,
                tags: {
                    interceptor: 'decryptResponse',
                    ...tags,
                },
                fingerprint: '网络请求库',
                extra,
            });
        }
        catch (e) {
            console.error(`[http-client] sentry report error,  ${e}`);
        }
    }
    function checkHasDecryptError(response) {
        if (!response) {
            return {
                hasError: false,
            };
        }
        const { data, config } = response;
        if (config && config.__encrypt__ === 1 && data && typeof data === 'object') {
            const { code, msg } = data;
            const codeValue = Number(code);
            if ((codeValue >= 40000 && codeValue < 40003) || codeValue === 50000 || codeValue === 50001) {
                return {
                    hasError: true,
                    code,
                    msg,
                    url: config.url,
                    method: config.method,
                };
            }
        }
        return {
            hasError: false,
        };
    }
    return {
        name: 'decryptResponse',
        description: '自动根据配置对响应数据进行解密',
        priority: 999,
        onFulfilled(response) {
            const checkResult = checkHasDecryptError(response);
            if (checkResult.hasError) {
                const { code, msg, url, method } = checkResult;
                console.error(`[http-client] 服务端解密失败，code: ${code}, msg: ${msg}`);
                closeEncryptFeature();
                captureEvent(`服务端解密失败，code: ${code}, msg: ${msg}`, 'error', undefined, {
                    api: url,
                    method,
                });
                response.config.__retry__ = true;
                return Promise.reject(response);
            }
            return response;
        },
        onRejected(error) {
            const response = error.response || error;
            const checkResult = checkHasDecryptError(response);
            if (checkResult.hasError) {
                const { code, msg, url, method } = checkResult;
                console.error(`[http-client] 服务端解密失败，code: ${code}, msg: ${msg}`);
                closeEncryptFeature();
                captureEvent(`服务端解密失败，code: ${code}, msg: ${msg}`, 'error', undefined, {
                    api: url,
                    method,
                });
                response.config.__retry__ = true;
            }
            return Promise.reject(error);
        },
    };
};
