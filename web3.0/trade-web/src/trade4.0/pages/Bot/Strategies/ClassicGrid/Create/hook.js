/**
 * Owner: mike@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { useLayoutEffect, useMemo } from 'react';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import Decimal from 'decimal.js';
import isEmpty from 'lodash/isEmpty';
import { floatText, dropZero } from 'Bot/helper';

// 处理现货网格创建的必须参数
export const useSpotCreateInfo = (currentSymbol) => {
  const dispatch = useDispatch();
  let createInfo = useSelector((state) => state.classicgrid?.createInfo) || {};
  const symbolInfo = useSpotSymbolInfo(currentSymbol);

  createInfo = createInfo[currentSymbol] || {
    lowerLimit: 0,
    upperLimit: 0,
    gridNum: 0,
    gridProfit: null,
    gridProfitLowerRatio: 0,
    gridProfitUpperRatio: 0,
  };
  useLayoutEffect(() => {
    dispatch({
      type: 'classicgrid/getCreateInfo',
      payload: {
        symbolCode: currentSymbol,
      },
    });
  }, [currentSymbol]);
  const ai = createInfo;
  const pricePrecision = symbolInfo.pricePrecision;
  return {
    symbolInfo,
    aiInfo: useMemo(() => {
      const t = {
        min: dropZero(Decimal(ai.lowerLimit).toFixed(pricePrecision, Decimal.ROUND_DOWN)),
        max: dropZero(Decimal(ai.upperLimit).toFixed(pricePrecision, Decimal.ROUND_DOWN)),
        placeGrid: ai.gridNum,
        ...ai,
        gridProfitLowerRatio: Decimal(ai.gridProfitLowerRatio)
          .times(100)
          .toFixed(2, Decimal.ROUND_DOWN),
        gridProfitUpperRatio: Decimal(ai.gridProfitUpperRatio)
          .times(100)
          .toFixed(2, Decimal.ROUND_DOWN),
      };
      return {
        ...t,
        gridProfit: `${floatText(t.gridProfitLowerRatio)}～${floatText(t.gridProfitUpperRatio)}`,
      };
    }, [ai, pricePrecision]),
  };
};
// 处理现货网格排行榜数据复制到自定义
export const useCopyParams = (form, setTab) => {
  const dispatch = useDispatch();
  const copyParams = useSelector((state) => state.classicgrid.copyParams);
  useLayoutEffect(() => {
    if (!isEmpty(copyParams)) {
      // 切换tab到自定义
      setTab(1);
      const { down, up, depth } = copyParams;
      form.setFieldsValue({
        min: down,
        max: up,
        placeGrid: +depth - 1,
      });
      //  清空参数
      dispatch({
        type: 'classicgrid/update',
        payload: {
          copyParams: {},
        },
      });
    }
  }, [copyParams]);
};
// 交易对变化重置表单
export const useSymbolChange = (form, symbolCode) => {
  useUpdateLayoutEffect(() => {
    form.resetFields();
    // form.resetAIToggleButton?.();
  }, [symbolCode]);
};
