/*
 * @owner: borden@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { routerRedux } from 'dva/router';
import { useParams, useLocation } from 'react-router-dom';

import { useGetCurrentSymbol, getFuturesSymbols } from '@/hooks/common/useSymbol';
import useFuturesReady from '@/hooks/futures/useFuturesReady';

import storage from 'src/utils/storage';
import { FUTURES, ISOLATED, MARGIN, SPOT, isFuturesNew } from '@/meta/const';
import { checkContractsStatus } from '@/utils/futures';
import { isSpotTypeSymbol } from '../common/useIsSpotSymbol';
import { initStrategy } from 'Bot/init';

const getSymbol = ({ tradeType, symbol, strategySymbol }) => {
  // 策略模式下, symbol可能是具体的某个策略类型, 如: spotgrid
  if (tradeType === 'strategy') {
    if (symbol && strategySymbol) {
      return strategySymbol;
    } else if (symbol) {
      return symbol;
    }
  }
  // 现货的path,tradeType是空，此时:tradeType读到的是symbol
  return symbol || tradeType;
};

export default function useInitCurrentSymbol() {
  const dispatch = useDispatch();
  // const currentSymbol = useGetCurrentSymbol();
  const { tradeType, symbol, strategySymbol } = useParams();
  const { pathname } = useLocation();
  const symbolFromUrl = getSymbol({ tradeType, symbol, strategySymbol });

  const futuresReady = useFuturesReady();
  const futuresInit = useCallback(
    async (toTradeType) => {
      let _symbol = symbolFromUrl || storage.getItem('trade_current_symbol');

      // 如果 symbol 不存在直接重定向到默认路由
      if (!_symbol) {
        dispatch(routerRedux.replace(`/futures/XBTUSDTM/${location.search}`));
        return;
      }
      if (futuresReady) {
        const contracts = getFuturesSymbols();

        // 检查symbol是否合法
        const isLegal = await dispatch({
          type: 'tradeFormUtils/checkFuturesSymbol',
          payload: {
            symbol: _symbol,
          },
        });
        // 如果该symbol 不合法，确定是否为 XBTUSDTM，不是则再确认 XBTUSDTM 是否存在，否则直接按列表往下挑
        let currentContract = null;
        if (!isLegal) {
          if (_symbol !== 'XBTUSDTM' && checkContractsStatus({ symbol: 'XBTUSDTM', contracts })) {
            _symbol = 'XBTUSDTM';
          } else {
            const keys = Object.keys(contracts);
            for (let i = 0; i < keys.length; ++i) {
              if (checkContractsStatus({ symbol: keys[i], contracts })) {
                _symbol = keys[i];
                break;
              }
            }
          }
        }
        currentContract = contracts[_symbol] || {};

        await dispatch({
          type: '$tradeKline/routeToSymbol',
          payload: {
            symbol: _symbol,
            toTradeType,
          },
        });
        await dispatch({
          type: 'trade/update',
          payload: {
            currentSymbol: _symbol,
          },
        });
        // 初始化策略类型和交易对
        initStrategy({
          dispatch,
          pathname,
          currentSymbol: _symbol,
        });
        await dispatch({
          type: 'symbols/update',
          payload: {
            futuresCurrentSymbolInfo: currentContract,
          },
        });
      }
    },
    [dispatch, symbolFromUrl, futuresReady, pathname],
  );

  useEffect(() => {
    async function init() {
      let _symbol = symbolFromUrl || storage.getItem('trade_current_symbol');
      const isSpotSymbolType = isSpotTypeSymbol(_symbol);
      // 判断是不是合约的策略交易
      const isFuturesStrategy = isFuturesNew() && tradeType === 'strategy' && !isSpotSymbolType;
      // 如果是合约，走合约初始化流程
      if ((isFuturesNew() && tradeType === 'futures') || isFuturesStrategy) {
        futuresInit(FUTURES);
        return;
      }
      let toTradeType = SPOT;

      if (tradeType === 'isolated') {
        toTradeType = ISOLATED;
      } else if (tradeType === 'margin') {
        toTradeType = MARGIN;
      } else if (tradeType === 'strategy') {
        toTradeType = isSpotSymbolType ? SPOT : FUTURES;
      }
      // 检查symbol是否合法
      const ret = await dispatch({
        type: 'tradeFormUtils/checkSymbol4_0',
        payload: {
          symbol: _symbol,
          tradeType,
          dispatch,
        },
      });

      // 重定向不继续走了
      if (ret === undefined) {
        return;
      }
      // FIXME: 这里不存在应该直接取默认交易对，这里逻辑有漏洞，如果 BTC 也不存在，永远都跳转不了
      if (!ret) {
        _symbol = 'BTC-USDT';
      }
      await dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: {
          symbol: _symbol,
          toTradeType,
        },
      });
      await dispatch({
        type: 'trade/update',
        payload: {
          currentSymbol: _symbol,
        },
      });
      // 初始化策略类型和交易对
      initStrategy({
        dispatch,
        pathname,
        currentSymbol: _symbol,
      });
    }
    init();
  }, [dispatch, symbolFromUrl, tradeType, futuresInit, pathname]);
}
