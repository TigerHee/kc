/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-12 17:25:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-10-06 23:23:19
 * @FilePath: /trade-web/src/pages/Trade3.0/components/TradeBox/const.js
 * @Description:
 */
/**
 * Owner: borden@kupotech.com
 */
import { pick } from 'lodash';

// 交易类型国际化key
export const TRADES_LANG = {
  customPrise: 'trd.type.limit.o',
  triggerPrise: 'trd.type.stop.limit.s',
  marketPrise: 'trd.type.market.o',
  marketTriggerPrice: 'trd.type.stop.market.s',
  ocoPrise: 'trd.type.oco.limit.s',
  tsoPrise: 'trd.form.tso.title',
};

// 下单类型对应的神策埋点上报字段
export const TRADES_FOR_KCSENSORS = {
  customPrise: 'limit',
  triggerPrise: 'limitStop',
  marketPrise: 'market',
  marketTriggerPrice: 'limitMarket',
  ocoPrise: 'limitOCO',
  tsoPrise: 'trailingStop',
};

// 交易类型
export const TRADE_TYPES = [
  { labelKey: 'tradeType.trade', value: 'TRADE' },
  { labelKey: 'tradeType.margin', value: 'MARGIN_TRADE' },
];

// 市价交易类型
export const MARKET_TRADES = {
  marketPrise: 1,
  marketTriggerPrice: 1,
};

// 时间策略
export const TIME_STRATEGY_OPTIONS = [{
  key: 'GTC',
  label: 'Good Till Cancelled',
  value: 'GTC',
}, {
  key: 'GTT',
  label: 'Good Till Time',
  value: 'GTT',
}, {
  key: 'IOC',
  label: 'Immediate or Cancel',
  value: 'IOC',
}, {
  key: 'FOK',
  label: 'Fill or Kill',
  value: 'FOK',
}];

export const BusinessTab = {
  Buy: 'buy',
  Sell: 'sell',
};
