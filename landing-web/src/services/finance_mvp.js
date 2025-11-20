/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/novice-zone';

/**
 *  赎回
 */
 export async function redeemOrder(params) {
  return pull(`${prefix}/novice/redeem-order`, params);
}

/**
 *  下单
 */
export async function createOrder(params) {
  return post(`${prefix}/novice/create-order`, params, false, true);
}

/**
 *  获取历史订单
 */
 export async function getHistoryOrders(params) {
  return post(`${prefix}/novice/history-orders`, params, false, true);
}

/**
 * 重试
 */
 export async function retryOrder(params) {
  return post(`${prefix}/novice/retry-order`, params);
}

/**
 * 当前七日收益
 */
 export async function getSevenIncome(params) {
  return post(`${prefix}/novice/current-seven-income`, params, false, true);
}

/**
 * 获取当前订单
 */
 export async function getOrderList(params) {
  return post(`${prefix}/novice/currentOrders`, params, false, true);
}

/**
 * 单个订单
 */
 export async function getOrder(params) {
  return pull(`${prefix}/novice/getOrder`, params);
}

/**
 * 已读历史订单
 */
 export async function readHistoryOrder(orderId) {
  return post(`${prefix}/novice/history-order-read/${orderId}`);
}
