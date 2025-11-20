/**
 * Owner: willen@kupotech.com
 */
import history from '@kucoin-base/history';
import _ from 'lodash';
import { getLocaleBasename, addLangToPath } from 'tools/i18n';
window.PROJECTS_ROUTES = window.PROJECTS_ROUTES || { routes: [], subs: [] };

const getAppName = (path) => {
  const Route = path.substring(1);
  const Routes = Route.split('/');
  const App = Routes[0];
  return App;
};

const checkIsSameApp = (href) => {
  let currentPath = window.location.pathname;
  const localBase = getLocaleBasename();
  currentPath = localBase ? currentPath.replace(`/${localBase}`, '') : currentPath;
  const currentApp = getAppName(currentPath);
  const targetApp = getAppName(href);
  if (currentApp === targetApp || href.startsWith('/404')) {
    return true;
  }
  return false;
};

export const push = (href) => {
  const isSameApp = checkIsSameApp(href);
  if (!isSameApp) {
    window.location.href = addLangToPath(href);
  } else {
    history.push(href);
  }
};
export const back = () => window.history.go(-1);

export const replace = (href) => {
  const isSameApp = checkIsSameApp(href);
  if (!isSameApp) {
    window.location.href = addLangToPath(href);
  } else {
    history.replace(href);
  }
};
