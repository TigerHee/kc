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
export async function getRates(base = window._DEFAULT_RATE_CURRENCY_, targets = '') {
  return pull('/currency/rates', { base, targets });
}

/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：USD
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export async function getPrices(base = window._DEFAULT_RATE_CURRENCY_, targets = '') {
  return pull('/currency/v2/prices', { base, targets });
}

export async function getAddrChainInfo(params) {
  return pull('/payment/withdraw-address/chain-info', params);
}
