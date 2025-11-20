/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import Decimal from 'decimal.js';
import { dropZero } from 'Bot/helper';
import useTicker from 'Bot/hooks/useTicker';

// 处理现货网格创建的必须参数
const useCreateInfo = (currentSymbol) => {
  const dispatch = useDispatch();
  let createInfo = useSelector((state) => state.superai?.createInfo) || {};
  const symbolInfo = useSpotSymbolInfo(currentSymbol);

  createInfo = createInfo[currentSymbol] || {
    lowerLimit: 0,
    upperLimit: 0,
    gridNum: 0,
    minInvestment: 0,
  };
  const fresh = useCallback(() => {
    dispatch({
      type: 'superai/getCreateInfo',
      payload: currentSymbol,
    });
  }, [currentSymbol]);
  useTicker(fresh, { isTriggerByLogin: false });
  const ai = createInfo;
  const pricePrecision = symbolInfo.pricePrecision;
  const quotaPrecision = symbolInfo.quotaPrecision;
  return {
    symbolInfo,
    aiInfo: useMemo(() => {
      return {
        lastTradedPrice: dropZero(
          Decimal(ai.lastTradedPrice || 0).toFixed(pricePrecision, Decimal.ROUND_DOWN),
        ),
        min: dropZero(Decimal(ai.lowerLimit || 0).toFixed(pricePrecision, Decimal.ROUND_DOWN)),
        max: dropZero(Decimal(ai.upperLimit || 0).toFixed(pricePrecision, Decimal.ROUND_DOWN)),
        gridNum: ai.gridNum || 0,
        minInvestment: dropZero(
          Decimal(ai.minInvestment || 0).toFixed(quotaPrecision, Decimal.ROUND_UP),
        ),
      };
    }, [ai, pricePrecision, quotaPrecision]),
  };
};

export default useCreateInfo;
