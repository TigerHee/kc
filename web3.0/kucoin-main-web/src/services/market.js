/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull, post } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

import siteConfig from 'utils/siteConfig';

const { KUMEX_GATE_WAY } = siteConfig;

const pull = pullWrapper(originPull);

const MAINTENANCE_ROLLBACK_URL = 'https://assets2.staticimg.com/static/maintenance-status.json';

/**
 * 获取所有币种
 *
 * @returns {Object} currencyType:1法币  2所有 0数字货币
 */
export async function getCoinsCategory(status) {
  return pull('/currency/site/transfer-currencies', { status, flat: 1, currencyType: 2 });
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
 * 获取交易对----取代getMarketAreas
 */
export async function getMarketAreasNew() {
  return pull('/currency/markets');
}

/**
 * 获取全仓杠杆配置
 */
export async function getMarginConfigs() {
  return pull('/margin-config/configs');
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
  return pull('/currency/symbol/get', { code, symbol });
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

// 获取指数币种实时价格
export async function getIndexTickers(params) {
  return pull('/kucoin-web-front/index/tickers', params);
}

// 获取指数样本
export async function getIndexSamples(params) {
  return pull('/kucoin-web-front/index/samples', params);
}

// 获取指定币种指数k线
export async function getIndexCandles(params) {
  return pull('/kucoin-web-front/index/candles', params);
}

// kucoin future 获取用户自选列表
export async function getCollectionContracts() {
  return pull(`${KUMEX_GATE_WAY}/ucenter/collection-contracts`);
}
// kucoin future 获取用户设置自选
export async function collectContract(symbol) {
  return post(`${KUMEX_GATE_WAY}/ucenter/contract/collect`, { symbol });
}
// kucoin future 获取合约列表
export async function pullSymbols() {
  return pull(`${KUMEX_GATE_WAY}/kumex-contract/contracts/active`, { preview: false });
}
// kucoin future 获取合约推荐位配置信息
// export async function getRecommendedList() {
//   return pull(`${KUMEX_GATE_WAY}/service-assemble/contract/recommended-list`);
// }
// 获取所有合约的涨跌幅和最新成交价接口
export async function getMarketList() {
  return pull(`${KUMEX_GATE_WAY}/kumex-trade/market/list`);
}

export async function getUserInfo() {
  return pull(`${KUMEX_GATE_WAY}/ucenter/kumex-user-info`);
}

// 获取合约交易区列表
export function pullTradeAreaList(params) {
  return pull(`${KUMEX_GATE_WAY}/kumex-contract/contracts/tradeArea/getAvailable`, params);
}

// 获取系统维护状态
export function getMaintenanceStatus(opts = {}) {
  return pull('/trade-front/maintenance-status', opts);
}

export function getMaintenanceStatusFailBack(opts = {}) {
  return pull(MAINTENANCE_ROLLBACK_URL, opts);
}
