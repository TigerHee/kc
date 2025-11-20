/**
 * Owner: borden@kupotech.com
 */
import { useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { findIndex, remove, debounce } from 'lodash';
import { namespace } from '@/pages/Chart/config';
import { getSymbolInfo, useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useMarketSocket } from './useSocket';
import { useBoxCount } from './useBoxCount';
import { isSpotTypeSymbol } from '../../OrderForm/FuturesFormNew/builtinHooks';
import { FUTURES } from '../../Futures/import';

// 获取klineSymbols、activeIndex，并提供 切换symbol、新增symbol、删除symbol、切换全屏 方法
export const useKlineSymbols = () => {
  const dispatch = useDispatch();
  const { onBoxCountChange, boxCount } = useBoxCount();
  const kLineSymbols = useSelector((state) => state[namespace].kLineSymbols);
  const activeIndex = useSelector((state) => state[namespace].activeIndex);

  // 切换symbol
  const onSymbolChange = useCallback(
    debounce(
      (symbol) => {
        const isFuturesSymbol = !isSpotTypeSymbol(symbol);
        const futuresSymbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
        // 非法合约交易对，直接close
        // 合约交易对 && 非Open状态，走remove逻辑
        if (isFuturesSymbol && futuresSymbolInfo.status !== 'Open') {
          onDeleteSymbol(document.createEvent('Event'), symbol);
          return;
        }
        dispatch({
          type: `${namespace}/routeToSymbol`,
          payload: { symbol },
        });
      },
      500,
      {
        leading: true,
      },
    ),
    [],
  );

  // 新增symbol
  const onAddSymbol = useCallback(
    (symbol) => {
      dispatch({
        type: `${namespace}/routeToSymbol`,
        payload: { symbol },
      });
    },
    [dispatch],
  );

  // 删除symbol
  const onDeleteSymbol = useCallback(
    (e, symbol) => {
      e.preventDefault();
      e.stopPropagation();
      const kLineSymbolsTemp = [...kLineSymbols];
      // 当前删除的symbol在tabs的位置
      const klineSymbolIndex = findIndex(kLineSymbolsTemp, { symbol });

      let _activeIndex;
      let _activeSymbol;
      let _tradeType;

      const deleteDisplayIndex = kLineSymbolsTemp[klineSymbolIndex]?.displayIndex;
      if (deleteDisplayIndex >= +boxCount) {
        // 关闭的symbol没在下方宫格中，直接删除
        remove(kLineSymbolsTemp, (item) => item.symbol === symbol);
      } else if (kLineSymbolsTemp.length > +boxCount) {
        // tabs中symbol大于下方宫格数，需补充到下方宫格, 此场景下activeIndex不会改变
        // 找到第一个没有显示在k线box的tab
        const firstIndex = findIndex(kLineSymbolsTemp, (item) => {
          return item.displayIndex >= 4;
        });
        if (deleteDisplayIndex === activeIndex) {
          // 关闭activeIndex Symbol
          _activeSymbol = kLineSymbolsTemp[firstIndex].symbol;
          _tradeType = kLineSymbolsTemp[firstIndex].tradeType;
        }
        kLineSymbolsTemp[firstIndex].displayIndex = deleteDisplayIndex;

        remove(kLineSymbolsTemp, (item) => item.symbol === symbol);
      } else {
        let needChange = false;
        // tabs中symbol小于下方宫格数, 且删除对象为活跃symbol,此场景下activeIndex需要改变
        if (kLineSymbolsTemp[klineSymbolIndex]?.displayIndex === activeIndex) {
          needChange = true;
        }
        remove(kLineSymbolsTemp, (item) => item.symbol === symbol);

        // 设定第一个为活跃symbol
        if (needChange) {
          _activeIndex = kLineSymbolsTemp[0].displayIndex;
          _activeSymbol = kLineSymbolsTemp[0].symbol;
          _tradeType = kLineSymbolsTemp[0].tradeType;
        }
      }

      dispatch({
        type: `${namespace}/modifyKlineUpdate`,
        payload: { activeIndex: _activeIndex, kLineSymbols: kLineSymbolsTemp },
      });

      if (_activeSymbol) {
        dispatch({
          type: 'trade/modifyCurrentSymbol',
          payload: {
            currentSymbol: _activeSymbol,
            tradeType: _tradeType,
          },
        });
      }
    },
    [kLineSymbols, boxCount, activeIndex, dispatch],
  );

  // 切换全屏并选中当前symbol
  const onFullScreenSymbol = useCallback(
    async (e, symbol) => {
      e.stopPropagation();

      await onBoxCountChange('1');
      dispatch({
        type: `${namespace}/routeToSymbol`,
        payload: { symbol },
      });
    },
    [onBoxCountChange, dispatch],
  );

  return {
    onSymbolChange,
    onAddSymbol,
    onDeleteSymbol,
    onFullScreenSymbol,
    kLineSymbols,
    activeIndex,
  };
};

// 初始化klineSymbols行情数据 socket pulldata (合约通过全量拉取，不特殊处理)
export const useKlineMarketsInit = () => {
  const { symbolListStr } = useMarketSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (symbolListStr) {
      dispatch({
        type: `${namespace}/pullMarkets`,
        payload: {
          query: symbolListStr,
          isPolling: false,
        },
      });
      dispatch({
        type: `${namespace}/pullMarkets@polling`,
        payload: {
          query: symbolListStr,
        },
      });
      return () => {
        dispatch({
          type: `${namespace}/pullMarkets@polling:cancel`,
        });
      };
    }
  }, [dispatch, symbolListStr]);
};

// 获取指定symbol的最新价、涨跌百分比 (合约通过全量拉取，不特殊处理)
export const useSymbolPrice = ({ symbol }) => {
  const kLineTabsMarketMap = useSelector((state) => state[namespace].kLineTabsMarketMap);

  const symbolMarketInfo = useMemo(() => {
    return {
      // 最新价
      lastTradedPrice: kLineTabsMarketMap[symbol]?.lastTradedPrice,
      // 涨跌百分比
      changeRate: kLineTabsMarketMap[symbol]?.changeRate,
    };
  }, [kLineTabsMarketMap, symbol]);

  return { ...symbolMarketInfo };
};
