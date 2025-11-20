/*
 * owner: Clyne@kupotech.com
 */
import { useEffect } from 'react';
import { namespace, recentTradeLoop } from '../config';
import { getPrecisionFromIncrement } from 'helper';
import { getPriceAndAmountCurrency } from '@/hooks/common/usePair';
import {
  useGetCurrentSymbolInfo,
  useIsHasCurrentSymbolInfo,
  useGetCurrentSymbol,
} from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useUnit } from '@/hooks/futures/useUnit';
import { FUTURES } from '@/meta/const';
import { _t } from 'src/utils/lang';

// 初始化数据

export const useInit = (dispatch) => {
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useGetCurrentSymbolInfo();
  const isHasSymbolInfo = useIsHasCurrentSymbolInfo();
  // 合约后续接入需要修改字段key应该
  const tickSize = symbolInfo.priceIncrement || 1;
  let amountPrecision = getPrecisionFromIncrement(symbolInfo.baseIncrement);
  const precision = getPrecisionFromIncrement(tickSize);
  const tradeType = useTradeType();

  // 这里不能使用hooks，会导致改变张，也发接口
  const { isInverse } = symbolInfo;
  const futuresUnit = useUnit();
  const { baseCurrency: _baseCurrency, quoteCurrency } = getPriceAndAmountCurrency({ tradeType });
  const isQuantity = futuresUnit === 'Quantity' || isInverse;
  const isFutures = tradeType === FUTURES;
  // 反向合约与正向合约的张逻辑
  const futuresBaseCurrency = isQuantity ? _t('global.unit') : _baseCurrency;
  const baseCurrency = isFutures ? futuresBaseCurrency : _baseCurrency;
  // 张的精度为0，取整
  amountPrecision = isFutures && isQuantity ? 0 : amountPrecision;

  useEffect(() => {
    if (isHasSymbolInfo && quoteCurrency && precision !== undefined && currentSymbol) {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          quoteCurrency,
          precision,
        },
      });
      const payload = {
        symbol: currentSymbol,
        // 区分交易类型
        tradeType,
      };
      dispatch({
        type: `${namespace}/getRecentTrade`,
        payload,
      });

      const timer = setTimeout(() => {
        dispatch({
          type: `${namespace}/checkSocket@polling`,
          payload,
        });
      }, recentTradeLoop);

      return () => {
        clearTimeout(timer);
        dispatch({
          type: `${namespace}/checkSocket@polling:cancel`,
        });
      };
    }
  }, [
    quoteCurrency,
    dispatch,
    isHasSymbolInfo,
    precision,
    currentSymbol,
    tradeType,
  ]);

  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        amountPrecision,
      },
    });
  }, [amountPrecision, dispatch]);

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
