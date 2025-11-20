/**
 * Owner: garuda@kupotech.com
 * 存放 futures 需要使用的一些公共变量定义
 */

export const SETTLE_CONTRACT = 'FFICSX';
export const SUSTAIN_CONTRACT = 'FFWCSX';

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

// 跟合约那边 storage key保持一致
export const storagePrefix = 'KuMEX.';

export const QUANTITY_UNIT = 'Quantity'; // 张 单位
export const CURRENCY_UNIT = 'BaseCurrency'; // tradeUnit currency 单位

// 偏好设置
export const ORDER_CONFIRM_CHECKED = 'orderConfirmChecked';
export const ORDER_DATA_SAVE_CHECKED = 'orderDataSaveChecked';

// futures modules
export const FUTURE_MODULE_MAP = {
  realisedPNL: true,
};
// 条件
export const AUTH_USER = 'user';
export const AUTH_OPEN_FUTURES = 'isOpen';
// 偏好设置
export const AUTH_ORDER_PNL = 'stopProfitAndLoss';
export const AUTH_STOP_ORDER = 'conditionalOrder';
export const AUTH_ADVANCED_INTRUST = 'seniorOrder';
export const AUTH_INDEX_PRICE = 'indexPrice';
export const AUTH_ADVANCED_POSITION = 'seniorPosition';
export const AUTH_FUNDING_RATE = 'fundingRate';

export const priceTypeToLocaleKey = {
  TP: 'contract.index.lastPrice',
  MP: 'refer.markPrice',
  IP: 'trade.order.indexPrice',
};

export const orderVars = {
  sell: 'trade.confirm.sell',
  buy: 'trade.confirm.buy',
  limit: 'limit',
  market: 'market',
  limit_stop: 'trade.order.stopLimit',
  market_stop: 'trade.order.stopMarket',
  liquid: 'liquid',
  adl: 'adl',
  settlement: 'settlement',
  up: '≥',
  down: '≤',
  advanced_limit: 'advanced.limit',
  hidden: 'futures.hidden.order',
};

export const CLOSE_ADL_LONG = 'ADL_LONG';
export const CLOSE_ADL_SHORT = 'ADL_SHORT';
export const CLOSE_LIQ_LONG = 'LIQUID_LONG';
export const CLOSE_LIQ_SHORT = 'LIQUID_SHORT';

export const CONFIRM_CONFIG = 'CONFIRM_CONFIG'; // 弹框提示
export const MISOPERATION_KEY = 'MISOPERATION'; // 下单价格深入买卖盘

export const MARGIN_MODE_CROSS = 'CROSS'; // 全仓模式
export const MARGIN_MODE_ISOLATED = 'ISOLATED'; // 逐仓模式

// 默认杠杆
export const DEFAULT_LEVERAGE = 5;
// 全仓默认杠杆倍数
export const DEFAULT_CROSS_LEVERAGE = 3;

// 交易方向
export const SELL = 'sell';
export const BUY = 'buy';

// 当前用户是否开启过全仓 local key
export const MARGIN_MODE_OPENED_STORAGE_KEY = 'futures.cross.opened';
// 当前用户的保证金模式 local key
export const MARGIN_MODE_STORAGE_KEY = 'futures.mMode';
// 当前用户的杠杆 local key
export const ISOLATED_LEVERAGE_STORAGE_KEY = 'futures.isolated.l';
export const CROSS_LEVERAGE_STORAGE_KEY = 'futures.cross.l';
export const ISOLATED_MAX_LEVERAGE_STORAGE_KEY = 'futures.isolated.max.l';
export const CROSS_MAX_LEVERAGE_STORAGE_KEY = 'futures.cross.max.l';

// 下单相关
export const CHECK_RISK_LIMIT_ORDER = 'riskLimitOrder';
// 确认弹框 Key
export const CONFIRM_DIALOG_EVENT_KEY = 'futures@tradeConfirmDialog';

export const ORDER_ACTIVE_CHANGE = 'ORDER_ACTIVE_CHANGE';
export const MAX_CHANGE_SIZE = 20;

// 可用余额不足
export const ACCOUNT_BALANCE_INSUFFICIENT = '300003';
// 下单数量超过最大可开，使用余额不足的dialog提示
export const MAX_ORDER_SIZE_LIMIT = '330008';
// 加仓劣于强平价格
export const PRICE_WORSE_THAN_LIQUIDATION_PRICE = '300007';
// 减仓劣于破产价格
export const PRICE_WORSE_THAN_BANKRUPT_PRICE = '300006';
// 超过活动委托数量限制
export const TOO_MANY_ACTIVE_ORDER = '300001';
// 超过条件委托数量限制
export const TOO_MANY_STOP_ORDER = '300004';
// 下只减仓单的时候仓位为0
export const POSITION_EMPTY_REDUCE = '300009';
// 没有合法的撮合价格
export const UNLEGAL_PRICE = '300013';
// 用户不处于邀请白名单
export const UNINVITED = '2701';
// 开通合约用户没有绑定邮箱
export const EMAIL_NOT_BIND = '500007';
// 受限制的国家跟地区
export const AREA_LIMIT_CODE = '400010';
// 触发风险限额
export const RISK_LIMIT_LOW = '300005';
// 乱斗赛季到期
export const BRAWL_SEASON_END = '110026';
// 订单不可取消
export const CANNOT_CANCELED = '100004';
// 强制Kyc
export const KYC_AUTH_CODE = '400303';
// 强制 kyc 子账户
export const KYC_AUTH_CODE_SUB = '400304';
// 体验金下单不足
export const TRIAL_FUND_INSUFFICIENT = '300003';
// 下单保证金模式不匹配
export const MARGIN_MODE_ERROR = '330005';

// 接口时长
export const INTERFACE_DURATION = 'interface_duration';

// 时间总间隔
export const ALL_DURATION = 'duration_order';
