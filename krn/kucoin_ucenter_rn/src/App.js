/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-08-03 21:50:29
 * @LastEditors: mike mike@kupotech.com
 * @LastEditTime: 2023-08-08 21:24:20
 * @FilePath: /kucoin_ucenter_rn/src/App.js
 * @Description:
 */
import React, {useMemo, useState} from 'react';
import {Provider} from 'react-redux';
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
import transferAssetsSource from '@krn/build/src/transferAssetsSource';
import {tracker} from '@krn/toolkit';
import * as Sentry from '@sentry/react-native';
import sentryInit from 'utils/sentry';

import * as site from './site';

// 配置loading图标
const options = {
  loadingIconSource: {
    uri: require('assets/logo/kc.png'),
  },
};

const App = Sentry.wrap(({propsFromNative}) => {
  const [appLang, setAppLang] = useState(DEFAULT_LANG);
  const [appVersion, setAppVersion] = useState('');
  const [appReady, setAppReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 设置基础信息
  useMount(async () => {
    // 设置埋点preSpm
    tracker.setConfigInfo({preSpmId: propsFromNative?.spm});
    // 获取App基本信息
    const nativeInfo = await getNativeInfo();
    const {version, lang, darkMode, siteType = 'global'} = nativeInfo || {};

    // 多租户站点设置
    site.setSiteType(siteType);
    // 设置版本号
    setAppVersion(version);
    // 设置语言
    if (lang && languages.some(i => i === lang)) setAppLang(lang);
    // 设置主题
    if (darkMode) setIsDarkMode(darkMode);
    // 初始化完成
    setAppReady(true);
  });

  return appReady ? (
    <ThemeProvider
      appVersion={appVersion}
      EmotionProviderInstance={EThemeProvider}
      defaultTheme={isDarkMode ? 'dark' : 'light'}
      lang={appLang}
      options={options} // 添加options配置
    >
      <KRNStatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <BaseLayout appLang={appLang}>
        <Router initRouter={propsFromNative?.route} />
      </BaseLayout>
    </ThemeProvider>
  ) : null;
});

const CreateApp = propsFromNative => {
  console.log(propsFromNative, 'propsFromNative');
  const [createReady, setCreateReady] = useState(false);

  // 获取项目基础信息
  useMount(async () => {
    tracker.setConfigInfo({rn_app_name: 'ucenter'});
    const nativeInfo = await getAppInfo();
    const {webApiHost, version, siteType} = nativeInfo || {};
    // 设置assets host
    transferAssetsSource(webApiHost);
    // 初始化sentry
    sentryInit(webApiHost, version, siteType);

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

          try {
            tracker?.onCustomEvent('technology_event', {
              properties: {
                category: 'Kucoin_KYC_RN',
                code: e?.code,
                fail_reason_code: JSON.stringify(e?.resData?.headers),
                error_message: e?.resData?.url,
              },
            });
          } catch (error) {}

          if (e.msg) showToast(e.msg);
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
