import {useMemoizedFn} from 'ahooks';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {KRNEventEmitter} from '@krn/bridge';

import useTracker from 'hooks/useTracker';
import {useIsLogin, useWithLoginFn} from 'hooks/useWithLoginFn';
import {MAIN_TAB_KEYS} from '../constant';

export const useMainTabHandler = mainTabList => {
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);
  const isLogin = useIsLogin();

  const [activeTabKey, setActiveTabKey] = useState(MAIN_TAB_KEYS.home);
  const [nextActiveKey, setNextActiveTabKey] = useState();
  const {onClickTrack} = useTracker();

  // 退出登录返回主页
  useEffect(() => {
    // 登录状态变化通知 : [“isLogin“: Bool]true:登录, false:未登录
    const subscriptionLoginStateChanged = KRNEventEmitter.addListener(
      'loginStateChanged',
      params => {
        const {isLogin} = params || {};
        if (!isLogin) {
          setActiveTabKey(MAIN_TAB_KEYS.home);
        }
      },
    );

    return () => {
      subscriptionLoginStateChanged && subscriptionLoginStateChanged.remove();
    };
  }, []);

  // 无带单员身份进入我的带单 tab 返回首页
  const enhanceActiveTabKey = useMemo(() => {
    if (
      !isLeadTrader &&
      activeTabKey === MAIN_TAB_KEYS.myLeading &&
      mainTabList?.every(i => i.itemKey !== MAIN_TAB_KEYS.myLeading)
    ) {
      return MAIN_TAB_KEYS.home;
    }
    return activeTabKey;
  }, [activeTabKey, isLeadTrader, mainTabList]);

  const trackTabClick = useMemoizedFn(activeTabKey =>
    onClickTrack({
      blockId: 'tab',
      locationId: `${activeTabKey}`,
    }),
  );

  const memoSetActiveTabKey = useCallback(
    key => {
      if (!key) return;

      const hasKeyNow = mainTabList?.some(i => i.itemKey === key);

      if (hasKeyNow) {
        setActiveTabKey(key);
        setNextActiveTabKey('');
        return;
      }

      if (!hasKeyNow) {
        setNextActiveTabKey(key);
      }
    },
    [mainTabList],
  );

  useEffect(() => {
    if (!nextActiveKey) return;
    const hasKeyNow = mainTabList?.some(i => i.itemKey === nextActiveKey);
    if (hasKeyNow) {
      setActiveTabKey(nextActiveKey);
      setNextActiveTabKey('');
    }
  }, [mainTabList, nextActiveKey]);

  const {run: activeTabWithValidLogin} = useWithLoginFn(
    memoSetActiveTabKey,
    trackTabClick,
  );

  const handleActiveTab = useMemoizedFn(activeKey => {
    // 未登录允许去首页 ，其他tab 需检查登录
    if (!isLogin && activeKey === MAIN_TAB_KEYS.home) {
      memoSetActiveTabKey(activeKey);
      return;
    }
    activeTabWithValidLogin(activeKey);
  });

  return {
    handleActiveTab,
    handleActiveTabWithoutLoginCheck: memoSetActiveTabKey,
    activeTabKey: enhanceActiveTabKey,
  };
};
