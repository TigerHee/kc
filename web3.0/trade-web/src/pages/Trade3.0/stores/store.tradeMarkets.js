/**
 * Owner: borden@kupotech.com
 */
import createStore from './createStore';

const tradeMarketsStore = createStore('tradeMarkets', {
  records: [], // 行情列表
});

export default tradeMarketsStore;
