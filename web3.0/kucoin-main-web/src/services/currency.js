/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

/**
 * 获取法币汇率
 *
 * @param base    string 法币币种 如：USD
 * @param targets string
 */
export async function getRates(base = 'USD', targets = '') {
  return pull('/currency/rates', { base, targets });
}

/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：USD
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export async function getPrices(base = 'USD', targets = '') {
  return pull('/currency/v2/prices', { base, targets });
}

/**
 * 获取对应币种在不同链路上对法币的价格
 *
 * @param currency string 数字货币币种
 */
export async function getChainInfo(params) {
  return pull('/currency/site/currency/chain-info', params);
}

/**
 * 聚合提示接口（前置提示、链禁充提提示）
 * 返回币、币链、链的禁充提提示信息、前置提示信息
 * 前端根据逻辑获取并展示提示信息
 * @param {*} params
 */
export async function getDepositTips(params) {
  return pull('/currency/site/currency/aggregation/tip', params);
}

export async function getAddrChainInfo(params) {
  return pull('/payment/withdraw-address/chain-info', params);
}
