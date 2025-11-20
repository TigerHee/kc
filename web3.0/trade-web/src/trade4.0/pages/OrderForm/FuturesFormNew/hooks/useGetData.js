/**
 * Owner: garuda@kupotech.com
 * 下单模块的 models 取值
 * 取值先从 下单的 models 中取，后续再看是否需要修改
 */
import { useMemo } from 'react';

import { useSelector } from 'react-redux';

import { get } from 'lodash';

import {
  getStore,
  _t,
  dividedBy,
  plus,
  CURRENCY_UNIT,
  formatCurrency,
  getState,
} from '../builtinCommon';
import { useYScreen } from '../builtinHooks';

import { STOP } from '../config';

// 获取当前 symbol 信息
export const useGetSymbolInfo = () => {
  const symbol = useSelector((state) => state.futuresForm.currentSymbol);
  const symbolInfo = useSelector((state) => state.futuresForm.symbolInfo);

  return {
    symbol,
    symbolInfo,
  };
};

// 获取用户信息
export const useGetUserInfo = () => {
  const userMaxLeverage = useSelector((state) => state.futuresForm.userMaxLeverage);
  const isOpen = useSelector((state) => state.futuresForm.isOpen);
  const securityStatus = useSelector((state) => state.futuresForm.securtyStatus);

  return {
    userMaxLeverage,
    isOpen,
    securityStatus,
  };
};

// 获取是否登录
export const useGetIsLogin = () => {
  const isLogin = useSelector((state) => state.futuresForm.isLogin);
  return isLogin;
};

// 获取用户费率
export const useGetFeeRate = () => {
  const takerFeeRate = useSelector((state) => state.futuresForm.takerFeeRate);
  const fixTakerFee = useSelector((state) => state.futuresForm.fixTakerFee);
  return {
    takerFeeRate,
    fixTakerFee,
  };
};

// 静态获取用户费率
export const getFeeRate = () => {
  const globalState = getStore().getState();
  const takerFeeRate = get(globalState, 'futuresForm.takerFeeRate', '0');
  const fixTakerFee = get(globalState, 'futuresForm.fixTakerFee', '0');
  return { takerFeeRate, fixTakerFee };
};

// 获取杠杆
export const useGetLeverage = () => {
  const leverage = useSelector((state) => state.futuresForm.leverage);
  return leverage;
};

// 获取当前选中的 tab
export const useGetActiveTab = () => {
  const activeTab = useSelector((state) => state.futuresForm.activeTab);
  const stopOrderType = useSelector((state) => state.futuresForm.stopOrderType);

  const orderType = useMemo(() => {
    let type = activeTab;
    // 判断是否为条件单，做一个兼容
    if (activeTab === STOP) {
      type = stopOrderType;
    }
    return type;
  }, [activeTab, stopOrderType]);

  return {
    activeTab,
    stopOrderType,
    orderType,
  };
};

// 获取买一卖一
export const useGetBBO = () => {
  const bid1 = useSelector((state) => state.futuresForm.bid1);
  const ask1 = useSelector((state) => state.futuresForm.ask1);

  return { bid1, ask1 };
};

// 获取交易单位
export const useGetUnit = () => {
  const chooseUSDsUnit = useSelector((state) => state.futuresForm.chooseUSDsUnit);
  const tradingUnit = useSelector((state) => state.futuresForm.tradingUnit);
  const contract = useSelector((state) => state.futuresForm.symbolInfo);

  const unit = useMemo(() => {
    if (contract && tradingUnit === CURRENCY_UNIT && !contract.isInverse) {
      return formatCurrency(contract.baseCurrency);
    }
    return _t('global.unit');
  }, [tradingUnit, contract]);

  return { chooseUSDsUnit, tradingUnit, unit };
};

// 获取余额
export const useGetAvailableBalance = () => {
  const availableBalance = useSelector((state) => state.futuresForm.availableBalance);
  return availableBalance;
};

// 获取偏好设置保存的弹框状态
export const useGetSetting = () => {
  const confirmOrder = useSelector((state) => state.futuresForm.confirmOrder);
  const priceGapConfirm = useSelector((state) => state.futuresForm.priceGapConfirm);
  const deepConfirm = useSelector((state) => state.futuresForm.deepConfirm);
  const authAdvancedOrder = useSelector((state) => state.futuresForm.authAdvancedOrder);
  const authStopOrder = useSelector((state) => state.futuresForm.authStopOrder);
  const authPnl = useSelector((state) => state.futuresForm.authPnl);

  return {
    confirmOrder,
    priceGapConfirm,
    deepConfirm,
    authAdvancedOrder,
    authStopOrder,
    authPnl,
  };
};

// 获取仓位Size
export const useGetPositionSize = () => {
  const positionSize = useSelector((state) => state.futuresForm.positionSize);
  return positionSize;
};

