/*
 * owner: Clyne@kupotech.com
 */
import { getPriceAndAmountCurrency } from '@/hooks/common/usePair';
import {
  useGetCurrentSymbol,
  useGetCurrentSymbolInfo,
  useIsHasCurrentSymbolInfo,
} from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useGetSymbolOpenOrdersData } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { qtyToBaseCurrency, useUnit } from '@/hooks/futures/useUnit';
import { FUTURES } from '@/meta/const';
import { AMOUNT_TYPE, defaultDepthLadder, namespace } from '@/pages/Orderbook/config';
import { getDepthConfigsByTickSize, getMaxSum } from '@/pages/Orderbook/utils/format';
import { useGetOrderCurrent } from '@/pages/Orders/OpenOrders/hooks/useOpenOrdersData';
import { getSymbolAuctionInfo } from '@/utils/business';
import { useDispatch, useSelector } from 'dva';
import { getPrecisionFromIncrement } from 'helper';
import { forEach } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { _t } from 'src/utils/lang';
import { resetScroll } from '../components/List/hooks/useList';
import { getMaxTotal } from '../utils/format';
import { getModelList } from './useModelData';

// 获取买卖盘数据， 初始化
export const useInitOrderbook = (dispatch) => {
  // 原始逻辑
  const { baseIncrement, priceIncrement, isInverse } = useGetCurrentSymbolInfo();

  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );
  const { showAuction } = getSymbolAuctionInfo(
    symbolsMap?.[currentSymbol],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  let amountPrecision = getPrecisionFromIncrement(baseIncrement);
  const isHasSymbolInfo = useIsHasCurrentSymbolInfo();

  // 合约融合
  const tradeType = useTradeType();
  const futuresUnit = useUnit();
  const { baseCurrency: _baseCurrency, quoteCurrency } = getPriceAndAmountCurrency({ tradeType });
  const isQuantity = futuresUnit === 'Quantity' || isInverse;
  const futuresBaseCurrency = isQuantity ? _t('global.unit') : _baseCurrency;
  const baseCurrency = tradeType === FUTURES ? futuresBaseCurrency : _baseCurrency;
  // 张的精度为0，取整
  amountPrecision = tradeType === FUTURES && isQuantity ? 0 : amountPrecision;

  useEffect(() => {
    if (
      currentSymbol &&
      baseIncrement &&
      isHasSymbolInfo &&
      priceIncrement !== undefined &&
      quoteCurrency
    ) {
      // 合约融合扩展
      // 深度档位列表配置
      const { depthConfig } = getDepthConfigsByTickSize(priceIncrement, tradeType);
      // 当前深度档位，优先从缓存读取，缓存不存在默认第一个
      const currentDepth = defaultDepthLadder({ symbol: currentSymbol, depthConfig });
      // 基础配置初始化
      dispatch({
        type: `${namespace}/update`,
        payload: {
          quoteCurrency,
          currentDepth,
          depthConfig,
        },
      });

      // 接口参数
      const payload = {
        currentSymbol,
        currentDepth,
        showAuction,
      };

      dispatch({
        type: `${namespace}/getOrderBooks`,
        payload,
      });
    }
  }, [
    priceIncrement,
    isHasSymbolInfo,
    quoteCurrency,
    baseIncrement,
    dispatch,
    showAuction,
    tradeType,
    currentSymbol,
  ]);

  // 更新amount单位
  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        amountPrecision,
      },
    });
  }, [amountPrecision, dispatch]);

  useEffect(() => {
    resetScroll(1000);
  }, [currentSymbol]);

  /**
   * 合约融合，baseCurrency初始化
   */
  useEffect(() => {
    if (baseCurrency) {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          baseCurrency,
        },
      });
    }
  }, [baseCurrency, dispatch]);
};

export const useInitOrder = () => {
  const dispatch = useDispatch();
  const tradeType = useTradeType();
  const spotOrder = useGetOrderCurrent();
  const currentSymbol = useGetCurrentSymbol();
  // 合约
  const isFutures = tradeType === FUTURES;
  const futuresOrders = useGetSymbolOpenOrdersData({ symbol: currentSymbol });
  const data = useMemo(() => {
    const orders = isFutures ? futuresOrders : spotOrder;
    const ret = {
      sell: [],
      buy: [],
    };
    forEach(orders, ({ symbol, side, price }) => {
      // 兼容下
      if (symbol === currentSymbol && ret[side]) {
        ret[side].push(price);
      }
    });
    return ret;
  }, [currentSymbol, spotOrder, futuresOrders, isFutures]);

  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        activeOrders: data,
      },
    });
  }, [data, dispatch]);
};

// 更新
export const useOrderBookMaxAmount = () => {
  const dispatch = useDispatch();
  // 扩展功能
  const amountType = useSelector((state) => state[namespace].amountType);
  const { sell, buy } = getModelList();
  const futuresUnit = useUnit();
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const { isInverse, baseIncrement } = useGetCurrentSymbolInfo();
  const isQuantity = futuresUnit === 'Quantity' || isInverse;
  useEffect(() => {
    if (baseIncrement) {
      const isAmount = amountType === AMOUNT_TYPE;
      if (sell.length > 0 || buy.length > 0) {
        // 深度模式
        const cumulativeSum = isAmount ? 0 : getMaxSum({ sell, buy });
        // 数量模式取买卖盘个字的最大值，深度模式按照合约的逻辑做累加，取最大值结果
        const sellMaxAmount = isAmount ? getMaxTotal(sell) : cumulativeSum;
        const buyMaxAmount = isAmount ? getMaxTotal(buy) : cumulativeSum;
        dispatch({
          type: `${namespace}/update`,
          payload: {
            sellMaxAmount: qtyToBaseCurrency({
              amount: sellMaxAmount,
              isFutures,
              isQuantity,
              baseIncrement,
            }),
            buyMaxAmount: qtyToBaseCurrency({
              amount: buyMaxAmount,
              isFutures,
              isQuantity,
              baseIncrement,
            }),
          },
        });
      }
    }
  }, [sell, buy, dispatch, amountType, isFutures, baseIncrement, isQuantity]);
};
