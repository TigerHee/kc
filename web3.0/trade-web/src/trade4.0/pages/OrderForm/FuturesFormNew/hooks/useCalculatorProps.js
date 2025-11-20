/**
 * Owner: garuda@kupotech.com
 * 该 hooks 传递 计算器弹框所需参数
 */

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { get } from 'lodash';

import { getSymbolInfo, getUnit } from './useGetData';

import { getStore } from '../builtinCommon';
import { getCurrenciesPrecision } from '../builtinHooks';

export const useCalculatorTabsActive = () => {
  const dispatch = useDispatch();
  const tabsActive = useSelector((state) => state.futuresForm.calculatorTabsActive);

  const onTabsChange = useCallback(
    (e, v) => {
      dispatch({ type: 'futuresForm/update', payload: { calculatorTabsActive: v } });
    },
    [dispatch],
  );

  return {
    tabsActive,
    onTabsChange,
  };
};

export const useCalculatorBtnType = () => {
  const dispatch = useDispatch();
  const btnType = useSelector((state) => state.futuresForm.calculatorBtnType);

  const onBtnTypeChange = useCallback(
    (v) => {
      dispatch({ type: 'futuresForm/update', payload: { calculatorBtnType: v } });
    },
    [dispatch],
  );

  return {
    btnType,
    onBtnTypeChange,
  };
};

export const useCalculatorVisible = () => {
  const calculatorVisible = useSelector((state) => state.futuresForm.calculatorVisible);
  return calculatorVisible;
};

export const useCalculatorOpen = () => {
  const dispatch = useDispatch();
  const onCalculatorVisible = useCallback(
    (visible) => {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          calculatorVisible: visible,
        },
      });
    },
    [dispatch],
  );
  return onCalculatorVisible;
};

export const useCalculatorStashCache = () => {
  const dispatch = useDispatch();
  const onCalculatorStashCache = useCallback(
    (data) => {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          calcStashCache: data,
        },
      });
    },
    [dispatch],
  );
  return onCalculatorStashCache;
};

export const getCalculatorProps = () => {
  const globalState = getStore().getState();
  const btnType = get(globalState, 'futuresForm.calculatorBtnType');
  const leverage = get(globalState, 'futuresForm.calculatorLeverage');
  const { tradingUnit } = getUnit();
  const { symbolInfo } = getSymbolInfo();
  const { shortPrecision } = getCurrenciesPrecision(symbolInfo?.settleCurrency);

  return {
    btnType,
    leverage,
    tradingUnit,
    symbolInfo,
    shortPrecision,
  };
};
