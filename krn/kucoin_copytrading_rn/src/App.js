import {useMemoizedFn, useMount} from 'ahooks';
import loading from 'dva-loading';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {getAppInfo, KRNEventEmitter} from '@krn/bridge';
import transferAssetsSource from '@krn/build/src/transferAssetsSource';
import {tenant, tracker} from '@krn/toolkit';
import {ThemeProvider} from '@krn/ui';
import * as Sentry from '@sentry/react-native';

import {DEFAULT_LANG, languages, storagePrefix} from 'config/';
import EnhanceCopyTradingProvider from 'layouts/EnhanceCopyTradingProvider/index';
import * as models from 'models/_index';
import {dva} from 'utils/dva';
import {getNativeInfo, setNativeInfo} from 'utils/helper';
import kunlunInit from 'utils/kunlun';
import {initSentry} from 'utils/sentry';
import onError from 'utils/showError';
import persistEnhancer from './persist';

import 'utils/lang';

// 配置loading图标
const options = {
  // loadingIconSource: {
  //   uri: 'https://www.kucoin.com/kucoin-base-web/img/logo/192.png',
  // },
  // loadingIconSource: require('./assets/common/search.png'),
};

const App = Sentry.wrap(
  memo(({propsFromNative}) => {
    const [appLang, setAppLang] = useState(DEFAULT_LANG);
    const [appVersion, setAppVersion] = useState('');
    const [appReady, setAppReady] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dispatch = useDispatch();
    const [cstyle, setCstyle] = useState(true); // 绿涨红跌

    const refreshApp = useMemoizedFn(() => {
      setAppReady(false);
      setAppReady(true);
    });
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
        siteType,
        cstyle: _cstyle,
      } = nativeInfo || {};
      // 设置版本号
      setAppVersion(version);

      // dispatch({type: 'app/update', payload: {nativeInfo}});
      // 设置语言
      if (lang && languages.some(i => i === lang)) {
        setAppLang(nativeInfo.lang);
      }
      // 设置主题
      if (darkMode) {
        setIsDarkMode(darkMode);
      }
      setCstyle(_cstyle);

      kunlunInit(`https://${webApiHost}`, siteType);
      // 设置assets host
      transferAssetsSource(webApiHost);
      // 初始化完成
      setAppReady(true);
    });

    // ios切换暗黑模式 RN 容器不会重启 ，ios 新增暗黑模式通知事件
    useEffect(() => {
      const subscriptionThemeChanged = KRNEventEmitter.addListener(
        'themeChanged',
        params => {
          const {night} = params || {};
          setIsDarkMode(night);
          refreshApp();
        },
      );

      // 涨跌颜色切换通知 ["redUp": Bool]  true: 红涨绿跌。
      const subscriptionCStyleChanged = KRNEventEmitter.addListener(
        'upDownColorChanged',
        params => {
          const {redUp} = params || {};
          setCstyle(!redUp);
          refreshApp();
        },
      );
      // 登录状态变化通知 : [“isLogin“: Bool]true:登录, false:未登录
      const subscriptionLoginStateChanged = KRNEventEmitter.addListener(
        'loginStateChanged',
        params => {
          const {isLogin} = params || {};
          if (!isLogin) {
            dispatch({type: 'leadInfo/resetLeadInfo'});
            dispatch({type: 'app/resetUserInfo'});
          }
        },
      );
      //    当网络变化时主动通知 networkType: 'NONE|WIFI|CELLULAR'
      const subscriptionNetworkStateChanged = KRNEventEmitter.addListener(
        'onNetworkChange',
        params => {
          const {networkType} = params || {};
          dispatch({
            type: 'app/update',
            payload: {
              networkType,
            },
          });
        },
      );
      return () => {
        subscriptionThemeChanged && subscriptionThemeChanged.remove();
        subscriptionCStyleChanged && subscriptionCStyleChanged.remove();
        subscriptionLoginStateChanged && subscriptionLoginStateChanged.remove();
        subscriptionNetworkStateChanged &&
          subscriptionNetworkStateChanged.remove();
      };
    }, [dispatch, refreshApp]);
    return appReady ? (
      <ThemeProvider
        options={options} // 添加options配置
        appVersion={appVersion}
        lang={appLang}
        EmotionProviderInstance={EThemeProvider}
        defaultTheme={isDarkMode ? 'dark' : 'light'}
        cstyle={cstyle}>
        <EnhanceCopyTradingProvider
          lang={appLang}
          propsFromNative={propsFromNative}
          isDarkMode={isDarkMode}
        />
      </ThemeProvider>
    ) : null;
  }),
);

const CreateApp = propsFromNative => {
  const [createReady, setCreateReady] = useState(false);

  // 获取项目基础信息
  useMount(async () => {
    tracker.setConfigInfo({rn_app_name: 'follow'});
    const nativeInfo = await getAppInfo();
    // 初始化sentry
    initSentry({nativeInfo});
    await tenant.setInit({nativeInfo, storagePrefix});
    await setNativeInfo(nativeInfo);
    setCreateReady(true);
  });

  const dvaInstance = useMemo(() => {
    if (createReady) {
      return dva({
        initialState: {},
        models: Object.values(models),
        plugins: [loading()],
        onError,
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

export default memo(CreateApp);
