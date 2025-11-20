import { RuntimeEnvironment } from '../../types';
const MAX_REQUEST_TIME = 3;
const SUPPORT_USER_INFO_VERSION = '3.101.0';
const appSessionRenewal = (baseConfig) => {
    const JsBridge = baseConfig.JsBridge;
    const requestExistMap = new Map();
    let reLoginPromise = null;
    let isSupportUserInfoCache = null;
    async function isSupportUserInfo() {
        if (isSupportUserInfoCache !== null) {
            return isSupportUserInfoCache;
        }
        isSupportUserInfoCache = await new Promise((resolve) => {
            JsBridge.open({
                type: 'func',
                params: { name: 'getAppVersion' },
            }, ({ data: version }) => {
                const isSupport = String(version).localeCompare(SUPPORT_USER_INFO_VERSION, undefined, {
                    numeric: true,
                    sensitivity: 'base',
                }) >= 0;
                resolve(!!version && isSupport);
            });
        });
        return isSupportUserInfoCache;
    }
    async function shouldRefreshSession() {
        const supportUserInfo = await isSupportUserInfo();
        if (!supportUserInfo) {
            return true;
        }
        return new Promise((resolve) => {
            JsBridge.open({
                type: 'func',
                params: { name: 'getUserInfo' },
            }, (result) => {
                return resolve(!(result && result.code && result.data && !result.data.uid));
            });
        });
    }
    async function bridgeRenewal(url) {
        if (reLoginPromise) {
            return reLoginPromise;
        }
        const requestTime = requestExistMap.get(url) || 0;
        requestExistMap.set(url, requestTime + 1);
        reLoginPromise = new Promise((resolve, reject) => {
            let timeoutId = null;
            const callback = () => {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                resolve(true);
                JsBridge.listenNativeEvent.off('onLogin', callback);
            };
            JsBridge.listenNativeEvent.on('onLogin', callback);
            timeoutId = setTimeout(() => {
                JsBridge.listenNativeEvent.off('onLogin', callback);
                reject(new Error('刷新session超时'));
            }, 3000);
            JsBridge.open({ type: 'func', params: { name: 'refreshAppSession' } }, ({ code }) => {
                console.log(code);
            });
        })
            .catch((e) => {
            console.error('Promise rejected:', e);
        })
            .finally(() => {
            reLoginPromise = null;
        });
        return reLoginPromise;
    }
    return {
        name: 'appSessionRenewal',
        description: 'app会话自动刷新',
        priority: 100,
        async onFulfilled(response) {
            if (baseConfig.environment !== RuntimeEnvironment.APP || !JsBridge) {
                return response;
            }
            const { data, config } = response;
            if (!data || typeof data !== 'object') {
                return response;
            }
            if (`${data.code}` !== '401') {
                return response;
            }
            const shouldRefresh = await shouldRefreshSession();
            if (!shouldRefresh) {
                return response;
            }
            const url = config.url?.split('?')[0];
            if (!url) {
                return response;
            }
            const requestTime = requestExistMap.get(url) || 0;
            if (requestTime >= MAX_REQUEST_TIME) {
                data.ignoreError = true;
                return response;
            }
            const success = await bridgeRenewal(url);
            if (success) {
                response.config.__retry__ = true;
                return Promise.reject(response);
            }
            return response;
        },
    };
};
export default appSessionRenewal;
