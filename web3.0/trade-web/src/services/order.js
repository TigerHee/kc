/**
 * Owner: borden@kupotech.com
 */
import { pull, post, del, delPost, put } from 'utils/request';

const tradePrefix = '/trade';
const orderPrefix = '/trade-front/order';
const advancedOrderPrefix = '/advanced-order';

const orderPrefixNew = '/trade-front';

const newStopPrefix = `${advancedOrderPrefix}/stoporder`;

/**
 * @description:  查询当前委托和高级委托的数量
 * @param {*} params.tradeType  有 {"TRADE", "MARGIN_TRADE", "MARGIN_ISOLATED_TRADE"}
 * @return {*}  "data": {
    "activeOrderCount": 0,
    "advancedOrderCount": 0
  },
 */
export const queryOrdersSummary = (params) => {
  return pull(`${orderPrefix}/summary`, {
    ...params,
  });
};

// 查询当前委托
export const queryCurrentOrders = (params) => {
  return pull(`${orderPrefix}/getUserOrders`, {
    ...params,
    checkAllowCancelAll: true,
  });
};

// 查询止损委托
export const queryStopOrders = (params) => {
  return pull(`${orderPrefix}/getUserStopOrders`, params);
};

// 查询历史委托记录
export const queryHistoryOrders = (params) => {
  return pull(`${orderPrefixNew}/orders`, { status: 'done', ...params });
};

// 查询成交明细
export const queryDealOrders = (params) => {
  return pull(`${orderPrefixNew}/fills`, params);
};

// 撤销全部订单
export const cancelAllOrders = (data) => {
  return post(`${tradePrefix}/orders/cancel`, data);
};

// 撤销指定订单
export const cancelOrder = (orderId, data) => {
  return post(`${tradePrefix}/orders/cancel/${orderId}`, data);
};

// 撤销指定oco订单
export const cancelOCOOrder = (orderId) => {
  return del(`/advanced-order/oco/order/${orderId}`, { orderId });
};

// 查询订单详情
export const pullOrder = (orderId) => {
  return pull(`${tradePrefix}/orders/${orderId}`);
};

// 查询订单详情
export const pullMarginOrder = (orderId) => {
  return pull(`${tradePrefix}/orders/${orderId}?tradeType=MARGIN_TRADE`);
};

// 取消指定的止盈止损单
export const newCancelStopOrdersById = (orderIds) => {
  return del(`${newStopPrefix}/cancel`, { orderIds });
};

export const newCancelAllStopOrder = (params) => {
  return del(`${newStopPrefix}/cancel`, params);
};

export const newQueryStopOrders = (params) => {
  return pull(`${newStopPrefix}/getUserStopOrders`, params);
};

export const newQueryStopOrderById = (orderId) => {
  return pull(`${newStopPrefix}/${orderId}`);
};

/**
 * 撤销跟踪委托订单
 * @param {string} orderId
 */
export const cancelTSO = (orderId) => {
  return del(`/advanced-order/tso/order/${orderId}`);
};

/**
 * 查询币币TWAP订单
 * @param {string} orderId
 */
export const queryTWAPOrders = (params) => {
  return pull(`${advancedOrderPrefix}/twap/order`, params);
};

/**
 * 撤销全部未完成 TWAP订单
 * @param {string} orderId
 */
export const cancelTWAPOrders = (params) => {
  return delPost(`${advancedOrderPrefix}/twap/order`, params);
};

/**
 * 撤销单笔TWAP订单
 * @param {string} orderId
 */
export const cancelSingleTWAPOrder = (orderId) => {
  return delPost(`${advancedOrderPrefix}/twap/order`, {
    orderIds: [orderId],
  });
};

/**
 * 暂停TWAP订单
 * @param {string} orderId
 */
export const pauseTWAPOrder = (orderId) => {
  return put(`${advancedOrderPrefix}/twap/order/pause/${orderId}`);
};

/**
 * 运行TWAP订单
 * @param {string} orderId
 */
export const runTWAPOrder = (orderId) => {
  return put(`${advancedOrderPrefix}/twap/order/running/${orderId}`);
};

/**
 * 查询TWAP子订单
 * @param {string} orderId
 */
export const queryTWAPSubOrder = (twapOrderId) => {
  return pull(`${advancedOrderPrefix}/twap/subOrder/${twapOrderId}`);
};
