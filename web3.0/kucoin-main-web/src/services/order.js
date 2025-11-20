/**
 * Owner: willen@kupotech.com
 */
import { pull, del, post, put, deleteJson } from 'tools/request';
import urlParser from 'urlparser';

const tradePrefix = '/trade';
const tradeFrontPrefix = '/trade-front';
const orderPrefix = '/trade-front/order';
const advancedOrderPrefix = '/advanced-order';
const newStopPrefix = '/advanced-order/stoporder';

const isEmptyStr = (str) => {
  return typeof str === 'string' && str === '';
};

// 过滤空值
const filterEmpty = (params) => {
  Object.keys(params).forEach((k) => {
    params[k] = isEmptyStr(params[k]) ? undefined : params[k];
  });
};

// 查询当前委托
export const queryCurrentOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull(`${orderPrefix}/getUserOrders`, params);
};

// 查询止损委托
export const queryStopOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull(`${orderPrefix}/getUserStopOrders`, params);
};

// 查询历史委托记录
export const queryHistoryOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull('/trade-front/orders', { status: 'done', ...params });
};

// 查询成交明细
export const queryDealOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);

  return pull('/trade-front/fills', params);
};

// 查询借款历史记录 /outer/loan/order/query-borrow-order
export const queryBorrowingOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull('/margin-loan/outer/loan/order/query-borrow-order', { ...params });
};

// 查询还款历史记录 /margin-loan/outer/loan/order/query-repay-order
export const queryRepaymentOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull('/margin-loan/outer/loan/order/query-repay-order', { ...params });
};

// 查询利息历史记录 /margin-loan/outer/loan/order/query-interest-record
export const queryInterestOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull('/margin-loan/outer/loan/order/query-interest-record', { ...params });
};

// 查询强平历史记录
export const queryLiquidationOrders = (params) => {
  // 处理一下，空字符串的不传
  filterEmpty(params);
  return pull('/margin-liquidation/liquidation/get-list', { ...params });
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
export const cancelOCOOrder = (orderId, data) => {
  return del(`/advanced-order/oco/order/${orderId}`, data);
};

/**
 * 撤销跟踪委托订单 tso
 * @param {string} orderId
 */
export const cancelTSO = (orderId) => {
  return del(`/advanced-order/tso/order/${orderId}`);
};

// 查询订单详情
export const pullOrder = (orderId) => {
  return pull(`${tradePrefix}/orders/${orderId}`);
};

// 导出csv
export const exportCsv = (params) => {
  // 处理一下，空字符串的不传
  Object.keys(params).forEach((k) => {
    params[k] = isEmptyStr(params[k]) ? undefined : params[k];
  });
  return pull(`${orderPrefix}/download`, params);
};

// 取消指定的止盈止损单
export const newCancelStopOrdersById = (orderIds) => {
  return del(`${newStopPrefix}/cancel`, { orderIds });
};

export const newCancelAllStopOrder = (params) => {
  return del(`${newStopPrefix}/cancel`, params);
};

export const newQueryStopOrders = (params) => {
  // 处理一下，空字符串的不传
  Object.keys(params).forEach((k) => {
    params[k] = isEmptyStr(params[k]) ? undefined : params[k];
  });
  return pull(`${newStopPrefix}/getUserStopOrders`, params);
};

const url = urlParser.parse(location.href);
const params = url?.query?.params || {};

const convertPrefix = !params?.switcher ? '/speedy' : '/flash-trade';
const newAPI = '/flash-convert';

//查询闪兑订单
export const queryConvertOrders = (params) => {
  return post(`${convertPrefix}/order/list`, params, false, true);
};

//获取限价单订单，包含历史委托和当前委托
export const queryLimitConvertOrders = (params) => {
  return post(`${newAPI}/limit/query-orders`, params, false, true);
};
//查询闪兑订单
export const queryCurrentConvertOrders = (params) => {
  return post(`${convertPrefix}/order/list`, params, false, true);
};
//导出闪兑订单
export const exportConvertOrders = (params) => {
  return post(`${convertPrefix}/order/export`, params, false, true);
};
//获取闪兑币种列表
export const getCoinList = (params) => {
  return pull(`${newAPI}/currency/list`, params);
};
// oco地区开关
export function ocoValidation() {
  return post('/advanced-order/oco/validation');
}
// tso 跟踪委托
export function tsoValidation() {
  return post('/advanced-order/tso/validation');
}
/**
 * 提币模块增加闪兑入口 用户点击加号，调用闪兑业务接口，判断是否属于闪兑to币种
 */
export async function checkIfBelongFlash({ currency }) {
  return pull(`${convertPrefix}/common/valid/enter/${currency}`, {});
}

// 取消限价单
export const cancelLimitOrder = (params) => {
  return post(`${newAPI}/limit/cancel`, params, false, true);
};

//导出限价订单
export const exportLimitOrders = (params) => {
  return post(`${newAPI}/limit/export-orders`, params, false, true);
};

export const queryTWAPOrders = (params) => {
  // 处理一下，空字符串的不传
  Object.keys(params).forEach((k) => {
    params[k] = isEmptyStr(params[k]) ? undefined : params[k];
  });
  return pull(`${advancedOrderPrefix}/twap/order`, params);
};

/**
 * 撤销全部未完成 TWAP订单
 * @param {string} orderId
 */
export const cancelTWAPOrders = (params) => {
  return deleteJson(`${advancedOrderPrefix}/twap/order`, params);
};

/**
 * 撤销单笔TWAP订单
 * @param {string} orderId
 */
export const cancelSingleTWAPOrder = (orderId) => {
  return deleteJson(`${advancedOrderPrefix}/twap/order`, {
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

/**
 * 查询通用 合规文案
 */
export const queryTaxTips = (params) => {
  return pull(`${tradeFrontPrefix}/tax/tips/query`, params);
};
