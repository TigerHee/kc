/**
 * Owner: borden@kupotech.com
 */
import createStore from './createStore';

const openOrdersStore = createStore('openOrders', {
  groupMap: {},
  fullData: {},
  calcTargetPrice: '', // 买入卖出需要用到买卖盘显示的标记价格
});

export default openOrdersStore;
