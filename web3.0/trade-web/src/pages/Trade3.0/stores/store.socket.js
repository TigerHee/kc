/**
 * Owner: borden@kupotech.com
 */
import createStore from './createStore';

const socketStore = createStore('socket', {
  // User orders ws
  currentOrders: [],
  advancedOrders: [],
  // Kline candles data
  updateCandles: [],
  addCandles: [],
  refreshCandles: [], // 4.0 k线数据
  netAssetValue: 0,
});

export default socketStore;
