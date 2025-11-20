/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import history from '@kucoin-base/history';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { addLangToPath } from 'tools/i18n';
import isIOS from '../isIOS';
import { exit, exitSelfContainer, updateSafeSettingInApp } from '../runInApp';

window.PROJECTS_ROUTES = window.PROJECTS_ROUTES || { routes: [], subs: [] };

const jumpRules = [
  'http://',
  'https://',
  '/land',
  '/express',
  '/token-info',
  '/cert',
  '/trading-bot',
  '/mining-pool',
  '/earn',
  ...(window?.PROJECTS_ROUTES?.subs || []),
];

// 不需要跳转到其他项目的路由
const excludeRoutes = ['/404'];

function _checkIfNeedUseLocation(href) {
  // kucoin-main-web 作为兜底项目，需要兼容住拆出项目(public-web)路由的 push；
  const publicRoutes = (window.__KC_CRTS__ || []).map((v) => v.path).filter((v) => !!v);
  //
  // 是否是public-web 的路由
  const targetPathname = (href || '').replace(/\?[^?]*/, '');
  if (
    !excludeRoutes.includes(href) &&
    _.every(publicRoutes, (rule) => !pathToRegexp(rule).test(targetPathname))
  ) {
    return true;
  }
  const jump = _.some(jumpRules, (rule) => _.startsWith(href, rule));
  if (jump) {
    return true;
  }
  return false;
}

window._checkIfNeedUseLocation = _checkIfNeedUseLocation;

export const push = (href) => {
  const isUseLocation = _checkIfNeedUseLocation(href);
  if (isUseLocation) {
    window.location.href = addLangToPath(href);
  } else {
    history.push(href);
  }
};

export const back = () => history.goBack();

export const replace = (href) => {
  const isUseLocation = _checkIfNeedUseLocation(href);
  if (isUseLocation) {
    window.location.href = addLangToPath(href);
  } else {
    history.replace(href);
  }
};

export function getUrlSearch() {
  return window.location.search || '';
}

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
