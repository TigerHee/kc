/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useMemo, useState} from 'react';
import {languages} from 'config';
import {useDispatch, useSelector} from 'react-redux';
import {KRNEventEmitter, refreshAppSession} from '@krn/bridge';
import {compareVersion, getNativeInfo, setNativeInfo} from 'utils/helper';
import {Platform} from 'react-native';
import {DebugBar} from '@krn/ui';
import {tracker} from '@krn/toolkit';

export const BaseLayoutContext = React.createContext();
BaseLayoutContext.displayName = 'baseLayoutContext';

const BaseLayout = ({children, appLang}) => {
  const [lang, setLang] = useState(appLang);
  const userInfo = useSelector(state => state.app.userInfo);
  const dispatch = useDispatch();
  const contextValue = useMemo(() => {
    return {lang, setLang};
  }, [lang, setLang]);
  const [enableDebugBar, setEnableDebugBar] = useState(__DEV__);

  // 登录后同步语言
  useEffect(() => {
    if (userInfo?.language) {
      // 设置语言
      if (languages.some(i => i === userInfo.language)) {
        setLang(userInfo.language);
      }
      // 同时把语言同步到本地
      (async function () {
        const nativeInfo = await getNativeInfo();
        if (nativeInfo.apiType === 'dev') setEnableDebugBar(true);
        await setNativeInfo({...nativeInfo, lang: userInfo.language});
      })();
    }
  }, [userInfo]);

  // app触发登录成功后，执行initApp
  useEffect(() => {
    const subscription = KRNEventEmitter.addListener(
      'onLoginSuccess',
      async () => {
        console.log('接收到onLoginSuccess事件通知');
        // 安卓3.86.2以前的版本中，安卓端需要手动刷新session页面才能拿到登录态
        const {version} = await getNativeInfo();
        if (
          Platform.OS === 'android' &&
          (!version || compareVersion(version, '3.86.2') < 0)
        ) {
          await refreshAppSession();
          setTimeout(() => dispatch({type: 'app/initApp'}), 300);
        } else {
          dispatch({type: 'app/initApp'});
        }
      },
    );
    // 监听页面进入前台
    const subscriptionShow = KRNEventEmitter.addListener('onShow', () => {
      tracker.setConfigInfo({preLoadTime: Date.now()});
    });
    // 监听页面进入后台
    const subscriptionHide = KRNEventEmitter.addListener('onHide', () => {
      const {prePageId, preLoadTime} = tracker.getConfigInfo();
      if (prePageId) {
        tracker.onPageView({
          pageId: prePageId,
          eventDuration: Date.now() - preLoadTime,
        });
      }
    });

    return () => {
      subscription && subscription.remove();
      subscriptionShow && subscriptionShow.remove();
      subscriptionHide && subscriptionHide.remove();
    };
  }, [dispatch]);

  // 获取闪兑基本配置信息
  useEffect(() => {
    dispatch({type: 'convert/getConvertBaseConfig'});
    // dispatch({type: 'convert/getConvertCurrencyConfig'});
  }, [dispatch]);

  return (
    <BaseLayoutContext.Provider value={contextValue}>
      {children}
      {enableDebugBar ? (
        <DebugBar enableBar setEnableBar={setEnableDebugBar} />
      ) : null}
    </BaseLayoutContext.Provider>
  );
};

export default BaseLayout;
