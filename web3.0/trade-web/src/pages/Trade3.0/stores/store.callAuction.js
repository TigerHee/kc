/**
 * Owner: borden@kupotech.com
 */
import createStore from './createStore';

const callAuctionStore = createStore('callAuction', {
  auctionDataMap: {}, // 数据
});

export default callAuctionStore;
