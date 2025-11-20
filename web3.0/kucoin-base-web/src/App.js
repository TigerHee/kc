import renderRoutes from '@apps/renderRoutes';
import RootEmotionCacheProvider from '@components/RootEmotionCacheProvider';
import {
  LocaleProvider,
  LoadableLocaleProvider,
  LoadableGbizNextLocaleProvider,
} from '@kucoin-base/i18n';
import ThemeProvider from '@kufox/mui/ThemeProvider';
import Notification from '@kux/mui/Notification';
import KuxProvider from '@kux/mui/ThemeProvider';
import { tenant, tenantConfig } from '@config/tenant';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import GoogleTranslateAb from '@components/TranslateAb';
import { basename } from '@kucoin-base/i18n';
import storage from '@kucoin-base/syncStorage';
import { kcsensorsManualTrack } from '@utils/sensors';

const { NotificationProvider } = Notification;

// 针对一些页面，使用 hydrate 的结果而不再从空 root 渲染
// 由于这里先于 activeWhen 执行，只能先匹配一次
let ssgRoot = null;
let clientRoot = null;

if (window._useSSG && window.SSG_hydrateFirst !== true) {
  ssgRoot = document.getElementById('root');
  clientRoot = ssgRoot.cloneNode(false);
  clientRoot.hidden = true;
  ssgRoot.parentNode.insertBefore(clientRoot, ssgRoot);
}

function preload() {
  LoadableLocaleProvider.preload();
  LoadableGbizNextLocaleProvider.preload();
}
preload();

function App(props) {
  React.useEffect(() => {
    const run = async () => {
      try {
        const reported = storage.getItem('sw_support_info_reported') === '1';
        if (reported) return;
        storage.setItem('sw_support_info_reported', '1');
        const params1 = {
          category: 'sw_support_info',
          name: 'sw_support',
          yesOrNo: !!navigator.serviceWorker,
        };
        kcsensorsManualTrack([], params1, 'technology_event');
        const params2 = {
          category: 'sw_support_info',
          name: 'cache_quota',
          number: 0,
        };
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          params2.number = estimate?.quota ? Math.round(estimate.quota / 1024 / 1024) : -1;
        } else {
          params2.number = -1;
        }
        kcsensorsManualTrack([], params2, 'technology_event');
      } catch (e) {}
    };
    const timer = setTimeout(() => {
      run();
    }, 20000);
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);

  React.useEffect(() => {
    if (ssgRoot && clientRoot) {
      clientRoot.hidden = false;
      ssgRoot.remove();
      ssgRoot = null;
      clientRoot = null;
    }
  }, []);

  const routes = props.app.routes;

  const targetRoutes = React.useMemo(() => {
    // 递归 routes，如果配置了 activeBrandKeys 字段，则判断 currentSite 是否在其中，如果不在，则删除该条路由
    // 如果没有配置 activeBrandKeys 字段，则不做处理，默认全部站点都展示
    const filterRoutes = (routes) => {
      return routes
        .map((route) => {
          if ('activeSiteConfig' in route && 'activeBrandKeys' in route) {
            console.error(
              `Route activeSiteConfig and activeBrandKeys should not be used at the same time`,
            );
          }

          if (
            (route.activeSiteConfig && !route.activeSiteConfig()) ||
            (route.activeBrandKeys && !route.activeBrandKeys.includes(tenant))
          ) {
            // 共享站对于禁用路由跳转到首页，防止用户在站点切换的时候进入到 404
            if (tenantConfig.disabledRouteToHome) {
              return {
                ...route,
                component: () => {
                  window.location.href = basename || '/';
                  return null;
                },
              };
            }
            return null;
          }
          if (route.routes) {
            route.routes = filterRoutes(route.routes);
          }
          return route;
        })
        .filter(Boolean);
    };

    if (!routes) return [];

    return filterRoutes(routes);
  }, [routes]);

  return (
    <KuxProvider>
      <NotificationProvider>
        <ThemeProvider>
          <RootEmotionCacheProvider>
            <Provider store={props.app.dva._store}>
              <LocaleProvider name={props.appName}>
                {React.createElement(
                  props.app.Root,
                  {},
                  <Router history={props.app.history}>
                    {renderRoutes({ routes: targetRoutes, name: props.app.name })}
                  </Router>,
                )}
                <GoogleTranslateAb />
              </LocaleProvider>
            </Provider>
          </RootEmotionCacheProvider>
        </ThemeProvider>
      </NotificationProvider>
    </KuxProvider>
  );
}

export default App;
