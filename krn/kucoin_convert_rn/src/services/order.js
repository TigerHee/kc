/**
 * Owner: willen@kupotech.com
 */
import {post, pull} from 'utils/request';

const nameSpace = '/speedy';
const newAPI = '/flash-convert';

//获取市价单订单
export const queryMarketOrders = params => {
  return post(`${nameSpace}/order/list`, params, false, true);
};

//获取限价单订单，包含历史委托和当前委托
export const queryLimitOrders = params => {
  return post(`${newAPI}/limit/query-orders`, params, false, true);
};

//获取订单详情
export const queryConvertOrderDetail = params => {
  return pull(`${nameSpace}/order/detail/${params.tickerId}`);
};

// 取消限价单
export const cancelLimitOrder = params => {
  return post(`${newAPI}/limit/cancel`, params, false, true);
};
