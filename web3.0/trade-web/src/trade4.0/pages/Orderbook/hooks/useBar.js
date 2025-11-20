/*
 * owner: Clyne@kupotech.com
 */
import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useIndexPrice, useLastPrice, useMarkPrice } from '@/hooks/futures/useMarket';
import { FUTURES, ISOLATED, MARGIN } from '@/meta/const';
import { namespace } from '@/pages/Orderbook/config';
import { namespace as recentTradeNamespace } from '@/pages/RecentTrade/config';
import { getSymbolAuctionInfo } from '@/utils/business';
import { formatNumber } from '@/utils/format';
import { useSelector } from 'dva';
import { get } from 'lodash';
import { useEffect, useMemo } from 'react';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import { dividedBy } from 'utils/operation';

const _loop = { price: 0 };

// 获取现货杠杆最新价格
export const useGetSpotLP = () => {
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useGetCurrentSymbolInfo();
  const data = useSelector((state) =>
    get(state[recentTradeNamespace], `data.${currentSymbol}.[0]`, _loop),
  );
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  // 这里是预览模式，不显示
  return getSymbolAuctionInfo(symbolInfo, auctionWhiteAllowList, auctionWhiteAllowStatusMap)
    .previewEnableShow
    ? 0
    : data.price || 0;
};

// 获取杠杆markprice 这个这里要让前端算是没想到的 >_<
// 标记价格的socket更新，订阅，都在外层公共逻辑中
export const useGetMarginMP = (dispatch) => {
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useGetCurrentSymbolInfo();
  const targetPriceMap = useSelector((state) => state.isolated.targetPriceMap);
  const [base, quote] = currentSymbol.split('-');
  const baseTargetPrice = targetPriceMap[`${base}-BTC`];
  const quoteTargetPrice = targetPriceMap[`${quote}-BTC`];
  const { pricePrecision = 8 } = symbolInfo || {};

  return useMemo(() => {
    // 不显示
    if (tradeType !== MARGIN && tradeType !== ISOLATED) {
      return '';
    }
    if (baseTargetPrice && quoteTargetPrice) {
      const ret = dividedBy(baseTargetPrice)(quoteTargetPrice).toString();
      const val = formatNumber(ret, {
        pointed: true,
        fixed: pricePrecision,
        dropZ: true,
      });
      return val || '-';
    }
    return '-';
  }, [baseTargetPrice, quoteTargetPrice, pricePrecision, tradeType]);
};

export const useGetNetAssets = (dispatch) => {
  const currencyCode = useEtfCoin();
  const netAssets = useSelector((state) => state[namespace].netAssets);
  useEffect(() => {
    if (currencyCode) {
      // 初始化拉接口
      dispatch({
        type: `${namespace}/getNetAssets@polling:cancel`,
      });
      dispatch({
        type: `${namespace}/getNetAssets@polling`,
        payload: { currencyCode },
      });

      // 卸载
      return () => {
        dispatch({
          type: `${namespace}/getNetAssets@polling:cancel`,
        });
      };
    }
  }, [currencyCode, dispatch]);
  return currencyCode ? netAssets : '';
};

// 初始化depth
export const useBarInit = (dispatch) => {
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const _markPrice = useGetMarginMP(dispatch);
  const _lastPrice = useGetSpotLP();
  const _netAssets = useGetNetAssets(dispatch);

  // 合约融合 TODO 价格介入之后还需要连调下
  const isFutures = tradeType === FUTURES;
  const futureMarkPrice = useMarkPrice(currentSymbol);
  const futureIndexPrice = useIndexPrice(currentSymbol);
  const futureLastPrice = useLastPrice(currentSymbol);
  // useMemo优化
  const { markPrice, indexPrice, lastPrice, netAssets } = useMemo(() => {
    return {
      // 合约融合 判断
      markPrice: isFutures ? futureMarkPrice : _markPrice,
      indexPrice: isFutures ? futureIndexPrice : '',
      lastPrice: isFutures ? futureLastPrice : _lastPrice,
      netAssets: isFutures ? '' : _netAssets,
    };
  }, [
    _markPrice,
    _lastPrice,
    _netAssets,
    futureIndexPrice,
    futureLastPrice,
    futureMarkPrice,
    isFutures,
  ]);

  // 更新标记价格，指数价格，最近成交价格，净值
  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        markPrice,
        indexPrice,
        lastPrice,
        netAssets,
      },
    });
  }, [dispatch, markPrice, indexPrice, lastPrice, netAssets]);
};
