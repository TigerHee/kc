import {useRafInterval, useUnmount} from 'ahooks';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {usePullFuturesBasicGuard} from './usePullFuturesBasicGuard';

//更新交易员信息
const PULL_BASIC_LEAD_INFO_INTERVAL = 1000 * 60 * 3;

export const useInitCopyTradingData = ({isMainPage, isLeader}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.app.userInfo);
  usePullFuturesBasicGuard();

  const pullBasicData = useCallback(() => {
    if (!userInfo || !isMainPage) return;

    dispatch({type: 'leadInfo/pullUserLeadInfo'});
  }, [isMainPage, userInfo]);

  useEffect(() => {
    dispatch({
      type: 'leadInfo/update',
      // android 传递 boolean ，ios 传递 true 字符串
      payload: {isLeadTrader: isLeader === 'true' || isLeader === true},
    });
  }, [isLeader]);

  //三分钟轮训更新带单员身份 ，带单员冻结等情况
  const clearInterval = useRafInterval(
    pullBasicData,
    PULL_BASIC_LEAD_INFO_INTERVAL,
    {
      immediate: false,
    },
  );

  useUnmount(() => {
    clearInterval();
  });
};
