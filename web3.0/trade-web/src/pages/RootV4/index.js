/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-07-31 09:57:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-03-25 18:17:37
 * @FilePath: /trade-web/src/pages/RootV4/index.js
 * @Description:
 */
/**
 * Owner: garuda@kupotech.com
 * 加载 4.0 的代码
 */
import React, { Fragment } from 'react';
import { ThemeProvider as KuxProvider, Snackbar, Notification, useResponsive } from '@kux/mui';
import App from 'components/App';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorPage from '@/components/ErrorBoundary/ErrorPage';
import RootEmotionCacheProvider from '@/components/RootEmotionCacheProvider';
import PublicNotice from '@/components/PublicNotice/index';
import EventProxy from '@/components/EventProxy';
import useInitLayout from '@/layouts/XlLayout/hooks/useInitLayout';
import StoreProviders from 'src/pages/Trade3.0/stores/StoreProviders';
import routeCreator from 'src/utils/routeCreator';
import app from 'utils/createApp';
import useInit from './useInit';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

export const AppContext = React.createContext();

const tradeHomePage = () => import(/* webpackChunkName: 'Trade4.0' */ '@/pages');

// /:trade?是兼容之前有的业务代码直接用TRADE_HOST拼接/trade导致交易迁子域后出现两个/trade的场景
const pages = {
  // 保证切换路由时界面更新 和 未将tab更换为路由一样顺畅
  // '/(trade)?/:tradeType/:symbol?': {
  //   component: tradeHomePage,
  // },
  '/(trade)?/:tradeType/:symbol?/:strategySymbol?': {
    component: tradeHomePage,
  },
};
// 初始化大屏下的布局数据
const XlLayoutInitHook = () => {
  useInitLayout();
  return null;
};

const GlobalRegister = React.memo(() => {
  const { xl } = useResponsive();
  // 主动挂载一波 models
  // init
  useInit();
  return <Fragment>{xl ? <XlLayoutInitHook /> : null}</Fragment>;
});

const RootV4 = () => {
  return (
    <EventProxy>
      <ErrorBoundary fallback={() => <ErrorPage />}>
        <RootEmotionCacheProvider>
          <KuxProvider breakpoints={{ xl: 1280, lg: 1024 }}>
            <NotificationProvider>
              <SnackbarProvider>
                <AppContext.Provider value={app}>
                  <GlobalRegister />
                  <StoreProviders>
                    <App isNewVersion>
                      <PublicNotice />
                      {routeCreator(pages, app)}
                    </App>
                  </StoreProviders>
                </AppContext.Provider>
              </SnackbarProvider>
            </NotificationProvider>
          </KuxProvider>
        </RootEmotionCacheProvider>
      </ErrorBoundary>
    </EventProxy>
  );
};

export default React.memo(RootV4);
