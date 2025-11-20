import JsBridge from 'gbiz-next/bridge';
import Router from 'kc-next/router';
import { routerConfig } from '@/routers/SpaPage';
import { addLangToPath } from 'tools/i18n';
import { match } from 'path-to-regexp';
import { isIOS } from 'src/helper';
import { exit, exitSelfContainer, updateSafeSettingInApp } from './runInApp';

function isLocalRoute(href) {
  if (!href) return false;

  const pathname = href.split('?')[0];
  return routerConfig.some((item) => {
    if (!item.path) return false;
    try {
      return !!match(item.path, { decode: decodeURIComponent })(pathname);
    } catch {
      return false;
    }
  });
}

export const push = (href) => {
  if (isLocalRoute(href)) {
    Router.push(href);
  } else {
    window.location.href = addLangToPath(href);
  }
};

export const replace = (href) => {
  if (isLocalRoute(href)) {
    Router.replace(href);
  } else {
    window.location.replace(addLangToPath(href));
  }
};

// 安全项中的返回
export const securityGoBack = async () => {
  if (JsBridge.isApp()) {
    isIOS() ? exitSelfContainer() : exit();
  } else {
    push('/account/security');
  }
};

// 安全项中设置成功后的返回
export const securitySuccessToBack = async (options = {}) => {
  const { defaultUrl = '/account/security', jumpToLoginInApp = false } = options;
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    await updateSafeSettingInApp(jumpToLoginInApp);
  } else {
    push(defaultUrl);
  }
};

// 安全项中的成功处理，踢出登录
export const securitySuccessKickout = async () => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    await updateSafeSettingInApp(true);
  } else {
    // 在 H5 中，跳转到登录页面
    push(`/ucenter/signin${getUrlSearch()}`);
  }
};
