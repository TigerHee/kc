/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';

const service = '/order-book';
const MAINTENANCE_ROLLBACK_URL = 'https://assets.staticimg.com/static/maintenance-status.json';

// 交易市场level1数据： 最新成交价、最新成交数量、买一价、卖一价
export function pullLevel1(symbol) {
  return pull(`${service}/orderbook/level1`, { symbol });
}

// 交易市场level2数据： 买卖盘全量
export function pullLevel2(symbol, limit, params) {
  return pull(`${service}/orderbook/level2`, { ...params, symbol, limit });
}

// 近期成交
export function getDealOrders(symbol) {
  return pull(`${service}/histories`, { symbol });
}

// 时间加权委托
export function timeWeightedOrderTrade(opts) {
  return post('/advanced-order/twap/order', opts);
}

// 查询时间加权委托下单配置
export function getTimeWeightedOrderConfig(opts) {
  return pull('/advanced-order/twap/config', opts);
}

// 发布委托
export function order(opts) {
  return post('/trade/orders', opts);
}

// oco下单
export function ocoOrder(opts) {
  return post('/advanced-order/oco/order', opts);
}

// 杠杆oco下单
export function marginOcoOrder(opts) {
  return post('/margin-polymerize/margin/oco-order', opts);
}

// 跟踪委托下单
export function tsoOrder(params) {
  return post('/advanced-order/tso/order', params);
}

// 杠杆跟踪委托下单
export function marginTsoOrder(params) {
  return post('/margin-polymerize/margin/tso-order', params);
}

export function marginTrade(opts) {
  return post('/margin-polymerize/auto/borrow/order', opts);
}

// 发布委托(杠杆风险限额)
export function newMarginTrade(opts) {
  return post('/margin-polymerize/orders', opts);
}

export function makeStopOrder(opts) {
  return post('/advanced-order/stoporder', opts);
}

export function marginStopOrder(opts) {
  return post('/margin-polymerize/margin/stop-order', opts);
}

/**
 * 获取交易所停机维护状态
 * @param {*} opts
 * @returns {{
 *  isMaintenance: boolean, // 是否停机维护（是maintenance字段）
 *  allowCancelOrder: boolean, // 是否允许撤销订单
 *  appNoticeLocation: string, // app通知位置
 *  cancelEndAt: string, // 限制取消结束时间
 *  cancelStartAt: string, // 限制取消开始时间
 *  endAt: string, // 维护结束时间
 *  link: string, // 跳转连接
 *  maintenance: boolean, // 是否停机维护
 *  maintenanceV2:  boolean, // 是否停机维护, maintenance 是局部停机之前使用的字段
 *  mnoticeLocation: string, //
 *  pcNoticeLocation: string, // pc通知位置
 *  redirectContent: string, // 跳转文本
 *  startAt: string, // 维护开始时间
 *  title: string, // 提示文本
 *  maintenanceScope: null | 0 | 1, // 停服范围参数，null：不停机，0：全部交易对，1：部分交易对
 *  symbolList: string[], // 局部交易对列表（和allowCancelOrder及maintenanceScope配合使用，限制撤单）
 *  cancelStartAt: string,
 *  cancelEndAt": string,
 * }}
 */
export function getMaintenanceStatus(opts = {}) {
  return pull('/trade-front/maintenance-status', opts);
}

export function getMaintenanceStatusFailBack(opts = {}) {
  return pull(MAINTENANCE_ROLLBACK_URL, opts);
}

export function ocoValidation() {
  return post('/advanced-order/oco/validation');
}

export function tsoValidation() {
  return post('/advanced-order/tso/validation');
}
