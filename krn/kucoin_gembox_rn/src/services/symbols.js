/**
 * Owner: roger.chen@kupotech.com
 */
import {pull, post} from 'utils/request';

/**
 * 获取所有币种
 *
 * @returns {Object}
 */
export async function getCoinsCategory() {
  return pull('/currency/transfer-currencies', {flat: 1});
}

//获取所有u本位交易对的涨跌幅
export function getAllCoins() {
  return pull('/reaper/search/currency-content');
}

// 获取用户自选交易对列表
export function getUserFavSymbols() {
  return pull('/ucenter/user/collect-symbols');
}

// 设置或取消用户自选交易对列表
export function userCollectFavSymbol({symbol}) {
  return post('/ucenter/user/collect-symbol', {symbol});
}
