/**
 * Owner: borden@kupotech.com
 */
import { useCallback, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { map } from 'lodash';
import { namespace, WrapperContext } from '@/pages/Chart/config';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import {
  KLINE_BOX_COUNT,
  KLINE_ACTIVE_IDX,
  KLINE_SYMBOLS,
} from '@/storageKey/chart';
import storage from '@/pages/Chart/utils/index';

const { setItem } = storage;

export const useBoxCount = () => {
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  // md断点的时候四宫格变为一宫格
  const screen = useContext(WrapperContext);

  const boxCount = useSelector((state) => state[namespace].boxCount);
  const kLineSymbols = useSelector((state) => state[namespace].kLineSymbols);

  /**
   * 切换1宫格 k线显示当前交易对
   * 切换4宫格 k线显示前3个交易对（不包含当前交易对）+ 当前交易对
   * 切换宫格当前交易对不变
   */
  const onBoxCountChange = useCallback(
    async (count) => {
      let symbols = [];
      // displayIndex为0时是当前选中的交易对
      if (count === '1') {
        // 切换1宫格 k线显示当前交易对
        symbols = map(kLineSymbols, (item) => {
          return {
            ...item,
            displayIndex: item.symbol === currentSymbol ? 0 : 100,
          };
        });
      } else if (count === '4') {
        // 切换4宫格 k线显示当前交易对 + 前3个交易对（不包含当前交易对）
        let numIndex = 0;
        symbols = map(kLineSymbols, (item) => {
          if (item.symbol !== currentSymbol) {
            numIndex += 1;
          }
          return {
            ...item,
            displayIndex: item.symbol === currentSymbol ? 0 : numIndex,
          };
        });
      }

      const payload = {
        boxCount: count,
        activeIndex: 0,
        kLineSymbols: symbols,
      };
      setItem(KLINE_BOX_COUNT, count);
      setItem(KLINE_ACTIVE_IDX, 0);
      setItem(KLINE_SYMBOLS, symbols);

      await dispatch({
        type: `${namespace}/update`,
        payload,
      });
      return { boxCount: count };
    },
    [kLineSymbols, currentSymbol, dispatch],
  );

  // md断点的时候，四宫格需变为一宫格
  useEffect(() => {
    if (screen === 'md' && boxCount === '4') {
      onBoxCountChange('1');
    }
  }, [screen, boxCount, onBoxCountChange]);

  return { onBoxCountChange, boxCount };
};
