/**
 * Owner: solar.xia@kupotech.com
 */
import { del, post as originPost, pull } from 'tools/request';

const post = (url, data) => {
  return originPost(url, data, false, true);
};
const nameSpace = '/grey-market-trade';
const nameSpace2 = '/trade-front';

/**
 * 根据币种查询订单
 * @param {FilterOption} filterOption
 * @param {number} filterOption.deliveryCurrency - 订单id
 * @param {boolean} [filterOption.ownOrder=false] - 是否只查询自己的订单
 * @param {number} filterOption.maxAmount - 最大限额
 * @param {number} filterOption.minAmount - 最小限额
 * @param {number} filterOption.currentPage
 * @param {number} filterOption.pageSize
 * @param {'buy' | 'sell'} filterOption.side - 交易方向
 * @param {string} filterOption.sortFields - 排序字段
 * @param {'ASC' | 'DESC'} filterOption.sortValue - 排序方式 升序 ｜ 降序
 * @returns
 */
export async function pullGreyMarketOrders(data) {
  return post(`${nameSpace}/grey/market/orderBook`, data);
}
/**
 * 根据币种查询已完成订单
 * @param {FilterOption} filterOption
 * @param {number} filterOption.deliveryCurrency - 订单id
 * @param {boolean} [filterOption.ownOrder=false] - 是否只查询自己的订单
 * @param {number} filterOption.maxAmount - 最大限额
 * @param {number} filterOption.minAmount - 最小限额
 * @param {number} filterOption.currentPage
 * @param {number} filterOption.pageSize
 * @param {'buy' | 'sell'} filterOption.side - 交易方向
 * @param {string} filterOption.sortFields - 排序字段
 * @param {'ASC' | 'DESC'} filterOption.sortValue - 排序方式 升序 ｜ 降序
 * @returns
 */
export async function pullFinishedOrders(data) {
  return post(`${nameSpace}/grey/market/history`, data);
}

/**
 * @typedef {Object} CreateOption
 * @property {!string} channel - 渠道
 * @property {!string} currentPage - 交割币种
 * @property {number} funds - 订单交易金额
 * @property {number} id - 订单ID
 * @property {!string} offerCurrency - 报价币种
 * @property {number} prize - 订单交易价格
 * @property {!string} side - 交易方向 buy | sell
 * @property {number} size - 订单交易数量
 * @property {!string} symbol - 虚拟交易对编号
 * @property {number} tradeSource - 订单来源 USER
 * @property {string} tradeType - 交易类型 TRADE
 * @property {string} type - 类型 limit | market
 * @property {number} userId - 登录用户（测试用）
 */
/**
 * 挂单
 * @param {CreateOption} createOption
 * @returns
 */
export async function createGreyMarketOrder({
  // channel = 'WEB',
  // tradeSource = 'USER',
  // tradeType = 'TRADE',
  // type = 'limit',
  ...rest
}) {
  return post(`${nameSpace}/grey/market/order/create`, {
    // channel,
    // tradeSource,
    // tradeType,
    // type,
    ...rest,
  });
}
// 拆分单
export async function createSplitMarketOrder(params) {
  return post(`${nameSpace}/grey/market/split/order/create`, params);
}

/**
 * @typedef {Object} takeOption
 * @property {!string} counterOrderId - 订单id
 * @property {!string} X-USER-ID
 */
/**
 * 吃单
 * @param {TakeOption} takeOption
 * @returns
 */
export async function takeGreyMarketOrder(data) {
  return post(`${nameSpace}/grey/market/order/take`, data);
}
/**
 * @typedef {Object} CancelOption
 * @property {!string} orderId - 订单id
 * @property {!string} X-USER-ID
 */
/**
 * 撤单
 * @param {CakeOption} cancelOption
 * @returns
 */
export async function cancelGreyMarketOrder(data) {
  const { orderId } = data;
  return del(`${nameSpace}/grey/market/order/cancel/${orderId}`);
}
/**
 * @typedef {Object} MyOrderOption
 * @property {boolean} isActive - 是否是正在进行中的订单
 * @property {number} pageSize
 * @property {number} currentPage
 */
