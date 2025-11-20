/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

const tradePrefix = '/trade';
const orderPrefix = '/trade-front/order';

// 查询当前委托
export const queryCurrentOrders = (params) => {
  return pull(`${orderPrefix}/getUserOrders`, params);
};

// 查询止损委托
export const queryStopOrders = (params) => {
  return pull(`${orderPrefix}/getUserStopOrders`, params);
};

// 查询历史委托记录
export const queryHistoryOrders = (params) => {
  return pull('/trade-front/orders', { status: 'done', ...params });
};

// 查询成交明细
export const queryDealOrders = (params) => {
  return pull('/trade-front/fills', params);
};

// 撤销全部订单
export const cancelAllOrders = (data) => {
  return post(`${tradePrefix}/orders/cancel`, data);
};

// 撤销指定订单
export const cancelOrder = (orderId, data) => {
  return post(`${tradePrefix}/orders/cancel/${orderId}`, data);
};

// 查询订单详情
export const pullOrder = (orderId) => {
  return pull(`${tradePrefix}/orders/${orderId}`);
};

// 导出csv
export const exportCsv = (data) => {
  return pull(`${orderPrefix}/download`, data);
};
