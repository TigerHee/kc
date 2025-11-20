import pathToRegexp from 'path-to-regexp';
import { RuntimeEnvironment } from '../../types';
const SUPPORT_APP_TOKEN = '3.66.0';
const matchUrl = (fingerPrintUrlList, requestUrl, method) => {
    if (!requestUrl) {
        return undefined;
    }
    const pathName = requestUrl.startsWith('http')
        ? new URL(requestUrl).pathname
        : requestUrl.split('?')[0];
    return fingerPrintUrlList.find((o) => {
        if (!o?.url) {
            return false;
        }
        if (o.method && o.method.toLowerCase() !== (method || 'get').toLowerCase()) {
            return false;
        }
        const pathRegExp = pathToRegexp(o.url);
        const isMatch = pathRegExp.test(pathName);
        return isMatch;
    });
};
const compareVersion = (v1, v2) => {
    const _v1 = v1.split('.');
    const _v2 = v2.split('.');
    const _r = Number(_v1[0]) - Number(_v2[0]);
    return _r === 0 && v1 !== v2
        ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
        : _r;
};
const deviceFinger = (baseConfig) => {
    const { fingerPrintUrlList, environment, JsBridge } = baseConfig;
    let _reporter = null;
    let reporterInitd = false;
    const initReporter = async () => {
        if (reporterInitd) {
            return;
        }
        reporterInitd = true;
        const { reporter, getReporter } = baseConfig;
        if (reporter) {
            _reporter = reporter;
            return;
        }
        if (typeof getReporter === 'function') {
            _reporter = await getReporter();
        }
    };
    const getTokenByJsBridge = async (matchedUrl) => {
        if (!JsBridge) {
            return null;
        }
        try {
            const appVersion = await new Promise((resolve) => {
                JsBridge.open({
                    type: 'func',
                    params: { name: 'getAppVersion' },
                }, ({ data }) => resolve(data));
            });
            const canGetToken = compareVersion(appVersion, SUPPORT_APP_TOKEN) >= 0;
            const token = canGetToken
                ? await new Promise((resolve) => {
                    JsBridge.open({
                        type: 'func',
                        params: {
                            name: 'getFingerToken',
                            event: matchedUrl.event,
                        },
                    }, ({ data }) => resolve(data));
                })
                : await _reporter.logFingerprint(matchedUrl.event);
            return token;
        }
        catch (e) {
            console.error(`[http-client] JsBridge获取设备指纹失败,  ${e}`);
        }
    };
    return {
        name: 'deviceFinger',
        description: '设备指纹埋点上报拦截器',
        async onFulfilled(requestConfig) {
            if (!fingerPrintUrlList || fingerPrintUrlList.length === 0 || (!_reporter && reporterInitd)) {
                return requestConfig;
            }
            const matchedUrl = matchUrl(fingerPrintUrlList, requestConfig.url, requestConfig.method);
            if (!matchedUrl) {
                return requestConfig;
            }
            if (!reporterInitd) {
                await initReporter();
            }
            if (!_reporter) {
                return requestConfig;
            }
            let token = '';
            if (environment === RuntimeEnvironment.APP) {
                token = await getTokenByJsBridge(matchedUrl);
            }
            if (environment === RuntimeEnvironment.BROWSER) {
                token = await _reporter.logFingerprint(matchedUrl.event);
            }
            if (!token) {
                return requestConfig;
            }
            if (typeof token === 'object') {
                requestConfig.headers.set('TOKEN_SM', token.token_sm || '');
            }
            else {
                requestConfig.headers.set('TOKEN_SM', token || '');
            }
            return requestConfig;
        },
    };
};
export default deviceFinger;