// 获取强平价格
export const useGetLiquidationPrice = () => {
  const liquidationPrice = useSelector((state) => state.futuresForm.liquidationPrice);
  return liquidationPrice;
};

// 获取 lastPrice
export const useGetLastPrice = () => {
  const lastPrice = useSelector((state) => state.futuresForm.lastPrice);
  return lastPrice;
};

// 获取市价 price
export const useGetMarketPrice = () => {
  const { ask1, bid1 } = useGetBBO();

  const price = useMemo(() => {
    // 市价单：根据当前买卖盘的买一卖一价的平均值进行换算
    return ask1 && bid1 ? dividedBy(plus(ask1)(bid1))(2) : ask1 || bid1 || 0;
  }, [ask1, bid1]);

  return price;
};

// 获取是否开启下单缓存
export const useGetOpenStash = () => {
  const openStash = useSelector((state) => state.futuresForm.openStash);
  return openStash;
};

// 获取是否为竖轴小屏幕
export const useGetYSmall = () => {
  const yScreen = useYScreen();

  const isYScreenSM = useMemo(() => {
    return yScreen === 'sm';
  }, [yScreen]);

  return isYScreenSM;
};

// 获取 setting 的低频更新对象
export const getSetting = () => {
  const globalState = getStore().getState();
  const confirmOrder = get(globalState, 'futuresForm.confirmOrder');
  const priceGapConfirm = get(globalState, 'futuresForm.priceGapConfirm');
  const deepConfirm = get(globalState, 'futuresForm.deepConfirm');

  return {
    confirmOrder,
    priceGapConfirm,
    deepConfirm,
  };
};

// 获取 symbolInfo 的低频更新对象
export const getSymbolInfo = () => {
  const globalState = getStore().getState();
  const symbol = get(globalState, 'futuresForm.currentSymbol');
  const symbolInfo = get(globalState, 'futuresForm.symbolInfo');
  return {
    symbol,
    symbolInfo,
  };
};

// 获取仓位Size 低频更新对象
export const getPositionSize = () => {
  const globalState = getStore().getState();
  const positionSize = get(globalState, 'futuresForm.positionSize');
  return positionSize;
};

// 获取余额 低频率更新对象
export const getAvailableBalance = () => {
  const globalState = getStore().getState();
  const availableBalance = get(globalState, 'futuresForm.availableBalance', 0);
  return availableBalance;
};

// 获取 买一卖一 低频率更新对象
export const getBBO = () => {
  const globalState = getStore().getState();
  const bid1 = get(globalState, 'futuresForm.bid1');
  const ask1 = get(globalState, 'futuresForm.ask1');

  return { bid1, ask1 };
};

// 获取 标记价格 低频率更新对象
export const getMarkPrice = () => {
  const globalState = getStore().getState();
  const markPrice = get(globalState, 'futuresForm.markPrice');
  return markPrice;
};

// 获取 rangData 低频率更新对象
export const getRangeData = () => {
  const globalState = getStore().getState();
  const rangeData = get(globalState, 'futuresForm.rangeData');
  return rangeData;
};

// 获取 stop triggerPrice (TP/MP/IP) 低频率更新对象
export const getTriggerPrice = () => {
  const globalState = getStore().getState();
  const markPrice = get(globalState, 'futuresForm.markPrice');
  const indexPrice = get(globalState, 'futuresForm.indexPrice');
  const lastPrice = get(globalState, 'futuresForm.lastPrice');

  return { markPrice, indexPrice, lastPrice };
};

// 获取低频率更新的杠杆值
export const getLeverage = () => {
  const globalState = getStore().getState();
  const leverage = get(globalState, 'futuresForm.leverage');
  return leverage;
};

// 获取低频率更新的交易单位
export const getUnit = () => {
  const globalState = getStore().getState();
  const chooseUSDsUnit = get(globalState, 'futuresForm.chooseUSDsUnit');
  const tradingUnit = get(globalState, 'futuresForm.tradingUnit');
  const contract = get(globalState, 'futuresForm.symbolInfo');

  const ZText = _t('global.unit');

  let unit = ZText;

  if (contract && tradingUnit === CURRENCY_UNIT && !contract.isInverse) {
    unit = formatCurrency(contract.baseCurrency);
  }

  const isQuantity = unit === ZText;

  return { chooseUSDsUnit, tradingUnit, unit, contract, isQuantity };
};

// 获取低频是否下单缓存
export const getOpenStash = () => {
  const globalState = getStore().getState();
  const openStash = get(globalState, 'futuresForm.openStash');
  return openStash;
};

// 获取低频的选中状态
export const getActiveTab = () => {
  const activeTab = getState((state) => state.futuresForm.activeTab);
  const stopOrderType = getState((state) => state.futuresForm.stopOrderType);

  let orderType = activeTab;

  // 判断是否为条件单，做一个兼容
  if (activeTab === STOP) {
    orderType = stopOrderType;
  }

  return {
    activeTab,
    stopOrderType,
    orderType,
  };
};
