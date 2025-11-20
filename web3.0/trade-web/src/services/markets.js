/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-08-12 14:30:04
 * @Description: ''
 */
import { pull, post } from 'utils/request';

const prefix = '/currency-front';
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
export async function getQuotes() {
  return pull('/currency/markets');
}

/**
 * 获取多个交易对最新行情
 * @param symbols string 交易对--多个交易对通过逗号分割,如（QSP-BTC,RDN-BTC）
 */
export async function getSymbolTick({ symbols }) {
  return pull(`/trade-front/market/getSymbolTick?symbols=${symbols}`);
}

/**
 * 通过交易市场获取所有交易对最新行情
 * @param quote string 交易市场
 */
export async function getMarketSymbolsByQuote({ quote }) {
  return pull(`/trade-front/market/getSymbol/noSerialize/${quote}`);
}

/**
 * 获取所有币种
 * currencyType:1法币  2所有 0数字货币
 *
 * @returns {Object}
 */
export async function getCoinsCategory(status) {
  return pull('/currency/site/transfer-currencies', { status, flat: 1, currencyType: 2 });
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
 * 获取用户指定交易对taker或maker交易对费率
 * @param symbol
 */
export async function getFeeBySymbol(symbol) {
  return pull('/trade/fee/getFee', { symbol });
}

/**
 * 判断用户是否需要交税
 *  "needPayTax": true,
    "taxRate": 0,
    "taxRegion": "india"
 * @param symbol
 */
export async function isNeedToPayTax() {
  return pull('/trade/tax/isNeedToPayTax');
}

/**
 * 判断用户是否需要交税
 *  {
    "success": true,
    "code": "200",
    "msg": "success",
    "retry": false,
    "data": "根據奈及利亞法律《金融法》（2020 年）第 42 條和第 43 條，每筆交易的服務費需額外徵收 7.5% 作為增值稅 (VAT)。"
}
 * @param symbol
 */
export async function queryTaxTips(payload) {
  return pull('/trade-front/tax/tips/query', payload);
}

/**
 * 获取设置折扣的交易对列表，ALL/ALL代表所有都带折扣
 * @param symbol
 */
export async function getDiscountSymbols() {
  return pull('/trade-front/fee/getDiscountSymbol');
}

/**
 * 获取支持杠杆的交易对
 * @param symbol
 */
export async function getMarginSymbols(params) {
  return pull('/margin-config/margin-symbols', params);
}

/**
 * 获取用户指定交易对taker或maker交易对费率
 * @param symbol
 */
export async function getExchangeLevelAndFee(symbol) {
  return pull('/kucoin-web-front/fee/getExchangeLevelAndFee', { symbol });
}

/**
 *  新币榜，涨幅榜新接口，来源于机会发现
 *  🔥热币榜
 */
export async function getPopularSymbols(params) {
  return pull('/discover-front/spl', params);
}

/**
 *  k线 bs点位
 */
export async function getBSHistoryBySymbol(params) {
  return pull('/kline-data-check/bs/data', params);
}

/**
 * 新币专区 最近活动
 */
export async function getRecentActive(type) {
  return pull(`${prefix}/recently/activities?type=${type}`);
}
