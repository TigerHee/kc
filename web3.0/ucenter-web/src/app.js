/**
 * Owner: willen@kupotech.com
 */
import { getDvaApp } from '@kucoin-base/dva';
import { currentLang } from '@kucoin-base/i18n';
import { xgrayCheck } from '@kucoin-biz/common-base';
import { setup as setupKuxDesign } from '@kux/design';
import { Notification, Snackbar, ThemeProvider } from '@kux/mui';
import App from 'components/App';
import _ from 'lodash';
import intl from 'react-intl-universal';
import loadScript from 'utils/loadScript';
import preloadImage from 'utils/preloadImage';
import 'utils/svgSeoOptimization';
import GlobalCss from './GlobalCss';
import './init.js';
import showError from './plugins/showError';
import routes from './router.config';
import ThemeChange from './themeChange';

window.getDvaApp = getDvaApp;

// 初始化组件库, 可以根据需要多次调用 https://kux.sit.kucoin.net/next/?path=/docs/1-%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8--api
setupKuxDesign({
  // 设置 KcApp 桥方法对象, 保证所有需要使用 JsBridge 能力的场景(比如app中打开链接、分享)功能正常
  // web3.0 架构中可以使用下面方式获取
  //  `import JsBridge from '@kucoin-base/bridge'`;
  // jsBridge: JsBridge,
  getLottie: () => import('lottie-web'),
});

export function Root(props) {
  return (
    <>
      <ThemeProvider>
        <ThemeChange>
          <GlobalCss />
          <Snackbar.SnackbarProvider>
            <Notification.NotificationProvider>
              <App>{props.children}</App>
            </Notification.NotificationProvider>
          </Snackbar.SnackbarProvider>
        </ThemeChange>
      </ThemeProvider>
    </>
  );
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

export async function bootstrap(pathname) {
  const _routes = resolveRoutes(routes[0].routes);
  window.__KC_CRTS__ = _.flatten(_routes);
  window.__APP_NAME__ = 'ucenter-web';

  // 预加载首屏大图提高LCP评分
  preloadImage(pathname);

  const app = getDvaApp();
  app.use({
    onError: showError,
  });
  await loadScript(`${__webpack_public_path__}${DEPLOY_PATH}/static/locales/${currentLang}.js`);
  await intl.init({
    currentLocale: currentLang,
    locales: _KC_LOCALE_DATA,
  });
  xgrayCheck(['g-biz', 'ucenter-web']);
}

export { routes };
