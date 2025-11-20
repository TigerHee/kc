/**
 * Owner: garuda@kupotech.com
 */
export const PFL_KEY = 'PFL'; // 委托部分成交
export const FFL_KEY = 'FFL'; // 委托已完全成交
export const STOP_TRIGGER_KEY = 'STOP_TRIGGER'; // 条件委托已触发
export const LIQUIDATION_KEY = 'LIQUIDATION'; // 强制平仓
export const APPEND_MARGIN_KEY = 'APPEND_MARGIN'; // 自动追加保证金
export const AUTO_CLOSE_KEY = 'AUTO_CLOSE'; // 自动减仓
export const DEPOSIT_KEY = 'DEPOSIT'; // 充值到账
export const ORDER_CANCELLED_KEY = 'ORDER_CANCELLED'; // 取消订单

export const LIMIT_KEY = 'LIMIT'; // 限价委托
export const MARKET_KEY = 'MARKET'; // 市价委托
export const OPTIONAL_KEY = 'OPTIONAL'; // 条件委托
export const MISOPERATION_KEY = 'MISOPERATION'; // 下单价格深入买卖盘
export const PRICE_DEVIATION_KEY = 'LIMIT_CLOSE'; // 买卖盘与标记价格差大 FIXME: 暂时使用 限价平仓的key
export const AUTO_APPEND_MARGIN_KEY = 'AUTO_APPEND_MARGIN'; // 自动追加保证金提示

export const WEB_NOTICE_CONFIG = 'WEB_NOTICE_CONFIG';
export const CONFIRM_CONFIG = 'CONFIRM_CONFIG'; // 弹框提示

export const NOTICE_CONFIRM = [
  {
    label: 'preferences.orderPartiallyFilled',
    type: PFL_KEY,
  },
  {
    label: 'preferences.orderFilled',
    type: FFL_KEY,
  },
  {
    label: 'preferences.stopTriggered',
    type: STOP_TRIGGER_KEY,
  },
  {
    label: 'preferences.new.orderCancel',
    type: ORDER_CANCELLED_KEY,
  },
  {
    label: 'preferences.liquidation',
    type: LIQUIDATION_KEY,
  },
  {
    label: 'preferences.appendMargin',
    type: APPEND_MARGIN_KEY,
  },
  {
    label: 'preferences.deleveraging',
    type: AUTO_CLOSE_KEY,
  },
  {
    label: 'preferences.deposit',
    type: DEPOSIT_KEY,
  },
];

export const TRADE_CONFIRM = [
  {
    label: 'preferences.limitOrder',
    type: LIMIT_KEY,
  },
  {
    label: 'preferences.marketOrder',
    type: MARKET_KEY,
  },
  {
    label: 'preferences.stopOrder',
    type: OPTIONAL_KEY,
  },
];

export const MISUSE_CONFIRM = [
  {
    label: 'setting.misuse.lowPrice',
    type: MISOPERATION_KEY,
  },
  {
    label: 'setting.misuse.indexPrice',
    type: PRICE_DEVIATION_KEY,
  },
];

// 所有的通知提示
export const ALL_NOTICE_CONFIRM_KEY = [
  PFL_KEY,
  FFL_KEY,
  STOP_TRIGGER_KEY,
  ORDER_CANCELLED_KEY,
  LIQUIDATION_KEY,
  APPEND_MARGIN_KEY,
  AUTO_CLOSE_KEY,
  DEPOSIT_KEY,
];

// 所有的确认提示
export const ALL_DIALOG_CONFIRM_KEY = [
  LIMIT_KEY,
  MARKET_KEY,
  OPTIONAL_KEY,
  MISOPERATION_KEY,
  PRICE_DEVIATION_KEY,
  AUTO_APPEND_MARGIN_KEY,
];
