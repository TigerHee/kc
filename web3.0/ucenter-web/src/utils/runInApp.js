/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
export default function runInApp() {
  return window.navigator.userAgent.indexOf('KuCoin') > -1;
}

// 在 App 中，刷新 App 用户信息
export const asyncRefreshAppUser = () => {
  return new Promise((resolve) => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'asyncRefreshAppUser' },
        },
        resolve,
      );
    } else {
      resolve();
    }
  });
};

// 在 App 中，退出登录，不切换站点
export const logoutAppWithoutSwitchSite = () => {
  return new Promise((resolve) => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'localLogout' },
        },
        resolve,
      );
    } else {
      resolve();
    }
  });
};

export const updateSafeSettingInApp = (jumpToLogin = true) => {
  return new Promise((resolve) => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'updateSafeSetting', jumpToLogin },
        },
        resolve,
      );
    } else {
      resolve();
    }
  });
};

/**
 * 退出当前 webview 容器
 * iOS: 关闭的是顶层的 webview，不一定是当前的
 * Android: 关闭当前的 webview
 */
export const exit = () => {
  return new Promise((resolve) => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'exit' },
        },
        resolve,
      );
    } else {
      resolve();
    }
  });
};

/**
 * 退出当前 webview 容器
 * 这个桥只有在 iOS 实现，Android 暂时没有
 * 因为 iOS 退出 webview 容器是会关闭顶层的 webview
 * 而 Android 退出 webview 容器是会关闭当前的 webview
 */
export const exitSelfContainer = () => {
  return new Promise((resolve) => {
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'exitSelfContainer' },
        },
        resolve,
      );
    } else {
      resolve();
    }
  });
};
