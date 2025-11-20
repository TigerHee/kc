/**
 * Owner: mike@kupotech.com
 */
import React, { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';

// 主要用里面的minAmount
const useCreateInfo = (symbol) => {
  const createInfo = useSelector((state) => state.futuregrid.createInfo);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch({
      type: 'futuregrid/getCreateInfo',
      payload: symbol,
    });
  }, [symbol]);

  return (
    createInfo[symbol] || {
      symbolCode: symbol,
      minAmount: 0,
      precision: 8,
    }
  );
};

export default useCreateInfo;
