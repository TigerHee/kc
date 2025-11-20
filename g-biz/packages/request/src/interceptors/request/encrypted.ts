import axios from 'axios';
import { gcm } from '@noble/ciphers/aes';
import { utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils';
import base64js from 'base64-js';
import { RequestInterceptor, ResponseInterceptor, ResponseType } from '../../types';
/**
 * 接口返回数据
 * @see https://k-devdoc.atlassian.net/wiki/spaces/SYSTEM/pages/750225599/API
 */
interface RemoteEncryptConfig {
  /** 灰度标识，后端会实现基于uid的灰度控制 */
  needEncrypt: boolean;
  /** 哪些接口需要做灰度，支持最后一位为*的通配 */
  urlList?: string[];
  /** 经过base64编码的密钥数据，原文长度为16B，客户端需进行base64解码后使用 */
  encryptKey?: string;
  /** 密钥对应用户的uid，短id */
  uid?: string;
}

type UrlPatterns = Array<RegExp | string>;

interface EncryptInfo {
  /** 加解密配置是否请求完成 */
  loaded: boolean;
  /** 加解密配置开关 */
  needEncrypt: boolean;
  remoteEncryptConfig?: RemoteEncryptConfig;
  /** 加解密密钥 */
  key?: Uint8Array | null;
  urlPatterns?: UrlPatterns;
}

// 12字节全0数组
const IV = new Uint8Array(12);

/**
 * 带*的泛匹配
 * @param str
 * @param pattern
 * @returns
 */
const wildcardMatch = (str?: string, pattern?: UrlPatterns) => {
  if (!str || !pattern || pattern.length === 0) return false;
  const path = str.startsWith('http') ? new URL(str).pathname : str.split('?')[0];
  return pattern.some((v) => (v instanceof RegExp ? v.test(path) : v === path));
};

/**
 * AES-128-GCM加密
 * @param data
 * @param key
 * @param iv
 * @returns
 */
const encrypt = (data: string, key: Uint8Array, iv: Uint8Array = IV) =>
  gcm(key, iv).encrypt(utf8ToBytes(data));

/**
 *  AES-128-GCM解密
 * @param data
 * @param key
 * @param iv
 * @returns
 * TODO 1期没有解密
 */
// const decrypt = (data: string, key: Uint8Array, iv: Uint8Array = IV) =>
//   bytesToUtf8(gcm(key, iv).decrypt(base64js.toByteArray(data)));

// const safeParse = (data: string) => {
//   try {
//     return JSON.parse(data);
//   } catch (e) {
//     return data;
//   }
// };

const encryptInfo: EncryptInfo = {
  loaded: false,
  needEncrypt: false,
};

const closeEncryptFeature = () => {
  encryptInfo.key = null;
  encryptInfo.needEncrypt = false;
};

export const encryptRequest: RequestInterceptor = ({ sentry, xVersion, kcStorage, xSite }) => {
  function captureEvent(
    message: string,
    level: 'info' | 'warn' | 'error' = 'error',
    tags?: any,
    extra?: any,
  ) {
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
    } catch (e) {
      console.error(`[http-client] sentry report error,  ${e}`);
    }
  }
  function initEncryptInfo(): Promise<EncryptInfo> {
    return new Promise(async (resolve) => {
      try {
        const _xVersion = xVersion || kcStorage?.getItem('_x_version');
        const res = await axios.get('/_api/get_encrypt_key', {
          params: { 'x-version': _xVersion },
          headers: {
            'X-VERSION': _xVersion,
            // 'X-SITE': xSite,
          },
        });
        const { data } = res.data;
        encryptInfo.remoteEncryptConfig = data;
        encryptInfo.needEncrypt = data.needEncrypt;
        if (encryptInfo.needEncrypt) {
          encryptInfo.key = base64js.toByteArray(data.encryptKey);
          encryptInfo.urlPatterns = (data.urlList || []).map((v: string) => {
            if (v.includes('*')) {
              const regexPattern = `^${v.replace(/\*/g, '.*')}$`;
              const regex = new RegExp(regexPattern);
              return regex;
            }
            return v;
          });
        }
      } catch (e) {
        console.error(`[http-client] 初始化加解密信息失败,  ${e}`);
        closeEncryptFeature();
        captureEvent(`请求/api_/get_encrypt_key失败，${e}`);
      }
      encryptInfo.loaded = true;
      resolve(encryptInfo);
    });
  }

  let initEncryptInfoPromise: Promise<EncryptInfo> | null;

  return {
    name: 'encryptRequest',
    description: '自动根据配置对请求数据进行加密',
    priority: -99, // 最后执行
    async onFulfilled(requestConfig) {
      if (!encryptInfo.loaded) {
        if (!initEncryptInfoPromise) {
          initEncryptInfoPromise = initEncryptInfo();
        }
        await initEncryptInfoPromise;
        initEncryptInfoPromise = null;
      }
      if (
        !encryptInfo.needEncrypt ||
        !requestConfig.data ||
        !encryptInfo.key ||
        !wildcardMatch(requestConfig.url, encryptInfo.urlPatterns) ||
        requestConfig.data instanceof FormData
      ) {
        return requestConfig;
      }
      try {
        const encryptData = encrypt(JSON.stringify(requestConfig.data), encryptInfo.key);
        const encryptData2Base64 = base64js.fromByteArray(encryptData);
        const data = utf8ToBytes(encryptData2Base64);
        const contentType =
          requestConfig.headers['content-type'] || requestConfig.headers['Content-Type'];
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
      } catch (e) {
        console.error(`[http-client] 数据加密失败,  ${e}`);
        closeEncryptFeature();
        captureEvent(`客户端加密失败: ${e}`);
        return requestConfig;
      }
    },
  };
};

