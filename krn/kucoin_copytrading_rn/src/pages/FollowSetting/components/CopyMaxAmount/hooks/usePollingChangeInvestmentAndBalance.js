import {useRafInterval, useUnmount} from 'ahooks';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {useFocusEffect} from 'hooks/hybridNavigation/useFocusEffect';
//10s 一次
const POLLING_TIME = 10 * 1000;

/** 拉取可调整仓位限额与账户余额 */
export const usePollingChangeInvestmentAndBalance = ({
  refetchMaxChangeInvestment,
}) => {
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      refetchMaxChangeInvestment();
    }, [refetchMaxChangeInvestment]),
  );

  const clearInterval = useRafInterval(
    () => {
      // 定时拉取
      dispatch({type: 'assets/pullAccountCoins'});
      refetchMaxChangeInvestment();
    },
    POLLING_TIME,
    {immediate: false},
  );

  useUnmount(() => {
    clearInterval?.();
  });
};
