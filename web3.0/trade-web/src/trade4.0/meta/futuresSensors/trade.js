/**
 * Owner: garuda@kupotech.com
 */

import { MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '@/meta/futures';

// 开通合约_确认弹框 -> 开通合约 奖励类型（activityType）：体验金（fund)、抵扣券(activity)、无（null)
export const contractOpenConfirm = 'ContractOpenConfirm';
// 开通合约_下单弹框 -> 看涨、看跌、前往设置
export const contractOpenTrade = 'ContractOpenTrade';
// 开通合约_划转弹框
export const contractOpenTransfer = 'ContractOpenTransfer';
// 下单价格 -> 输入价格、最新、加号，减号、市价单icon
export const tradePrice = 'TradePrice';
// 下单数量 -> 输入数量、加减号、25%、50%、75%、100%
export const tradeQty = 'TradeQty';
// 下单单位 -> 张、币
export const tradeUnit = 'TradeUnit';
// 下单杠杆 -> 1,2 | 拖动杠杆（每拖动一次上报一次）、修改icon | 保证金模式marginType：isolated、cross
export const tradeLev = 'TradeLev';
// 下单止盈止损 -> 做多止盈止损、做空止盈止损
export const tradeStopLoss = 'TradeStopLoss';
// 设置下单止盈止损 -> 输入价格、输入百分比、25%、50%、75%、100% (对应第一档到第四档)
export const tradeStopLossSet = 'TradeStopLossSet';
// 下单止盈止损价格类型 -> 最新价格、标记价格
export const tradeStopLossPriceType = 'TradeStopLossPriceType';
// 下单高级委托 -> 展开高级委托、只减仓、隐藏委托、被动委托、IOC
export const tradeSenior = 'TradeSenior';
// 下单按钮 -> 1,2 | 买入、卖出
export const tradeLongShort = 'TradeLongShort';
// 下单二次确认 -> 确认按钮
export const tradeConfirm = 'TradeConfirm';
// 下单结果
export const tradeResult = 'TradeResult';
// 仓位模块 -> 持有仓位、平仓盈亏、活动委托、条件委托、订单止盈止损、成交记录、委托历史
export const position = 'Position';
// 持有仓位 -> 合约名称、增加保证金、设置止盈止损、开启自动追加保证金、限价平仓、市价平仓
export const positionHold = 'PositionHold';
// 追加保证金 -> 输入金额、确认追加
export const addMargin = 'AddMargin';
// 仓位止盈止损 -> 输入价格、止盈25%、止盈50%、止盈75%、止盈100%、止盈150%、止盈200%、止损5%、止损15%、止损25%、止损50%、止损75%、确认
export const positionStopLoss = 'PositionStopLoss';
// 自动追加保证金 -> 确认
export const autoAddMargin = 'AutoAddMargin';
// 限价平仓 -> 输入价格、输入数量、25%、50%、75%、100%、取消、确认
export const positionLimitClose = 'PositionLimitClose';
// 市价平仓 -> 输入数量、25%、50%、75%、100%、取消、确认
export const positionMarketClose = 'PositionMarketClose';

// 简约版入口
export const LITEENTER = 'LiteEnter';
// 计算器入口
export const CALCULATOR = 'Calculator';
// 仅查看当前合约
export const ONLYCURRENTCONTRACT = 'OnlyCurrentContract';
// 点击撤单
export const ORDERCANCEL = 'OrderCancel';
// 点击批量撤单
export const BATCHORDERCANCEL = 'BatchOrderCancel';

// 交易界面 => 偏好设置
export const PREFEREN_SETTING = 'PreferenceSetting';

// 下单结果
export const TRADE_RESULTS = 'trade_results';

// 下单时长
export const TRADE_RESULT_TIMER = 'trade_order_analyse';

// 撤单时长
export const CANCEL_ORDER_TIMER = 'cancel_order_analyse';

// k线时间粒度
export const KLINE_INTERVAL = 'KLineInterval';

// 切换高级订单类型
export const ADVANCED_TYPE = 'OrderType';

// 风险限额引导展示 -> 曝光，close 1，ok 2
export const RISK_LIMIT_GUIDE = 'RiskLimitGuide';
// 风险限额自动调整 -> 曝光，close 1，ok 2
export const RISK_LIMIT_AUTO = 'RiskLimitAuto';
// 风险限额下单确认 -> 曝光，close 1，ok 2
export const RISK_LIMIT_ORDER = 'RiskLimitOrder';

// 保证金模式说明 -> 1,2 | 确定，关闭
export const MARGIN_MODE_TIPS = 'MarginModuleTips';

// 保证金模式切换 -> 1-3 | 问号、逐仓、全仓 | 结果类型resultType：成功success、失败fail
export const MARGIN_MODE_MODULE = 'MarginModule';

// 风险限额-弹框 -> 1-5 | 取消、确认修改逐仓、点击逐仓tab、点击全仓tab、点击全仓-更多
// 更改逐仓风险限额需要传递参数 -> symbol | number(档位) ｜ 风险限额结果resultType：成功success、失败fail
export const RISK_LIMIT = 'RiskLimit';
// 入金 充币、划转 1-2
export const TRANSFER_IN = 'TransferIn';

// 下单终止 -> deep | priceGap | confirm | riskLimit | password
export const TRADE_ORDER_STOP = 'FuturesOrderStop';

// 计算器开始计算 -> 计算类型calculateType：收益Profit、强平价格LiqPrice、平仓价格ClosePrice | 保证金模式marginType：isolated、cross
export const START_CALC = 'StartCalculating'; // 开始计算

// 计算器以此参数下单
export const TO_CALC_ORDER = 'QrderWithParameter';

export const SENSORS_MARGIN_TYPE = {
  [MARGIN_MODE_CROSS]: 'cross',
  [MARGIN_MODE_ISOLATED]: 'isolated',
};

// 下单二次确认弹框 -> 弹框类型type：深入买卖盘、价差提示、二次确认、风险限额
export const TRADE_CONFIRM = 'FuturesTradeConfirm';

// 下单切换交易单位 -> 单位qytUnit
export const SWITCH_QTY = 'FuturesSwitchQty';

// 下单切换订单类型 -> 交易类型type: 限价、市价、条件限价、条件市价、高级委托、隐藏单
export const TRADE_ORDER_TYPE = 'FuturesOrderType';

// 体验金开关 -- locationId 1/2 (打开/关闭)
export const BONUS_MODE_SWITCH = 'bonusModeSwitch';

// 划转 -> 1-4 弹框展示，点击划转，点击关闭，单独点击划转按钮
export const TRANSFER = 'Transfer';

// 点击开通合约
export const OPEN_FUTURES = 'OpenFutures';

// 设置交易密码
export const FUTURES_PWD = 'FuturesPassword';

// 命中灰度
export const FUTURES_CROSS_GRAY_AB = 'FuturesCrossGrayAB';

// 展示失败提示
export const FUTURES_ERROR_RELOAD = 'FuturesErrorReload';

// ===== 一键分享 ===== //
// 点击分享 -- 仓位 1 ｜ 平仓盈亏 2 -- data trade_pair（symbol）、trade_type（side）
export const FUTURES_SHARE_PNL = 'FuturesSharePnl';

// 点击分享图里的按钮-- data clickType(代表分享的操作)
export const FUTURES_SHARE_PNL_BTN = 'FuturesSharePnlBtn';

// 弹框 1-3 pc/h5/app -- data profitPriceType、shareWinsLosses
export const FUTURES_SHARE_PNL_MODAL = 'FuturesSharePnlModal';

// 自定义修改点击 1-2 pc/h5 -- data selectType
export const FUTURES_SHARE_PNL_CUSTOMER = 'FuturesSharePnlCustomer';

// 生成报错 1-2 生成图片/请求接口 -- data fail_reason
export const FUTURES_SHARE_PNL_ERROR = 'FuturesSharePnlError';
// ===== 一键分享end ===== //

// 保证金模式批量编辑 MaginModeMulti-1
export const FUTURES_MARGIN_MODE_MULTI_EXPOSE = 'MaginModeMulti';

// 保证金模式批量选择 MaginModeMulti-2 selectType - 单选 选择 - select 取消 - cancel、select 1 -2 选择 ｜ 取消
export const FUTURES_MARGIN_MODE_SELECT = 'MaginModeMulti';

// 保证金模式批量选择 MaginModeMulti-3 select_all - 全选 选择 - 1 取消 - 2、selectall 1 -2 选择 ｜ 取消
export const FUTURES_MARGIN_MODE_SELECT_ALL = 'MaginModeMulti';

// 保证金模式批量选择 MaginModeMulti-4
export const FUTURES_MARGIN_MODE_SEARCH = 'MaginModeMulti';

// 保证金模式批量选择 MaginModeMulti-5 changemode 切换逐仓 - 1 切换全仓 - 2、 marginType
export const FUTURES_MARGIN_MODE_CHANGE = 'MaginModeMulti';

// 全仓埋点曝光 -- marginMode、symbol
export const FUTURES_MARGIN_MODE_EXPOSE = 'FuturesMarginMode';

// 点击运营阵地
export const FUTURES_PERKS = 'Futures_Perks';

// 下单弹框介绍 1 点击，2 切换tab, actionType
export const FUTURES_ORDER_EXPLAIN = 'FuturesOrderExplain';
