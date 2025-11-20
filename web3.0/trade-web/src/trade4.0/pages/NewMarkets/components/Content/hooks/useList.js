/*
 * @Owner: Clyne@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { useCallback, useState, useContext } from 'react';
import { MARKET_RESUBSCRIBE_EVENT, PAGE_SIZE, SwitchContext, namespace } from '../../../config';
import { debounce } from 'lodash';
import { getStore } from 'src/utils/createApp';
/**
 * 下一页
 */
export const useNext = () => {
  const pageNo = useSelector((state) => state[namespace].currentPage);
  const total = useSelector((state) => state[namespace].total);
  const dispatch = useDispatch();
  const tablePagination = {
    currentPage: pageNo,
    hasMore: total - pageNo * PAGE_SIZE > 0,
  };
  const pullNext = useCallback(
    async (nextPage) => {
      console.log('=====next', nextPage);
      await dispatch({
        type: `${namespace}/update`,
        payload: {
          timestamp: Date.now(),
          isNext: true,
        },
      });
    },
    [dispatch],
  );
  return { pullNext, tablePagination };
};

let noSwitchCache = [];

export const useListScroll = () => {
  const isSwitch = useContext(SwitchContext);
  const [scroll, setScroll] = useState(false);
  const dispatch = useDispatch();

  const renderChange = useCallback(
    debounce((obj = {}) => {
      const { startIndex, endIndex } = obj;
      const { data, symbols: lastSymbols } = getStore().getState()[namespace];
      const symbols = [];
      for (let i = startIndex; i <= endIndex; i++) {
        const { symbolCode } = data[i] || {};
        symbols.push(symbolCode);
      }

      dispatch({
        type: `${namespace}/update`,
        payload: {
          symbols,
          lastSymbols,
        },
      });
      // 不再switch的行情都缓存一份当前的symbols，用于后面关闭下拉的行情后重新订阅
      if (!isSwitch) {
        noSwitchCache = symbols;
      }
    }, 200),
    [scroll, dispatch],
  );
  return { renderChange, setScroll };
};

/**
 * 重新订阅
 * @returns
 */
export const useResetSubscribe = () => {
  const dispatch = useDispatch();
  const reSubscribe = useCallback(() => {
    const { symbols: lastSymbols } = getStore().getState()[namespace];
    dispatch({
      type: `${namespace}/update`,
      payload: {
        symbols: noSwitchCache,
        lastSymbols,
      },
    });
    noSwitchCache = [];
  }, [dispatch]);
  return { reSubscribe };
};
