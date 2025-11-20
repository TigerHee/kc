/*
 * owner: Clyne@kupotech.com
 */
import { useEffect, useState, useMemo, useContext } from 'react';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import {
  namespace,
  tipEvent,
  ORDER_BOOK_BUY,
  WrapperContext,
  ORDER_BOOK_SELL,
} from '@/pages/Orderbook/config';
// import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { event } from '@/utils/event';
import { getAvaragePrice } from '../utils';
import { useIsRTL } from '@/hooks/common/useLang';

export const useTip = ({ ref }) => {
  const [data, setData] = useState([]);
  const [type, setType] = useState('');
  const [style, setStyle] = useState({});
  const [arrow, setArrow] = useState('right');
  const isRTL = useIsRTL();
  const screen = useContext(WrapperContext);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  // const { priceIncrement: tickSize } = useGetCurrentSymbolInfo();
  const amountPrecision = useSelector((state) => state[namespace].amountPrecision);
  const [price, amount, total, hoverIndex] = data;

  useEffect(() => {
    if (ref.current) {
      const wrapperNode = document.querySelector('.order-book');
      const handle = ({ e, data: itemData, show, type: _type }) => {
        if (show) {
          const {
            top: wrapperTop,
            width: wrapperW,
            left: wrapperL,
            right: wrapperR,
          } = wrapperNode?.getBoundingClientRect() || {};
          const { top, height } = e.target?.getBoundingClientRect() || {};
          const { height: tipHeight, width: tipWidth } = ref.current.getBoundingClientRect() || {};
          const topStyle = `${top - wrapperTop + height / 2 - (tipHeight || 86) / 2}px`;
          const isMs = screen === 'sm';
          const isBuy = _type === ORDER_BOOK_BUY;
          const bodyW = document.body.offsetWidth;

          // rtl, 贴近右侧
          if (isRTL && tipWidth >= bodyW - wrapperR) {
            setStyle({
              top: topStyle,
              left: isMs || isBuy ? 0 : `${wrapperW / 2}px`,
              transform: 'translateX(calc(-100% - 10px))',
            });
            setArrow('left');
            // rtl, 贴近左侧
          } else if (isRTL && tipWidth < wrapperR) {
            setStyle({
              top: topStyle,
              left: 'auto',
              right: isMs || !isBuy ? 0 : `${wrapperW / 2}px`,
              transform: 'translateX(calc(100% + 10px))',
            });
            setArrow('right');
            // ltr, 贴近左侧
          } else if (tipWidth >= wrapperL) {
            setStyle({
              top: topStyle,
              left: 'auto',
              right: isMs || isBuy ? 0 : `${wrapperW / 2}px`,
              transform: 'translateX(calc(100% + 10px))',
            });
            setArrow('left');
            // 正常情况
          } else {
            setStyle({
              top: topStyle,
              left: isMs || !isBuy ? 0 : `${wrapperW / 2}px`,
              transform: 'translateX(calc(-100% - 10px))',
            });
            setArrow('right');
          }
          setData(itemData);
          setType(_type);
        } else {
          setData([]);
          setType('');
        }
      };
      event.on(tipEvent, handle);
      return () => event.off(tipEvent);
    }
  }, [ref, isRTL, screen, setStyle]);

  const { avaragePrice, volume } = useMemo(() => {
    return getAvaragePrice({
      currentSymbol,
      type,
      hoverIndex,
      isCombineSell: screen !== 'sm' && type === ORDER_BOOK_SELL,
    });
  }, [currentSymbol, type, hoverIndex, screen]);
  return {
    avaragePrice,
    price,
    amount,
    total,
    dataLength: data.length,
    amountPrecision,
    volume,
    style,
    arrow,
  };
};
