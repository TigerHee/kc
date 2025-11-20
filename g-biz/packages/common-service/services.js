/**
 * Owner: Borden@kupotech.com
 */
import { get, post } from '@tools/request';

// 获取币服币种数据
export async function getCurrencies(data) {
  return post('/asset-front/asset-front/incremental/currencies', data);
}

// 获取币服币对数据
export async function getSymbols(data) {
  return get('/currency/site/v4/symbols', data);
}
