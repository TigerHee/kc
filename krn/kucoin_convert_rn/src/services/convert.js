/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import {post, pull} from 'utils/request';
const nameSpace = '/speedy';
const newAPI = '/flash-convert';

// 市价单询价
export async function quotePrice(data) {
  return pull(`${nameSpace}/order/quote`, data);
}

// 限价单询价
export async function limitQuotePrice(data) {
  return pull(`${newAPI}/limit/quote`, data);
}

// 获取所有配对币种信息
export function getAllMatchCoins(params) {
  return pull(`${newAPI}/currency/limit`, params);
}
// 获取闪兑币种信息
export async function queryConvertCurrencyConfig(params) {
  return pull(`${newAPI}/currency/list`, params);
}

// 获取闪兑刷新频率配置（单位：秒）
export async function getRefreshGap() {
  return pull(`${nameSpace}/config/refresh-gap`);
}

// 下单
export async function confirmOrder(data) {
  return post(`${nameSpace}/order/quote`, data, false, true);
}

// 限价下单
export async function limitConfirmOrder(data) {
  return post(`${newAPI}/limit/order`, data, false, true);
}

// 检查是否支持币币闪兑
export const checkSupportFlashTrade = params => {
  return pull(`${nameSpace}/common/valid/enter/${params?.coin}`);
};

// 获取闪兑基本配置信息
export const getConvertBaseConfig = () => {
  return pull(`${nameSpace}/config/base`);
};

// 获取kyc3交易限制提示信息
export const getKyc3TradeLimitInfo = data => {
  return pull('/user-dismiss/dismiss/notice/passive', data);
};

// 限价下单税
export async function limitOrderTax(data) {
  return post(`${newAPI}/limit/compute-tax`, data, false, true);
}
