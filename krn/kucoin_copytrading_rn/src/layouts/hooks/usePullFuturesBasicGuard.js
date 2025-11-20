import {useRafInterval, useUnmount} from 'ahooks';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

// 一分钟一次
const CHECK_TIME = 60 * 1000;

/** 合约基本信息 交易对映射 */
export const usePullFuturesBasicGuard = () => {
  const dispatch = useDispatch();
  const futuresSymbols = useSelector(state => state.futures.futuresSymbols);
  const isValidFuturesSymbols = futuresSymbols?.length > 0;
  useEffect(() => {
    dispatch({type: 'futures/init'});
  }, [dispatch]);

  const clearInterval = useRafInterval(
    () => {
      // 无数据定时拉取

      if (!isValidFuturesSymbols) {
        dispatch({
          type: 'futures/pullFuturesSymbols',
        });
      }
    },
    CHECK_TIME,
    {immediate: false},
  );

  useUnmount(() => {
    clearInterval?.();
  });

  useEffect(() => {
    // 有数据销毁guard 逻辑
    if (isValidFuturesSymbols) {
      clearInterval?.();
    }
  }, [isValidFuturesSymbols]);
};
