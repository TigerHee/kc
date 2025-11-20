/**
 * Owner: willen@kupotech.com
 */
import history from '@kucoin-base/history';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { addLangToPath } from 'tools/i18n';

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
