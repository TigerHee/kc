/**
 * Owner: garuda@kupotech.com
 */
import { createContext, useContext } from 'react';

import { floadToPercent, orderVars } from './builtinCommon';

export { orderVars };

// 校验密码 context
export const VerifyContext = createContext();

// 使用 verifyContext
export const useVerify = () => {
  return useContext(VerifyContext);
};

// 双表单的 context
export const FuturesFormContext = createContext();
// 使用 context
export const useFuturesForm = () => {
  return useContext(FuturesFormContext);
};

// 交易方向
export const SELL = 'sell';
export const BUY = 'buy';

// 订单类型
export const LIMIT = 'limit';
export const MARKET = 'market';
export const STOP = 'stop';
export const STOP_LIMIT = 'stop_limit';
export const STOP_MARKET = 'stop_market';
export const ADVANCED_LIMIT = 'advanced_limit';
export const HIDDEN_LIMIT = 'hidden_limit';
export const ADVANCED_ORDER_TYPE = 'advancedOrderType'; // 高级委托类型
export const STOP_ORDER_TYPE = 'stopOrderType'; // 条件单类型

// 高级委托选项
export const ADVANCED_POST_ONLY = 'postOnly';
export const ADVANCED_FOK = 'FOK';
export const ADVANCED_IOC = 'IOC';

// check flow 弹框选项
export const CHECK_DEEP = 'deep';
export const CHECK_PRICE_GAP = 'priceGap';
export const CHECK_CONFIRM = 'confirm';
export const CHECK_RISK_LIMIT_GUIDE = 'riskLimitGuide';
export const CHECK_RISK_LIMIT_AUTO = 'riskLimitAuto';
export const CHECK_RISK_LIMIT_ORDER = 'riskLimitOrder';

// 默认校验的流程
export const CHECK_DEFAULT_FLOWS = [
  CHECK_DEEP,
  CHECK_PRICE_GAP,
  CHECK_CONFIRM,
  CHECK_RISK_LIMIT_GUIDE,
];
// 全仓默认校验流程
export const CHECK_CROSS_DEFAULT_FLOWS = [CHECK_DEEP, CHECK_PRICE_GAP, CHECK_CONFIRM];
// 需要校验深入买卖盘的逻辑订单类型
export const CHECK_DEEP_TYPE = [LIMIT, ADVANCED_LIMIT, HIDDEN_LIMIT];
// 需要校验价差逻辑的订单类型
export const CHECK_PRICE_GAP_TYPE = [LIMIT, ADVANCED_LIMIT, HIDDEN_LIMIT, MARKET];
// 需要校验二次确认的订单类型
export const CHECK_CONFIRM_TYPE = [
  LIMIT,
  ADVANCED_LIMIT,
  HIDDEN_LIMIT,
  MARKET,
  STOP,
  STOP_LIMIT,
  STOP_MARKET,
];
// 需要校验风险限额的类型
export const CHECK_RISK_LIMIT_TYPE = [LIMIT, ADVANCED_LIMIT, HIDDEN_LIMIT, MARKET];

// check 流程配置
export const CHECK_FLOW = {
  [CHECK_DEEP]: {
    checkRule: CHECK_DEEP_TYPE,
    type: CHECK_DEEP,
  },
  [CHECK_PRICE_GAP]: {
    checkRule: CHECK_PRICE_GAP_TYPE,
    type: CHECK_PRICE_GAP,
  },
  [CHECK_CONFIRM]: {
    checkRule: CHECK_CONFIRM_TYPE,
    type: CHECK_CONFIRM,
  },
  [CHECK_RISK_LIMIT_GUIDE]: {
    checkRule: CHECK_RISK_LIMIT_TYPE,
    type: CHECK_RISK_LIMIT_GUIDE,
  },
  [CHECK_RISK_LIMIT_AUTO]: {
    checkRule: CHECK_RISK_LIMIT_TYPE,
    type: CHECK_RISK_LIMIT_AUTO,
  },
  [CHECK_RISK_LIMIT_ORDER]: {
    checkRule: CHECK_RISK_LIMIT_TYPE,
    type: CHECK_RISK_LIMIT_ORDER,
  },
};

// 需要校准的订单类型
export const STOP_CHECK_KEY = [STOP_LIMIT, STOP_MARKET, ADVANCED_LIMIT, HIDDEN_LIMIT];
// 条件单
export const STOP_ORDERS = [STOP_LIMIT, STOP_MARKET];
// 高级委托订单
export const ADVANCED_ORDERS = [ADVANCED_LIMIT, HIDDEN_LIMIT];
// 体验金不能玩的订单类型
export const TRIAL_FUND_DISABLED = [ADVANCED_LIMIT, HIDDEN_LIMIT];
// 需要计算器回填的订单类型
export const CALC_BACK_FILL = [LIMIT, ADVANCED_LIMIT];
// 计算 limit 限价类型的订单
export const CALC_LIMIT = [LIMIT, STOP_LIMIT, ADVANCED_LIMIT, HIDDEN_LIMIT];
// 计算 market 市价类型的订单
export const CALC_MARKET = [MARKET, STOP_MARKET];

// Size 刻度
export const Rates = [
  {
    value: 0.25,
    label: floadToPercent(0.25, { isPositive: false }),
  },
  {
    value: 0.5,
    label: floadToPercent(0.5, { isPositive: false }),
  },
  {
    value: 0.75,
    label: floadToPercent(0.75, { isPositive: false }),
  },
  {
    value: 1,
    label: floadToPercent(1, { isPositive: false }),
  },
];

export const FULL_RATIO = 1;
export const RATIO_INCREMENT = 0.01;
export const USDS_MIN_VALUE = 0.01;

// 确认弹框 Key
export const CONFIRM_DIALOG_EVENT_KEY = 'futures@tradeConfirmDialog';

export const STOP_LABEL = {
  TP: 'trade.order.lastPrice',
  MP: 'refer.markPrice',
  IP: 'trade.order.indexPrice',
};

export const TABS_PROFIT = 'Profit';
export const TABS_LIQUIDATION = 'Liquidation';
export const TABS_CLOSE = 'ClosePrice';

// 计算器type
export const BTN_BUY = 'long';
export const BTN_SELL = 'short';

export const TABS_CONFIG = [
  { value: TABS_PROFIT, label: 'calc.income' },
  { value: TABS_LIQUIDATION, label: 'trade.positionsOrders.liquidationPrice' },
  { value: TABS_CLOSE, label: 'calc.tab.closePrise' },
];

// 杠杆最小值
export const LEVERAGE_MIN = 1;

// 默认杠杆
export const DEFAULT_LEVERAGE = 5;
export const DEFAULT_MAX_LEVERAGE = 10;

// 计算器埋点 tab
export const CALC_SENSORS_TYPE = {
  [TABS_PROFIT]: 'Profit',
  [TABS_LIQUIDATION]: 'LiqPrice',
  [TABS_CLOSE]: 'ClosePrice',
};

export const qtyMarks = {
  0: floadToPercent(0, { isPositive: false }),
  0.25: floadToPercent(0.25, { isPositive: false }),
  0.5: floadToPercent(0.5, { isPositive: false }),
  0.75: floadToPercent(0.75, { isPositive: false }),
  1: floadToPercent(1, { isPositive: false }),
};
