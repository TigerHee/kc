/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';

/**
 * 获取法币汇率
 *
 * @param base    string 法币币种 如：主站（USD）、土耳其站（TRY）、泰国站（THB）、澳洲站（AUD）、欧洲站（EUR）
 * @param targets string
 */
export async function getRates(base = window._DEFAULT_RATE_CURRENCY_, targets = '') {
  return pull('/currency/rates', { base, targets });
}

/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：主站（USD）、土耳其站（TRY）、泰国站（THB）、澳洲站（AUD）、欧洲站（EUR）
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export async function getPrices(base = window._DEFAULT_RATE_CURRENCY_, targets = '') {
  return pull('/currency/prices', { base, targets });
}