export const decryptResponse: ResponseInterceptor = ({ sentry }) => {
  function captureEvent(
    message: string,
    level: 'info' | 'warn' | 'error' = 'error',
    tags?: any,
    extra?: any,
  ) {
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
    } catch (e) {
      console.error(`[http-client] sentry report error,  ${e}`);
    }
  }
  function checkHasDecryptError(response: ResponseType) {
    if (!response) {
      return {
        hasError: false,
      };
    }
    const { data, config } = response;
    // 服务端解密失败
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
      // 本期没有数据解密需求，先注释掉
      // const isContentEncrypted = headers['content-encrypted'] || headers['Content-Encrypted'];
      // if (!isContentEncrypted) {
      //   return response;
      // }
      // // 响应头中有加密标志，但响应体中没有加密数据
      // if (!data) {
      //   captureEvent('响应头中有加密标志，但响应体中没有加密数据', 'warn', undefined, {
      //     api: config.url,
      //     method: config.method,
      //   });
      //   return response;
      // }
      // // 响应体中有加密数据，key不存在，重新请求（一般不会出现）
      // if (!encryptInfo.key) {
      //   closeEncryptFeature();
      //   captureEvent('加解密key不存在，无法对相应数据解密', 'error', undefined, {
      //     api: config.url,
      //     method: config.method,
      //   });
      //   // 重新请求
      //   response.config.__retry__ = true;
      //   return Promise.reject(response);
      // }
      // try {
      //   const decryptText = decrypt(data, encryptInfo.key);
      //   return {
      //     ...response,
      //     data: safeParse(decryptText),
      //   };
      // } catch (e) {
      //   console.error(`[http-client] 数据解密失败,  ${e}`);
      //   closeEncryptFeature();
      //   captureEvent('客户端解密失败', 'error', undefined, {
      //     api: config.url,
      //     method: config.method,
      //     // data,
      //     // key敏感信息先不上报
      //   });
      //   // 重新请求
      //   response.config.__retry__ = true;
      //   return Promise.reject(response);
      // }
    },
    // 解密失败http状态码是 400
    onRejected(error) {
      // 如果是 axios抛出的异常，error是AxiosError类型，response是一个属性，如果是拦截器抛出的异常，error是AxiosResponse
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