/**
 * 查询用户订单
 * @param {MyOrderOption} myOrderOption
 * @returns
 */
export async function pullMineOfGreyMarketOrder(data) {
  return post(`${nameSpace}/grey/market/order`, data);
}
/**
 * 查询所有币种
 * @returns
 */
export async function pullAllCurrencies() {
  return pull(`${nameSpace}/grey/market/currencies`);
}
/**
 * 根据币种查询具体信息
 * @param {Object} data
 * @param {number} data.id
 * @returns
 */
export async function pullCurrencyInfo(data) {
  return pull(`${nameSpace}/grey/market/currency/info`, data);
}

/**
 * 根据币种查询价格信息
 * @param {Object} data
 * @param {number} data.id
 * @returns
 */
export async function pullPriceInfo(data) {
  return pull(`${nameSpace}/grey/market/statistics`, data);
}

/**
 * 查询图表数据
 * @param {Object} data
 * @param {number} data.id
 * @returns
 */
export async function pullChartInfo(data) {
  return pull(`${nameSpace}/grey/market/char`, data);
}

/**
 * 获取订单拆分配置信息
 * @returns
 * "data": {
    "orderFunds": 0, // 订单金额，用户设置总价值高于该价格时会允许进行拆单下单
    "orderPrice": 0, // 订单价格，用户设置价格高于该价格时会允许进行拆单下单
    "splitOrderEnabled": false // 是否开启拆单功能
  },
 */
export async function pullSplitInfo(data) {
  return pull(`${nameSpace}/grey/market/split/config`, data);
}

/**
 * 查询税费信息
 * @param {String} shortName
 * @param {String} opType 'DEAL' | 'TAKE'
 * @param {String} tradeSide 'BUY' | 'SELL'
 * @returns
 * {
 *    "taxEnable":true,
 *    "taxRate": 0.01,
 * }
 */
export async function pullTaxInfo(params) {
  return pull(`${nameSpace}/grey/market/compliance/tax`, params);
}

/**
 * 查询税费提示
 */
export async function pullTaxTips() {
  return pull(`${nameSpace2}/tax/tips/query`, { type: 'SPOT_TAX_TIPS' });
}

/**
 * @typedef {Object} DeliveryProgress
 * @property {number} deliveryPercent
 * @property {number} deliveryVol
 */

/**
 * 查询交割进度
 * @param {Object} data
 * @param {string} data.currency
 * @returns {Promise<DeliveryProgress>}
 */
export async function pullDeliveryProgress(data) {
  return pull(`${nameSpace}/grey/market/progress`, data);
}

/**
 * @typedef {Object} UserDealTotal
 * @property {number} buyMatchVol
 * @property {number} buySettleVol
 * @property {number} dealTotalVol
 * @property {number} sellMatchVol
 * @property {number} sellSettleVol
 */

/**
 * 查询用户挂单统计
 * @param {Object} data
 * @param {string} data.currency
 * @returns {Promise<UserDealTotal>}
 */
export async function pullUserDealTotal(data) {
  return pull(`${nameSpace}/grey/market/userDealTotal`, data);
}

/**
 * 主动违约申请/申请取消订单
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function applyBreakOrder(data) {
  return post(`${nameSpace}/grey/market/break/apply`, data);
}

/**
 * 违约agree
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function agreeBreakOrder(data) {
  return post(`${nameSpace}/grey/market/break/agree`, data);
}

/**
 * 违约拒绝
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function rejectBreakOrder(data) {
  return post(`${nameSpace}/grey/market/break/reject`, data);
}

/**
 * 查询具体交割币种详细信息
 * @param {boolean} ongoing
 * @param {integer} pageSize
 * @param {integer} currentPage
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
export async function pullActivities(data) {
  return pull(`${nameSpace}/activities`, data);
}

/**
 * 查询价格图表
 * @param {string} currency
 * @param {string} candleType
 * @returns {Promise<Object>}
 */
export async function pullPriceChart(data) {
  return pull(`${nameSpace}/price/chart`, data);
}

/**
 * 查询支持违约功能的时间
 */
export async function pullSupportBreakContractTime() {
  return pull(`${nameSpace}/grey/market/break/offline/time`);
}
