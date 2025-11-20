/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useMemo, useState} from 'react';
import {Provider} from 'react-redux';
import * as models from 'models/_index';
import {dva} from 'utils/dva';
import loading from 'dva-loading';
import Router from './router';
import 'utils/lang';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {ThemeProvider} from '@krn/ui';
import BaseLayout from 'layouts/index';
import {useMount} from 'react-use';
import {getAppInfo, showToast} from '@krn/bridge';
import {Platform} from 'react-native';
import * as ws from '@kc/socket/lib/rn';
import {setNativeInfo} from 'utils/helper';
import {setPreSpmId} from 'utils/tracker';
import KRNStatusBar from 'components/Common/KRNStatusBar';
import transferAssetsSource from '@krn/build/src/transferAssetsSource';
import {DEFAULT_LANG, languages} from 'config';

ws.setDelay(200);

const App = propsFromNative => {
  const [appLang, setAppLang] = useState(DEFAULT_LANG);
  const [appReady, setAppReady] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // 项目初始化
  useMount(async () => {
    // 设置埋点preSpm
    setPreSpmId(propsFromNative?.spm);
    const nativeInfo = (await getAppInfo()) || {};
    await setNativeInfo(nativeInfo);
    const {version, darkMode, webApiHost, lang} = nativeInfo;
    // 设置版本号
    setAppVersion(version);
    // 设置语言
    if (lang && languages.some(i => i === lang)) {
      setAppLang(lang);
    }
    // 设置主题
    if (darkMode) setDarkMode(darkMode);
    // 设置assets host
    transferAssetsSource(webApiHost);
    // 设置socket host
    ws.setHost(`https://${webApiHost}/_api`);
    // 初始化完成
    setAppReady(true);
  });

  const dvaInstance = useMemo(() => {
    if (appReady) {
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
          if (e.msg) showToast(e.msg);
        },
      });
    }
  }, [appReady]);

  return appReady ? (
    <Provider store={dvaInstance._store}>
      <ThemeProvider
        appVersion={appVersion}
        EmotionProviderInstance={EThemeProvider}
        defaultTheme="light"
        lang={appLang}>
        <KRNStatusBar
          barStyle={
            !darkMode || Platform.OS === 'ios'
              ? 'dark-content'
              : 'light-content'
          }
        />
        <BaseLayout>
          <Router initRouter={propsFromNative?.route} />
        </BaseLayout>
      </ThemeProvider>
    </Provider>
  ) : null;
};

export default App;
