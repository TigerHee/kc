/**
 * Owner: willen@kupotech.com
 */
import React, {useMemo, useState, memo} from 'react';
import {Provider, useDispatch} from 'react-redux';
import * as models from 'models/_index';
import {dva} from 'utils/dva';
import loading from 'dva-loading';
import 'utils/lang';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {ThemeProvider} from '@krn/ui';
import Router from './router';
import BaseLayout from 'layouts/index';
import {useMount} from 'react-use';
import {getAppInfo, showToast} from '@krn/bridge';
import {getNativeInfo, setNativeInfo} from 'utils/helper';
import KRNStatusBar from 'components/Common/KRNStatusBar';
import {DEFAULT_LANG, languages} from 'config';
import persistEnhancer from './persist';
import {tracker} from '@krn/toolkit';
import transferAssetsSource from '@krn/build/src/transferAssetsSource';
import * as site from './site';
import * as Sentry from '@sentry/react-native';
import sentryInit from 'utils/sentry';

// 配置loading图标
// const options = {
//   loadingIconSource: {
//     uri: 'https://www.kucoin.com/kucoin-base-web/img/logo/192.png',
//   },
// loadingIconSource: require('./assets/convert/search.png'),
// };

const App = Sentry.wrap(
  memo(({propsFromNative}) => {
    const [appLang, setAppLang] = useState(DEFAULT_LANG);
    const [appVersion, setAppVersion] = useState('');
    const [appReady, setAppReady] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dispatch = useDispatch();

    // 设置基础信息
    useMount(async () => {
      // 设置埋点preSpm
      tracker.setConfigInfo({preSpmId: propsFromNative?.spm});
      // 获取App基本信息
      const nativeInfo = await getNativeInfo();
      const {
        version,
        lang,
        darkMode,
        webApiHost,
        siteType = 'global',
      } = nativeInfo || {};
      site.setSiteType(siteType);
      // 设置版本号
      setAppVersion(version);
      // 设置语言
      if (lang && languages.some(i => i === lang)) setAppLang(nativeInfo.lang);
      // 设置主题
      if (darkMode) setIsDarkMode(darkMode);
      // 设置assets host
      transferAssetsSource(webApiHost);
      // 缓存原生传入的参数
      dispatch({
        type: 'app/update',
        payload: {fromNativeParams: propsFromNative || {}, version, siteType},
      });
      // 初始化完成
      setAppReady(true);
    });

    return appReady ? (
      <ThemeProvider
        appVersion={appVersion}
        lang={appLang}
        EmotionProviderInstance={EThemeProvider}
        defaultTheme={isDarkMode ? 'dark' : 'light'}>
        <KRNStatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <BaseLayout appLang={appLang}>
          <Router initRouter={propsFromNative?.route} />
        </BaseLayout>
      </ThemeProvider>
    ) : null;
  }),
);

const CreateApp = propsFromNative => {
  const [createReady, setCreateReady] = useState(false);

  // 获取项目基础信息
  useMount(async () => {
    const nativeInfo = await getAppInfo();
    // 初始化sentry
    sentryInit(nativeInfo.webApiHost, nativeInfo.version, nativeInfo.siteType);
    await setNativeInfo(nativeInfo);
    setCreateReady(true);
  });

  const dvaInstance = useMemo(() => {
    if (createReady) {
      return dva({
        initialState: {},
        models: Object.values(models),
        plugins: [loading()],
        onError(e, dispatch) {
          if (+e?.code === 401) {
            dispatch({
              type: 'app/update',
              payload: {isLogin: false, userInfo: null},
            });
          }
          if (e?.msg) showToast(e.msg);
        },
        extraEnhancers: [persistEnhancer()],
      });
    }
  }, [createReady]);

  return createReady ? (
    <Provider store={dvaInstance._store}>
      <App propsFromNative={propsFromNative} />
    </Provider>
  ) : null;
};

export default CreateApp;
