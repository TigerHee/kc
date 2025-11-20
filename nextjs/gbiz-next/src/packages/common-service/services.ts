/**
 * Owner: Borden@kupotech.com
 */
import { pull as get, post } from 'tools/request';

// 获取币服币种数据
export async function getCurrencies(data: any): Promise<any> {
  return post('/asset-front/asset-front/incremental/currencies', data, false, true);
}

// 获取币服币对数据
export async function getSymbols(data: any): Promise<any> {
  return get('/currency/site/v4/symbols', data);
}
