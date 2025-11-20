/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { Price } from '../ColorText';
import { checkSocketTopic } from '@/utils/socket';
import * as ws from '@kc/socket';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import { useDispatch } from 'dva';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';

const Subscribe = React.memo(({ symbolCode }) => {
  const dispatch = useDispatch();
  // 先通过接口初始化
  // 再订阅
  useWorkerSubscribe(getTopic(ws.Topic.MARKET_SNAPSHOT, symbolCode));

  useEffect(() => {
    dispatch({
      type: 'marketSnapshot/pull',
      payload: {
        symbol: symbolCode,
      },
    });
  }, [symbolCode]);

  return null;
});
/**
 * @description: 批量订阅交易对
 * @param {*} React
 * @return {*}
 */
export const SymbolPriceSubscribe = React.memo(({ symbolCodes = [] }) => {
  const dispatch = useDispatch();
  // 先通过接口初始化
  // 再订阅
  useWorkerSubscribe(getTopic(ws.Topic.MARKET_SNAPSHOT, symbolCodes));

  useEffect(() => {
    if (symbolCodes?.length > 0) {
      dispatch({
        type: 'marketSnapshot/pullDataBySymbols',
        payload: {
          symbols: symbolCodes,
        },
      });
    }
  }, [symbolCodes]);

  return null;
});
/**
 * @description: 配合上面的订阅组件使用; 纯粹的展示组件
 * @param {*} lastTradedPrice
 * @param {*} symbolCode
 * @param {*} className
 * @return {*}
 */
const SymbolPriceText = ({ lastTradedPrice: priceFromProps, symbolCode, className }) => {
  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const realTimeMarketInfo = marketSnapshotStore.useSelector(
    (state) => state.marketSnapshot[symbolCode],
  );
  const lastTradedPrice = realTimeMarketInfo?.lastTradedPrice ?? 0;
  const showPrice = lastTradedPrice || priceFromProps || 0;
  return (
    <Price
      className={className}
      value={showPrice}
      changeRate={realTimeMarketInfo?.changeRate}
      precision={symbolInfo.pricePrecision}
    />
  );
};
/**
 * @description: 配合上面的SymbolPriceSubscribe订阅组件使用; 纯粹的展示组件
 * @param {*} lastTradedPrice
 * @param {*} symbolCode
 * @param {*} className
 * @return {*}
 */
export const SymbolPriceShow = (props) => {
  const { symbolCode } = props;
  return symbolCode === 'USDT-USDT' ? <Price value={1} /> : <SymbolPriceText {...props} />;
};
/**
 * @description: 现货交易对最新价格; 有订阅功能; 适用于 单个的场景;
 * 需要获取不在左上角选择过的交易对的价格
 * NOTE: 这个组件主要在弹窗订单详情中使用, 没有考虑socket断了轮训的情况, 因为影响不大
 * @return {*}
 */
export default React.memo(({ symbolCode, onChange, lastTradedPrice: priceFromProps }) => {
  const symbolInfo = useSpotSymbolInfo(symbolCode);

  const [hasSubscribe, setSubscribe] = useState(true);
  useEffect(() => {
    // 先检查是否已经订阅
    const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
      SYMBOLS: [symbolCode],
    });
    checkSocketTopic({ topic }).then((checkTopic) => {
      if (!checkTopic) {
        setSubscribe(false);
      }
    });
  }, []);

  const realTimeMarketInfo = marketSnapshotStore.useSelector(
    (state) => state.marketSnapshot[symbolCode],
  );
  const lastTradedPrice = realTimeMarketInfo?.lastTradedPrice ?? 0;

  useEffect(() => {
    onChange && onChange(lastTradedPrice);
  }, [lastTradedPrice]);

  const showPrice = lastTradedPrice || priceFromProps || 0;

  return (
    <>
      {!hasSubscribe && <Subscribe symbolCode={symbolCode} />}
      <Price
        value={showPrice}
        changeRate={realTimeMarketInfo?.changeRate}
        precision={symbolInfo.pricePrecision}
      />
    </>
  );
});
