/**
 * Owner: willen@kupotech.com
 */
import { getDvaApp } from '@kucoin-base/dva';
import { currentLang } from '@kucoin-base/i18n';
import { xgrayCheck } from '@kucoin-biz/common-base';
import App from 'components/App';
import config from 'config';
import flatten from 'lodash/flatten';
import intl from 'react-intl-universal';
import { init as sensorsInit } from 'tools/ext/kc-sensors';
import 'tools/svgSeoOptimization';
import 'utils/initLazyImgObserver';
import loadScript from 'utils/loadScript';
import './global.less';
import './init.js';
import showError from './plugins/showError';
import routes from './router.config';

window.getDvaApp = getDvaApp;

export function Root(props) {
  return <App>{props.children}</App>;
}

/**
 * flatten routes
 *
 * @param   {[type]}  _routes  [_routes description]
 *
 * @return  {[type]}           [return description]
 */
function resolveRoutes(_routes) {
  return _routes.map((v) => {
    if (v.routes) {
      return [...resolveRoutes(v.routes)];
    }
    return v;
  });
}

export async function bootstrap() {
  sensorsInit();
  const { v2ApiHosts } = config;
  const _API_HOST = v2ApiHosts.WEB;
  // bootstrap tdk
  import('@kc/tdk').then(({ default: tdkManager }) => {
    // tdkManager.setHost(_API_HOST);
    tdkManager.init({
      host: _API_HOST,
      brandName: window._BRAND_NAME_,
    });
  });

  const _routes = resolveRoutes(routes[0].routes);
  window.__KC_CRTS__ = flatten(_routes);

  const app = getDvaApp();
  app.use({
    onError: showError,
  });
  await loadScript(`${__webpack_public_path__}${DEPLOY_PATH}/static/locales/${currentLang}.js`);
  await intl.init({
    currentLocale: currentLang,
    locales: _KC_LOCALE_DATA,
  });
  xgrayCheck(['public-web', 'g-biz']);
}

export { routes };
