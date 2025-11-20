import { ResponseInterceptor, RuntimeEnvironment } from '../../types';

const MAX_REQUEST_TIME = 3;
const SUPPORT_USER_INFO_VERSION = '3.101.0';

const appSessionRenewal: ResponseInterceptor = (baseConfig) => {
  const JsBridge = baseConfig.JsBridge;
  const requestExistMap = new Map<string, number>();

  let reLoginPromise: Promise<any> | null = null;
  let isSupportUserInfoCache: boolean | null = null;
  // 支持获取用户信息的App版本

  async function isSupportUserInfo() {
    if (isSupportUserInfoCache !== null) {
      return isSupportUserInfoCache;
    }
    isSupportUserInfoCache = await new Promise((resolve) => {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'getAppVersion' },
        },
        ({ data: version }: { data: string }) => {
          // 简单的版本比较, 仅支持 三段式纯数字的版本号
          const isSupport =
            String(version).localeCompare(SUPPORT_USER_INFO_VERSION, undefined, {
              numeric: true,
              sensitivity: 'base',
            }) >= 0;
          resolve(!!version && isSupport);
        },
      );
    });
    return isSupportUserInfoCache;
  }
  async function shouldRefreshSession() {
    const supportUserInfo = await isSupportUserInfo();
    // 旧版本的 App, fallback处理, 需要刷新
    if (!supportUserInfo) {
      return true;
    }
    return new Promise((resolve) => {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'getUserInfo' },
        },
        (result: any) => {
          // 仅当成功调用 getUserInfo 且用户未登录时, 才无需刷新 session; 其他情况都需要刷新
          return resolve(!(result && result.code && result.data && !result.data.uid));
        },
      );
    });
  }

  // Bridge 刷新session回流
  async function bridgeRenewal(url: string) {
    if (reLoginPromise) {
      return reLoginPromise;
    }
    const requestTime = requestExistMap.get(url) || 0;
    requestExistMap.set(url, requestTime + 1);
    // h5通过桥方式刷新session来进行搂底
    reLoginPromise = new Promise((resolve, reject) => {
      // 安卓没有callback,暂时通过主动监听实现，后续会提供新的桥
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      const callback = () => {
        // JsBridge.open({ type: 'func', params: { name: 'showToast', value: 'session 刷新成功' } });
        if (timeoutId !== null) {
          clearTimeout(timeoutId); // 清除超时定时器
          timeoutId = null;
        }
        resolve(true);
        JsBridge.listenNativeEvent.off('onLogin', callback);
      };

      JsBridge.listenNativeEvent.on('onLogin', callback);

      // 设置超时定时器
      timeoutId = setTimeout(() => {
        JsBridge.listenNativeEvent.off('onLogin', callback); // 移除回调，避免多次触发 resolve
        reject(new Error('刷新session超时')); // 在超时后拒绝 Promise
      }, 3000); // 设置超时时间，这里是 3 秒

      //旧版容器需要callback
      JsBridge.open({ type: 'func', params: { name: 'refreshAppSession' } }, ({ code }: any) => {
        console.log(code); // 不要删除这个空函数
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
      // 该拦截器在业务状态码之前，否则success字段是false会reject掉
      if (`${data.code}` !== '401') {
        return response;
      }
      // 若通过App 接口获取到用户并未登陆, 此时无需刷新
      const shouldRefresh = await shouldRefreshSession();
      if (!shouldRefresh) {
        return response;
      }
      const url = config.url?.split('?')[0];
      if (!url) {
        return response;
      }
      // 重复的401超过最大回流请求次数直接放掉
      const requestTime = requestExistMap.get(url) || 0;
      if (requestTime >= MAX_REQUEST_TIME) {
        data.ignoreError = true;
        return response;
      }
      const success = await bridgeRenewal(url);
      if (success) {
        // 重新请求
        response.config.__retry__ = true;
        // 直接reject跳过后面的拦截器
        return Promise.reject(response);
      }

      return response;
    },
  };
};

export default appSessionRenewal;
