/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-12 17:25:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-08-30 21:38:45
 * @FilePath: /trade-web/src/services/currency.js
 * @Description:
 */
/**
 * Owner: borden@kupotech.com
 */
import { pull } from 'utils/request';

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
