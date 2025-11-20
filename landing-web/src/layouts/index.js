/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { connect } from 'dva';
import { ThemeProvider, Snackbar, Notification } from '@kufox/mui';
import createCache from '@emotion/cache';
import { CacheProvider } from '@kufox/mui/emotion';
import rtlPlugin from 'stylis-plugin-rtl';
import JsBridge from 'utils/jsBridge';
import loadable from '@loadable/component';
import ErrorFallback from 'components/RemoteErrorBoundary/ErrorFallback';
import AnalyticsModule from 'hocs/analyticsModule';
import useRouteChange from 'hooks/useRouteChange';
import { routeNotFlexible } from 'config';
import { checkPathname } from 'helper';
import styles from './style.less';
import { CmsComponents } from 'config';
import systemDynamic from 'utils/systemDynamic';
import SEOmeta from 'components/SEOmeta';
import { isRTLLanguage } from 'utils/langTools';
import useHtmlLang from 'src/hooks/useHtmlLang';

const Login = loadable(() => import('components/Login'));
const ForgetPwd = loadable(() => import('components/ForgetPwd'));

// dayjs
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

const SentryLoadable = loadable.lib(() => import('@kc/sentry'));

const ErrorBoundary = (props = {}) => {
  const { children = null, ...rest } = props || {};
  return (
    <SentryLoadable>
      {lib => {
        const ErrorBoundaryComp = lib.ErrorBoundary;
        if (!ErrorBoundaryComp) return children;
        return (
          <ErrorBoundaryComp {...rest}>
            {children}
          </ErrorBoundaryComp>
        )
      }}
    </SentryLoadable>
  )
};
// 扩展：某些页面不需要CMSHeader 和 ForgetPwd等内容
const briefPaths = [
  '/error',
  '/refer-friends-to-kucoin-and-win-free-travel',
  '/earn-crypto-rewards-by-referring',
];

const currentUrl = window.location.pathname;
let isBriefPath = false;
if (briefPaths.some && briefPaths.some((path) => currentUrl.includes(path))) {
  isBriefPath = true;
}

const loadLoginDrawer = !['/land/promotions'].some(i => currentUrl.includes(i));
const loadForgotPwdDrawer = loadLoginDrawer;

const rtlCache = createCache({ key: 'rtlcss', stylisPlugins: [rtlPlugin] });
const ltrCache = createCache({ key: 'lrtcss' });

const LocaleProvider = systemDynamic('@remote/tools', 'LocaleProvider');

const isApp = JsBridge.isApp();

const activityList = ['/activity', '/promotions'];
const _pathname = window?.location?.pathname || '';
const isActivityPage = activityList.some(i => _pathname?.includes(i));
const isActivityPageApp = isActivityPage;

function BasicLayout(props) {
  const {
    children,
    dispatch,
    currentLang,
    // appReady,
    location: { pathname },
    route: { routes },
  } = props;
  const [cache, setCache] = useState(ltrCache);
  useRouteChange();

  window.__KC_CRTS__ = routes;

  useEffect(() => {
    // 关闭app的loading
    if (isApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'onPageMount',
        },
      });
    }
  }, []);

  // 这里直接项目初始化 就关闭apploading
  useLayoutEffect(() => {
    if (window.location.pathname.includes('/2024-annual-report')) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          statusBarTransparent: true,
          statusBarIsLightMode: false, // 状态栏文字颜色为白色
          visible: false,
        },
      }, () => {
        // 解决隐藏Header导致的webview宽度变化，loading跳动问题
        setTimeout(() => {
          window.annualLoadingStart && window.annualLoadingStart();
        }, 1000)
      });
      return;
    }
  }, []);

  useEffect(() => {
    const dom = document.querySelector('.pageloading-wrap');
      // 关闭html的loading
    if (dom) {
      dom.style = 'display: none;';
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      import('@kc/tdk').then(({ default: tdkManager }) => {
        tdkManager(currentLang);
      });
    }, 2000);
    // 加载cms
    if (isActivityPageApp) return;
    const config = CmsComponents[pathname];
    if (!config) return;
    dispatch({
      type: 'components/fetch',
      payload: {
        componentsToload: config,
      },
    });
  }, [currentLang, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const isRTL = isRTLLanguage(currentLang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    setCache(isRTL ? rtlCache : ltrCache);
    return () => {
      document.documentElement.removeAttribute('dir');
    };
  }, [currentLang]);

  useHtmlLang();

  const notFlexible = routeNotFlexible.length && checkPathname(routeNotFlexible);

  // eager load share package
  // const sharePackage = useLoadSharePackage()
  // if (!sharePackage.isReady) {
  //   return null
  // }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <CacheProvider value={cache}>
        <ThemeProvider key={currentLang}>
          <SnackbarProvider>
            <NotificationProvider>
              <LocaleProvider locale={currentLang}>
                {!isActivityPageApp && <SEOmeta currentLang={currentLang} />}
                <div
                  className={styles.layout}
                  data-path={pathname}
                  data-layout={notFlexible ? 'normal' : 'flexible'}
                  id="layout"
                >
                  {isBriefPath ? (
                    <div className={styles.body} id="body">
                      {children}
                      <Login />
                    </div>
                  ) : (
                    <>
                      {!isActivityPageApp && (
                        null
                      )}
                      <div className={styles.body} id="body">
                        {children}
                      </div>
                      {loadLoginDrawer ? <Login /> : null}
                      {loadForgotPwdDrawer ? <ForgetPwd /> : null}
                    </>
                  )}
                </div>
              </LocaleProvider>
            </NotificationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

const OriginalLayout = AnalyticsModule()(
  connect((state) => {
    return {
      currentLang: state.app.currentLang,
      appReady: state.app.appReady,
    };
  })(BasicLayout),
);

export default OriginalLayout;
