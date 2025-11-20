/*
 * owner: mike@kupotech.com
 */
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import { useSelector } from 'dva';
/**
 * @description: 获取现货交易对最近价格
 * 注意: 这个是左上角对应交易对的价格, 其余交易对的价格, 还没有订阅
 * @param {*} symbolCode
 * @return {*}
 */
export const useSpotPrice = (symbolCode) => {
  const realTimeMarketInfo = marketSnapshotStore.useSelector(
    (state) => state.marketSnapshot[symbolCode],
  );
  return realTimeMarketInfo?.lastTradedPrice ?? 0;
};
export default useSpotPrice;
/**
 * @description: 合约左上角对应交易对的价格
 * TODO: 其他交易对的价格, 还需处理
 * @param {*} symbolCode
 * @return {*}
 */
export const useFuturePrice = (symbolCode) => {
  return useSelector((state) => state.futuresMarket.currentDetail?.lastTradePrice) ?? 0;
};

