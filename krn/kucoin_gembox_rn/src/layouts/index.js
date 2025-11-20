/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useEffect, useMemo, useState} from 'react';
import {DEFAULT_LANG, languages} from 'config';
import {KRNEventEmitter, refreshAppSession} from '@krn/bridge';
import {useDispatch, useSelector} from 'react-redux';
import {setNativeInfo, getNativeInfo, compareVersion} from 'utils/helper';
import {Platform} from 'react-native';
import {useMount} from 'react-use';
import {DebugBar} from '@krn/ui';

export const BaseLayoutContext = React.createContext();
BaseLayoutContext.displayName = 'baseLayoutContext';

const BaseLayout = ({children}) => {
  const dispatch = useDispatch();
  const [lang, setLang] = useState(DEFAULT_LANG);
  const userInfo = useSelector(state => state.app.userInfo);
  const contextValue = useMemo(() => {
    return {lang, setLang};
  }, [lang, setLang]);
  const [enableDebugBar, setEnableDebugBar] = useState(
    `${process.env.RUN_ENV}` === 'sit' || __DEV__,
  );

  // 获取语言
  useMount(async () => {
    const nativeInfo = await getNativeInfo();
    // 设置语言
    if (languages.some(i => i === nativeInfo.lang)) {
      setLang(nativeInfo.lang);
    }
  });

  // 登录后同步语言
  useEffect(() => {
    if (userInfo?.language) {
      // 设置语言
      if (languages.some(i => i === userInfo.language)) {
        setLang(userInfo.language);
      }
      // 同时把语言同步到本地
      (async function () {
        const info = await getNativeInfo();
        await setNativeInfo({...info, lang: userInfo.language});
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
    return () => {
      subscription && subscription.remove();
    };
  }, [dispatch]);

  return (
    <BaseLayoutContext.Provider value={contextValue}>
      {children}
      <DebugBar enableBar={enableDebugBar} setEnableBar={setEnableDebugBar} />
    </BaseLayoutContext.Provider>
  );
};

export default BaseLayout;
