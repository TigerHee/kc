/**
 * Owner: Borden@kupotech.com
 */
import { post, get } from '@tools/request';

// 获取闪兑交易对列表
export async function getAllSymbols(data) {
  return get('/flash-convert/currency/symbols', data);
}

// 获取币种限额、步长配置
export async function getCurrencyLimit(data) {
  return get('/flash-convert/currency/limit', data);
}

// 获取闪兑基本配置信息
export const getConvertBaseConfig = () => {
  return get('/speedy/config/base');
};

// 获取kyc3交易限制提示信息
export const getKyc3TradeLimitInfo = (data) => {
  return get('/user-dismiss/dismiss/notice/passive', data);
};

// 获取闪兑市价单的询价频率配置（单位：秒）
export async function getRefreshGap() {
  return get('/speedy/config/refresh-gap');
}

// 市价单询价接口
export async function queryPriceForMarketOrder(data) {
  return get('/speedy/order/quote', data);
}

// 市价下单
export async function confirmMarketOrder(data) {
  return post('/speedy/order/quote', data, false, true);
}

// 查余额接口
export async function queryAccountBalances(data) {
  return get('/flash-convert/account/balances', data);
}

// 查币种
export async function queryCurrencyList(data) {
  return get('/flash-convert/currency/list', data);
}

// 限价单询价
export async function queryPriceForLimitOrder(data) {
  return get('/flash-convert/limit/quote', data);
}

// 限价单下单
export async function confirmLimitOrder(data) {
  return post('/flash-convert/limit/order', data, false, true);
}

// 限价单下单
export async function computeLimitTax(data) {
  return post('/flash-convert/limit/compute-tax', data, false, true);
}

// 获取USDD活动币种限额、步长配置
export async function getUsddLimit(data) {
  return get('/speedy/activity/config', data);
}

// USDD活动下单询价接口
export async function queryPriceForUsddOrder(data) {
  return get('/speedy/activity/quote', data);
}

// USDD活动下单
export async function confirmUsddOrder(data) {
  return post('/speedy/activity/order', data);
}

// 获取闪兑开通协议
export async function checkUserAgreement(data) {
  return get('/flash-convert/user-agreement/check', data);
}

// 同意闪兑开通协议
export async function confirmUserAgreement(data) {
  return post('/flash-convert/user-agreement/sign', data);
}
