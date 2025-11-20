/**
 * Owner: mike@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { useLayoutEffect, useMemo } from 'react';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { dropZero } from 'Bot/helper';

// 处理无限网格创建的必须参数
const useCreateInfo = (currentSymbol) => {
  const dispatch = useDispatch();
  let createInfo = useSelector((state) => state.infinitygrid?.createInfo) || {};
  const symbolInfo = useSpotSymbolInfo(currentSymbol);
  createInfo = createInfo[currentSymbol] || {
    feeRate: 0.0008,
    minimumInvestment: 0,
    minimumOrderValue: 0,
    down: 0,
    gridProfitRatio: 0,
  };
  useLayoutEffect(() => {
    dispatch({
      type: 'infinitygrid/getCreateInfo',
      payload: currentSymbol,
    });
  }, [currentSymbol]);
  const ai = createInfo;
  const pricePrecision = symbolInfo.pricePrecision;
  return {
    symbolInfo,
    aiInfo: useMemo(() => {
      return {
        ...ai,
        down: dropZero(Decimal(ai.down).toFixed(pricePrecision, Decimal.ROUND_DOWN)),
        minimumInvestment: dropZero(
          Decimal(ai.minimumInvestment).toFixed(pricePrecision, Decimal.ROUND_DOWN),
        ),
        gridProfitRatio: ai.gridProfitRatio,
      };
    }, [ai, pricePrecision]),
  };
};

export default useCreateInfo;
