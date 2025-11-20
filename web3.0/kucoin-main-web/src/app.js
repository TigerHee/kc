/**
 * Owner: willen@kupotech.com
 */
import tdk from '@kc/tdk';
import { getDvaApp } from '@kucoin-base/dva';
import { currentLang } from '@kucoin-base/i18n';
import { ExtensionDetector } from '@kucoin-biz/extensionDetector';
import App from 'components/App';
import config from 'config';
import _ from 'lodash';
import intl from 'react-intl-universal';
import loadScript from 'utils/loadScript';
import 'utils/svgSeoOptimization';
import { init as initSensors } from 'tools/ext/kc-sensors';
import showError from './plugins/showError';
import routes from './routes.config';
import './global.js';
import './global.less';
import { xgrayCheck } from '@kucoin-biz/common-base';

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
  initSensors();
  const { v2ApiHosts } = config;
  const _API_HOST = v2ApiHosts.WEB;
  // bootstrap tdk
  tdk.init({
    host: _API_HOST,
    brandName: window._BRAND_NAME_,
  });

  const _routes = resolveRoutes(routes[0].routes);
  window.__KC_CRTS__ = _.flatten(_routes);
  window.getDvaApp = getDvaApp;

  if (!window.extensionDetector) {
    if (ExtensionDetector) {
      window.extensionDetector = new ExtensionDetector();
      window.extensionDetector.init({
        whitList: [],
      });
    }
  }

  const app = getDvaApp();
  app.use({
    onError: showError,
  });
  await loadScript(`${__webpack_public_path__}${DEPLOY_PATH}/static/locales/${currentLang}.js`);
  await intl.init({
    currentLocale: currentLang,
    locales: _KC_LOCALE_DATA,
  });
  xgrayCheck(['kucoin-main-web', 'g-biz']);
}
export { default as routes } from './routes.config';
