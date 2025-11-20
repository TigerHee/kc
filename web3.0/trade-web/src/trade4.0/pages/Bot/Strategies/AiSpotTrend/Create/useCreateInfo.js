/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';

/**
 * @description: 初始化交易对数据
 * @param {*} symbol
 * @return {*}
 */
const useInitParamsBySymbol = (symbol) => {
  const createPageParams = useSelector((state) => state.aispottrend.createPageParams);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'aispottrend/getCreatePageChart',
      payload: {
        symbol,
      },
    });
  }, [symbol]);
  return (
    createPageParams[symbol] ?? {
      minInvestment: 0, // 最小投资额
      maxInvestment: 100000, // 最大投资额
      hourKline: [], // 小时K线收盘价
      arbitrageInfo: [], // 套利信息
    }
  );
};

export default useInitParamsBySymbol;
