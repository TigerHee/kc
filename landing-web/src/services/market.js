/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull as originPull, post } from 'utils/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

/**
 * 获取所有币种
 *
 * @returns {Object}
 */
// export async function getCoinsCategory(status) {
//   return pull('/currency/currencies', { status, flat: 1 });
// }
export async function getCoinsCategory(status) {
  return pull('/currency/site/transfer-currencies', { status, flat: 1 });
}

/**
 * 获取用户自选交易对列表
 */
export async function getUserFavSymbols() {
  return pull('/ucenter/user/collect-symbols');
}

/**
 * 设置或取消用户自选交易对列表
 * @param symbol string 交易对
 */
export async function userCollectFavSymbol({ symbol }) {
  return post('/ucenter/user/collect-symbol', { symbol });
}

/**
 * 获取交易所所有启用交易市场
 */
export async function getMarketAreas() {
  return pull('/trade-front/market/getQuotes');
}


/**
 * 获取交易所所有启用交易对
 */
export async function getMarketSymbols({ base, market }) {
  return pull('/currency/site/symbols', { base, market });
}

/**
 * 获取某个交易对信息
 *
 * @param code    string 币种 如：BTC
 * @param symbol  string 交易对 如：KCS-BTC
 */
export async function getSymbol({ code, symbol }) {
  return pull('/currency/site/symbol/get', { code, symbol });
}

/**
 * 通过交易市场获取所有交易对最新行情
 * @param quote string 交易市场
 */
export async function getMarketSymbolsByQuote({ quote }) {
  return pull(`/trade-front/market/getSymbol/${quote}`);
}

/**
 * 获取热门交易对行情信息
 * @param count number 获取行情条数
 */
export async function getHotSymbolTick({ count }) {
  return pull(`/trade-front/market/getHotSymbolTick?count=${count}`);
}

/**
 * 获取涨跌幅行情
 * @param number number 获取行情条数
 * @param sort bool true 涨幅，false 跌幅
 */
export async function getChangeTick({ number, sort }) {
  return pull(`/trade-front/market/getChangeTick?number=${number}&sort=${sort}`);
}

/**
 * 获取多个交易对最新行情
 * @param symbols string 交易对--多个交易对通过逗号分割,如（QSP-BTC,RDN-BTC）
 */
export async function getSymbolTick({ symbols }) {
  return pull(`/trade-front/market/getSymbolTick?symbols=${symbols}`);
}

/**
 * 获取用户指定交易对taker或maker交易对费率
 * @param symbol
 */
export async function getFeeBySymbol(symbol) {
  return pull('/kucoin-web-front/fee/getExchangeLevelAndFee', { symbol });
  // return pull('/trade/fee/getFee', { symbol });
}

/**
 * 获取设置折扣的交易对列表，ALL/ALL代表所有都带折扣
 * @param symbol
 */
export async function getDiscountSymbols() {
  return pull('/trade-front/fee/getDiscountSymbol');
}
