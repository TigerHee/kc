/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import useTicker from 'Bot/hooks/useTicker';

const getCacheKey = ({ symbol, leverage }) => {
  const cacheKey = [symbol];
  if (leverage) {
    cacheKey.push(leverage);
  }
  return cacheKey.join('-');
};
// 处理创建的必须参数
const useCreateInfo = ({ symbol, leverage }) => {
  const dispatch = useDispatch();
  const createInfo = useSelector((state) => state.aiFutureBilater?.createInfo) || {};
  const cacheKey = getCacheKey({ symbol, leverage });

  const fresh = useCallback(() => {
    dispatch({
      type: 'aiFutureBilater/getCreateInfo',
      payload: {
        symbol,
        leverage,
      },
    });
  }, [symbol, leverage]);

  useTicker(fresh, { isTriggerByLogin: false });

  return (
    createInfo[cacheKey] || {
      symbol,
      lastTradedPrice: 0,
      changeRate: 0,
      defaultLeverage: '2',
      maxLeverage: '10',
      minInvestment: undefined,
      maxInvestment: undefined,
    }
  );
};

export default useCreateInfo;
