import {useMount} from 'ahooks';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KRNEventEmitter} from '@krn/bridge';
import {tracker} from '@krn/toolkit';
import {DebugBar} from '@krn/ui';
import {focusManager} from '@tanstack/react-query';

import {languages} from 'config';
import {getNativeInfo, setNativeInfo} from 'utils/helper';

export const BaseLayoutContext = React.createContext();
BaseLayoutContext.displayName = 'baseLayoutContext';

const BaseLayout = ({children, lang: propsLang}) => {
  const [lang, setLang] = useState(propsLang);
  const userInfo = useSelector(state => state.app.userInfo);
  const dispatch = useDispatch();

  const contextValue = useMemo(() => {
    return {lang, setLang};
  }, [lang, setLang]);

  const [enableDebugBar, setEnableDebugBar] = useState(__DEV__);

  // 获取语言
  useMount(async () => {
    // QueryPreloadController.initPreWriteQueriesData();

    const nativeInfo = await getNativeInfo();
    // 设置语言
    if (languages.some(i => i === nativeInfo.lang)) {
      setLang(nativeInfo.lang);
    }

    // await QueryPreloadController.preWriteQueryData(
    //   [QueryKeys.queryTraderDetailShowInfoSummary, '471'],
    //   {
    //     data: {
    //       nickName: 'asdasdasdasdsa-1qwdasd',
    //       avatar: '',
    //       leadDays: 300,
    //     },
    //   },
    // );
    // await QueryPreloadController.preWriteQueryData(
    //   [QueryKeys.queryTraderDetailShowInfoSummary, 471],
    //   {
    //     data: {
    //       nickName: '-1qwdasd-number',
    //       avatar: '',
    //       leadDays: 300,
    //     },
    //   },
    // );
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
        const nativeInfo = await getNativeInfo();
        if (nativeInfo.apiType === 'dev') setEnableDebugBar(true);
        await setNativeInfo({...nativeInfo, lang: userInfo.language});
      })();
    }
  }, [userInfo?.language]);

  // app触发登录成功后，执行initApp
  useEffect(() => {
    const subscription = KRNEventEmitter.addListener('onLoginSuccess', () => {
      dispatch({type: 'app/initApp'});
    });

    // 监听页面进入前台
    const subscriptionShow = KRNEventEmitter.addListener('onShow', () => {
      focusManager.setFocused(true);

      tracker.setConfigInfo({preLoadTime: Date.now()});
    });
    // 监听页面进入后台
    const subscriptionHide = KRNEventEmitter.addListener('onHide', () => {
      focusManager.setFocused(false);

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

  return (
    <BaseLayoutContext.Provider value={contextValue}>
      {children}
      {enableDebugBar ? (
        <DebugBar enableBar setEnableBar={setEnableDebugBar} />
      ) : null}
    </BaseLayoutContext.Provider>
  );
};

export default memo(BaseLayout);
