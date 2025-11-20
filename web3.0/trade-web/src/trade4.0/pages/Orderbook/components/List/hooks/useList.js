/*
 * owner: Clyne@kupotech.com
 */
import { useEffect, useMemo, useContext } from 'react';
import { useSelector, useDispatch } from 'dva';
import {
  tipEvent,
  namespace,
  eventName,
  ORDER_BOOK_SELL,
  ORDER_BOOK_BUY,
  WrapperContext,
} from '@/pages/Orderbook/config';
import { event } from '@/utils/event';
import { getIndexs } from '../utils';
// import { getModelList } from '@/pages/Orderbook/hooks/useModelData';

const listH = {
  [ORDER_BOOK_SELL]: 0,
  [ORDER_BOOK_BUY]: 0,
};

export const useList = ({ ref, type, active, data, isCombineSell }) => {
  const dispatch = useDispatch();
  const screen = useContext(WrapperContext);
  const isMs = screen === 'sm';
  // 数据
  const length = data.length;
  const currentDepth = useSelector((state) => state[namespace].currentDepth);
  useEffect(() => {
    // 这里有点奇葩，要加个setTimout，不然有一定的几率scroll不到底部
    setTimeout(() => {
      handle({});
    }, 0);

    const handle = ({ height } = {}) => {
      if (listH[type] !== height) {
        if (ref && ref.current && ref.current.scrollToRow) {
          if (type === ORDER_BOOK_SELL) {
            ref.current.scrollToRow(isCombineSell ? 0 : length);
          } else {
            ref.current.scrollToRow(0);
          }
          listH[type] = height;
        }
      }
    };
    event.on(eventName, handle);
    return () => {
      event.off(eventName, handle);
    };
  }, [type, length, ref, isCombineSell, isMs]);

  const activeIndexs = useMemo(() => {
    return getIndexs({ data, type, prices: active, currentDepth });
  }, [active, type, data, currentDepth]);

  const onMouseOver = (e) => {
    const node = e.target;
    const itemData = node?.getAttribute('data-orderbook-item');
    if (node && itemData) {
      const _data = itemData.split('-');
      event.emit(tipEvent, {
        e,
        // data
        data: _data,
        show: true,
        type,
        index: _data[3],
      });
      dispatch({
        type: `${namespace}/update`,
        payload: {
          hoverIndex: _data[3],
          hoverType: type,
        },
      });
    }
  };

  const onMouseLeave = () => {
    event.emit(tipEvent, { show: false });
    dispatch({
      type: `${namespace}/update`,
      payload: {
        hoverIndex: -1,
        hoverType: '',
      },
    });
  };
  return { onMouseLeave, onMouseOver, activeIndexs, length };
};

let timer;

export const resetScroll = (time = 0) => {
  // 重制买卖盘滚动条, 这里的height只是用来出发重制
  const emit = () => event.emit(eventName, { height: Math.floor(Math.random() * 100000) });
  clearTimeout(timer);
  timer = setTimeout(() => {
    emit();
  }, time);
};
