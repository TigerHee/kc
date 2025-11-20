/**
 * Owner: charles.yang@kupotech.com
 */
import storage from 'utils/storage';

// 初始化symbolFilter
let initSymbolFilter = {};
if (storage.getItem('symbol') && storage.getItem('symbolCheck')) {
  initSymbolFilter = { symbol: storage.getItem('symbol') };
}

// 后面想一起用的可以扩展到这里
export const SYMBOL_FILTER_ENUM = {
  FUTURES_ACTIVE_ORDER: 'FUTURES_ACTIVE_ORDER',
  FUTURES_STOP_ORDER: 'FUTURES_STOP_ORDER',
  FUTURES_POSITION: 'FUTURES_POSITION',
  FUTURES_TRADE_HISTORY: 'FUTURES_TRADE_HISTORY',
  FUTURES_PNL_HISTORY: 'FUTURES_PNL_HISTORY',
  FUTURES_ORDER_HISTORY: 'FUTURES_ORDER_HISTORY',
};

// 组件默认 models值
export const defaultState = {
  // symbolFIlter
  // 活跃委托
  [SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER]: storage.getItem(
    SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER,
  ),
  // 条件委托
  [SYMBOL_FILTER_ENUM.FUTURES_STOP_ORDER]: storage.getItem(SYMBOL_FILTER_ENUM.FUTURES_STOP_ORDER),
  // 订单历史
  [SYMBOL_FILTER_ENUM.FUTURES_ORDER_HISTORY]: storage.getItem(
    SYMBOL_FILTER_ENUM.FUTURES_ORDER_HISTORY,
  ),
  // 平仓盈亏
  [SYMBOL_FILTER_ENUM.FUTURES_PNL_HISTORY]: storage.getItem(SYMBOL_FILTER_ENUM.FUTURES_PNL_HISTORY),
  // 交易历史
  [SYMBOL_FILTER_ENUM.FUTURES_TRADE_HISTORY]: storage.getItem(
    SYMBOL_FILTER_ENUM.FUTURES_TRADE_HISTORY,
  ),

  pnlDetailVisible: false,
  pnlDetail: {},
  positions: [],
  dict: {},
  battleInProgress: false,
  closeOrders: [],
  // 是否只显示当前合约
  isCurrentSymbolOnly: false,
  // 追加保证金弹窗
  appendMarginVisible: false,
  // 点击追加保证金需要的信息
  appendMarginDetail: {},
  currency: '',
  liquidationVisible: false,
  liquidationType: '',
  positionItem: {},

  PLVisible: false,
  marketList: [],
  indexList: [],

  fills: [],
  fillsPagination: {},
  firstRequest: true,
  tradeHistoryOnlySymbol: false,
  fillsSymbolFilters: {},

  historyOrders: [],
  historyOrdersPagination: {},
  historyOrdersFirstRequest: true,
  orderDetail: {},
  historySymbolFilters: {},

  closedPositions: [],
  closedPositionsPagination: {},
  isPnlOnlySymbolCheck: false,
  closeDetails: {},

  advancedOrdersOnlySymbol: false,
  activeOrders: [],
  stopOrders: [],
  cancelAllVisibleStop: false,

  cancelAllVisible: false,

  checkPasswordVisible: false,
  checkPasswordFinishCancelCallback: () => {},
  checkPasswordFinishCallback: () => {},

  deepInRivalVisible: false,
  deepInRivalObject: {},
};
export const futuresPositionNameSpace = 'futures_orders';

export const xbtUnitObj = {
  XBT: {
    unitText: 'BTC',
    desc: '(Bitcoin)',
    multiplier: 1,
    displayFixed: 4,
    explain: 'Bitcoin',
  },
  mXBT: {
    unitText: 'mBTC',
    desc: '(micro-Bitcoin,1000 mBTC = 1 BTC)',
    multiplier: Math.pow(10, 3),
    displayFixed: 1,
    explain: 'micro-Bitcoin, 1000 mBTC = 1 BTC',
  },
  uXBT: {
    unitText: 'μBTC',
    desc: '(milli-Bitcoin ,1000000 μBTC = 1 BTC)',
    multiplier: Math.pow(10, 6),
    displayFixed: 3,
    explain: 'milli-Bitcoin, 1000000 μBTC = 1 BTC',
  },
  XBt: {
    unitText: 'XBt',
    desc: '(Satoshi,100000000 XBt = 1 BTC)',
    multiplier: Math.pow(10, 8),
    displayFixed: 0,
    explain: 'Satoshi, 100000000 XBt = 1 BTC',
  },
};

export const QUANTITY_UNIT = 'Quantity'; // 张 单位
export const CURRENCY_UNIT = 'BaseCurrency'; // tradeUnit currecy 单位

export const AUTH_INDEX_PRICE = 'indexPrice';

export { orderVars } from '@/meta/futures';

// 交易页面最大成交记录
export const ACTIVE_ORDER_COUNT = 150;
// 交易页面最大成交记录
export const FILLS_MAX_COUNT = 500;
// 交易页面最大委托记录
export const ORDERS_MAX_COUNT = 500;
// 交易页面最大委托记录
export const POSITION_CLOSE_MAX_COUNT = 500;
// 平仓盈亏，成交记录，委托历史的pagesize
export const PAGE_SIZE = 50;
// 平仓盈亏，成交记录，委托历史的最大请求页数
export const MAX_TOTAL_PAGE = 10;

// 止盈止损触发类型

export const stopReferences = [
  {
    text: 'trade.order.lastPrice',
    key: 'lastPrice',
    value: 'TP',
    tip: 'trade.tooltip.lastPrice',
  },
  {
    text: 'refer.markPrice',
    key: 'markPrice',
    value: 'MP',
    tip: 'trade.tooltip.indexPrice',
  },
  {
    text: 'trade.order.indexPrice',
    key: 'indexPrice',
    value: 'IP',
    tip: 'trade.tooltip.markPrice',
  },
];

export const CLOSE_ADL_LONG = 'ADL_LONG';
export const CLOSE_ADL_SHORT = 'ADL_SHORT';
export const CLOSE_LIQ_LONG = 'LIQUID_LONG';
export const CLOSE_LIQ_SHORT = 'LIQUID_SHORT';

// 触发价格类型
export const priceTypeToLocaleKey = {
  TP: 'trade.input.last',
  MP: 'pnl.switchType.mark',
  IP: 'contract.index',
};

export const MARKET = 'market';
