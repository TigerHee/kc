/**
 * Owner: clyne@kupotech.com
 */

import { trackClick, gaExpose } from 'utils/ga';

const isShowLog = window.localStorage.getItem('showBILog');
export const BIClick = (...arg) => {
  if (isShowLog) {
    console.log('=====bi click', JSON.stringify(arg));
  }
  trackClick(...arg);
};

export const BIExpose = (...arg) => {
  if (isShowLog) {
    console.log('=====bi expose', JSON.stringify(arg));
  }
  gaExpose(...arg);
};
/**
 * ============================== 活动委托 ==============================
 */

export const OPEN_ORDER = {
  // 活动委托blockId
  BLOCK_ID: 'OPEN_ORDER_ID',
  // 撤单点击
  CANCEL_CLICK: '1',
  // 撤单发送
  CANCEL_SEND: '22',
  // 撤单成功，单条
  CANCEL_SUCCESS: '2',
  // 列表曝光
  LIST_EXPOSE: '3',
  // 全撤单
  CANCEL_ALL_CLICK: '4',
  // 全撤单成功
  CANCEL_ALL_SUCCESS: '5',
  // 全撤单dialog expose
  CANCEL_ALL_EXPOSE: '6',
  // 全撤单dialog 确认
  CANCEL_ALL_CONFIRM: '7',
  // 撤单失败
  CANCEL_FAIL: '8',
};

export const getOpenOrderType = ({ marginMode = 'ISOLATED', isTrialFunds } = {}) => {
  return `${marginMode}_${isTrialFunds ? 'trialFund' : 'self'}`;
};

export const getStopOrderType = getOpenOrderType;

/**
 * ============================== 条件委托 ==============================
 */
export const STOP_ORDER = {
  // 条件委托blockId
  BLOCK_ID: 'STOP_ORDER_ID',
  // 撤单点击
  CANCEL_CLICK: '1',
  // 撤单发送
  CANCEL_SEND: '22',
  // 撤单成功，单条
  CANCEL_SUCCESS: '2',
  // 列表曝光
  LIST_EXPOSE: '3',
  // 全撤单点击
  CANCEL_ALL_CLICK: '4',
  // 全撤单成功
  CANCEL_ALL_SUCCESS: '5',
  // 全撤单dialog expose
  CANCEL_ALL_EXPOSE: '6',
  // 全撤单dialog 确认
  CANCEL_ALL_CONFIRM: '7',
  // 撤单失败
  CANCEL_FAIL: '8',
};

/**
 * ============================== 平仓盈亏 ==============================
 */
export const PNL_LIST = {
  // 条件委托blockId
  BLOCK_ID: 'PNL_LIST_ID',
  // 列表曝光
  LIST_EXPOSE: '1',
  // PNL detail
  DETAIL_CLICK: '2',
  // PNL detail
  DETAIL_EXPOSE: '3',
  // 关闭详情
  DETAIL_CLOSE: '4',
};

/**
 * ============================== 平仓盈亏 ==============================
 */
export const HISTORY_ORDERS = {
  // 条件委托blockId
  BLOCK_ID: 'HISTORY_ORDERS_ID',
  // 列表曝光
  LIST_EXPOSE: '1',
  // PNL detail
  DETAIL_CLICK: '2',
  // PNL detail
  DETAIL_EXPOSE: '3',
  // 关闭详情
  DETAIL_CLOSE: '4',
};

/**
 * ============================== 仓位 ==============================
 */
export const getClosePosType = ({ marginMode = 'ISOLATED', isTrialFunds } = {}, type = 'limit') => {
  return `${marginMode}_${isTrialFunds ? 'trialFund' : 'self'}_${type}`;
};

export const getSLAndSPPosType = ({ marginMode = 'ISOLATED', isTrialFunds } = {}, stopType) => {
  return stopType
    ? `${marginMode}_${isTrialFunds ? 'trialFund' : 'self'}_${stopType}`
    : `${marginMode}_${isTrialFunds ? 'trialFund' : 'self'}`;
};

export const POSITIONS_PRD = {
  // 点击symbol
  SYMBOL_CLICK: '1',
  // 保证金调整图标点击 type: add | oper, 追加保证金， 修改保证金
  MARGIN_ICON_CLICK: '2',
  // 止盈止损点击
  SL_SP_CLICK: '3',
  // 自动追加保证金
  AUTO_DEPOSIT: '4',
  // 限价平仓
  LIMIT_CLOSE: '5',
  // 市价平仓
  MARKET_CLOSE: '6',
  // 编辑杠杆
  EDIT_LEV: '7',
  // 产品要求埋点
  // 1-7 合约名称、编辑保证金、设置止盈止损、开启自动追加保证金、限价平仓、市价平仓、编辑杠杆
  BLOCK_ID: 'PositionHold',
};

export const POSITIONS = {
  // 条件委托blockId
  BLOCK_ID: 'POSITIONS_ID',
  // 列表曝光
  LIST_EXPOSE: '1',

  // 平仓type参数
  // 逐仓自有资金 [市价：self_market，限价: self_market]
  // 逐仓体验金 [市价: trialFund_market，限价: trialFund_limit]
  // 全仓 [市价:cross_market，限价:cross_limit]

  // 平仓dialog expose type：{type}
  CLOSE_POS_EXPOSE: '2',
  // 平仓dialog点击 type：{type}
  CLOSE_POS_CLICK: '3',
  // 平仓rate点击 type: {percent}
  CLOSE_POS_RATE: '31',
  // 平仓下单失败 type：{type}|{code}
  CLOSE_POS_FAIL: '4',
  // 平仓下单确认 type：{type}
  CLOSE_POS_SUBMIT: '41',
  // 平仓下单确认 type：{type}
  CLOSE_POS_SEND: '51',
  // 平仓下单成功
  CLOSE_POS_SUCCESS: '5',
  // 止盈止损type参数
  // type 止盈百分比：self_profit, trialFund_profit  止损百分比：self_loss, trialFund_loss
  // 仓位止盈止损dialog曝光
  SL_SP_EXPOSE: '6',
  // 仓位止盈止损百分比点击采集, type：{type}_{percent}
  SL_SP_PERCENT: '7',
  // 仓位止盈止损点击下单 type：{type}
  SL_SP_SUBMIT: '88',
  // 仓位止盈止损icon点击 type：{type}
  // 见上面PRD
  // 仓位止盈止损点击下单接口提交
  SL_SP_CREATE: '91',
  // 仓位止盈止损点击下单成功 type：{type}
  SL_SP_CREATE_SUCCESS: '9',
  // 仓位止盈止损点击下单失败 type：{type}|{code}}
  SL_SP_CREATE_FAIL: '10',
};
