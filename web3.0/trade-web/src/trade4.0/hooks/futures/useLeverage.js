/**
 * Owner: garuda@kupotech.com
 * 杠杆
 */
import { useMemo, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { getState, evtEmitter as eventEmmiter } from 'helper';
import { get } from 'lodash';

import { useGetSymbolInfo, getSymbolInfo } from '@/hooks/common/useSymbol';

import { FUTURES } from '@/meta/const';
import {
  MARGIN_MODE_ISOLATED,
  DEFAULT_LEVERAGE,
  MARGIN_MODE_CROSS,
  DEFAULT_CROSS_LEVERAGE,
} from '@/meta/futures';

// leverageMap 存放杠杆的 map 对象
// maxLeverageMap 存放最大杠杆的 map 对象

const event = eventEmmiter.getEvt();
const emptyObject = {};

// 打开杠杆弹框
export const useLeverageDialog = () => {
  const dispatch = useDispatch();
  const openLeverageDialog = useCallback(({ symbol, marginMode }) => {
    event.emit('event/futures@leverage_dialog_open', { symbol, marginMode });
  }, []);

  const closeLeverageDialog = useCallback(() => {
    event.emit('event/futures@leverage_dialog_close');
  }, []);

  const onCrossLeverageSubmit = useCallback(
    ({ leverage, symbol }) => {
      dispatch({
        type: 'futuresCommon/crossLeverageChange',
        payload: {
          leverage,
          symbol,
        },
      });
    },
    [dispatch],
  );

  const onIsolatedLeverageSubmit = useCallback(
    ({ leverage, symbol }) => {
      dispatch({
        type: 'futuresCommon/isolatedLeverageChange',
        payload: {
          leverage,
          symbol,
        },
      });
    },
    [dispatch],
  );

  const getV2UserMaxLeverage = useCallback(
    (symbol) => {
      dispatch({
        type: 'futuresCommon/getV2UserMaxLeverage',
        payload: {
          symbol,
        },
      });
    },
    [dispatch],
  );

  return {
    openLeverageDialog,
    closeLeverageDialog,
    onCrossLeverageSubmit,
    onIsolatedLeverageSubmit,
    getV2UserMaxLeverage,
  };
};

// 获取最大杠杆值
export const useGetMaxLeverage = ({
  symbol,
  marginMode = MARGIN_MODE_ISOLATED,
  switchTrialFund,
  isUser = false, // 是否获取的用户最大杠杆
  needDefault = false,
}) => {
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const isLogin = useSelector((state) => state.user.isLogin);
  const maxIsolatedLeverageMap =
    useSelector((state) => state.futuresCommon.maxIsolatedLeverageMap) || emptyObject;
  const maxCrossLeverageMap =
    useSelector((state) => state.futuresCommon.maxCrossLeverageMap) || emptyObject;
  // 体验金没有修改弹出的位置，可以直接拿一个固定值 TIPS: 后面干掉好处理
  const trialFundUserMaxLeverage = useSelector(
    (state) => state.futuresCommon.trialFundUserMaxLeverage,
  );

  const isCross = marginMode === MARGIN_MODE_CROSS;
  const maxLeverage = useMemo(() => {
    if (!isLogin || !isUser) {
      return symbolInfo?.maxLeverage;
    }
    if (switchTrialFund) {
      return trialFundUserMaxLeverage;
    }
    let currentMaxLeverage = '';
    if (isCross) {
      currentMaxLeverage = maxCrossLeverageMap[symbol];
    } else {
      currentMaxLeverage = maxIsolatedLeverageMap[symbol];
    }
    if (!currentMaxLeverage && needDefault) {
      return isCross ? DEFAULT_CROSS_LEVERAGE : DEFAULT_LEVERAGE;
    }
    return currentMaxLeverage;
  }, [
    isCross,
    isLogin,
    isUser,
    maxCrossLeverageMap,
    maxIsolatedLeverageMap,
    needDefault,
    switchTrialFund,
    symbol,
    symbolInfo.maxLeverage,
    trialFundUserMaxLeverage,
  ]);

  return maxLeverage;
};

// 获取当前杠杆值
export const useGetLeverage = ({
  symbol,
  marginMode = MARGIN_MODE_ISOLATED,
  needDefault = true,
}) => {
  const crossLeverageMap =
    useSelector((state) => state.futuresCommon.crossLeverageMap) || emptyObject;
  const isolatedLeverageMap =
    useSelector((state) => state.futuresCommon.isolatedLeverageMap) || emptyObject;

  const isCross = marginMode === MARGIN_MODE_CROSS;
  const leverage = useMemo(() => {
    let currentLeverage = '';
    if (isCross) {
      currentLeverage = crossLeverageMap[symbol];
    } else {
      currentLeverage = isolatedLeverageMap[symbol];
    }
    if (!currentLeverage && needDefault) {
      currentLeverage = isCross ? DEFAULT_CROSS_LEVERAGE : DEFAULT_LEVERAGE;
    }
    return currentLeverage;
  }, [isCross, needDefault, crossLeverageMap, symbol, isolatedLeverageMap]);

  return leverage;
};

// 返回 store 获取杠杆值
export const getLeverage = ({ symbol, marginMode = MARGIN_MODE_ISOLATED, needDefault = true }) => {
  const isolatedLeverageMap =
    getState((state) => state.futuresCommon.isolatedLeverageMap) || emptyObject;
  const crossLeverageMap = getState((state) => state.futuresCommon.crossLeverageMap) || emptyObject;

  const isCross = marginMode === MARGIN_MODE_CROSS;
  let currentLeverage = '';
  if (isCross) {
    currentLeverage = crossLeverageMap[symbol];
  } else {
    currentLeverage = isolatedLeverageMap[symbol];
  }
  if (!currentLeverage && needDefault) {
    currentLeverage = isCross ? DEFAULT_CROSS_LEVERAGE : DEFAULT_LEVERAGE;
  }
  return currentLeverage;
};

export const getMaxLeverage = ({
  symbol,
  marginMode = MARGIN_MODE_ISOLATED,
  switchTrialFund,
  isUser = false, // 是否获取的用户最大杠杆
  needDefault = false,
}) => {
  const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
  const isLogin = getState((state) => state.user.isLogin);
  const maxIsolatedLeverageMap =
    getState((state) => state.futuresCommon.maxIsolatedLeverageMap) || emptyObject;
  const maxCrossLeverageMap =
    getState((state) => state.futuresCommon.maxCrossLeverageMap) || emptyObject;
  // 体验金没有修改弹出的位置，可以直接拿一个固定值 TIPS: 后面干掉好处理
  const trialFundUserMaxLeverage = getState(
    (state) => state.futuresCommon.trialFundUserMaxLeverage,
  );

  const symbolMaxLeverage = get(symbolInfo, 'maxLeverage', DEFAULT_LEVERAGE);
  const isCross = marginMode === MARGIN_MODE_CROSS;

  if (!isLogin || !isUser) {
    return symbolMaxLeverage;
  }
  if (switchTrialFund) {
    return trialFundUserMaxLeverage;
  }
  let currentMaxLeverage = '';
  if (isCross) {
    currentMaxLeverage = maxCrossLeverageMap[symbol];
  } else {
    currentMaxLeverage = maxIsolatedLeverageMap[symbol];
  }
  if (!currentMaxLeverage && needDefault) {
    return isCross ? DEFAULT_CROSS_LEVERAGE : DEFAULT_LEVERAGE;
  }
  return currentMaxLeverage;
};
