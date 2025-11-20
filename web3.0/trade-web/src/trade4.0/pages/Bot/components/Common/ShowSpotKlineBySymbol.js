/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'dva';
/**
 * @description: 点击,跳转kline
 * @param {currency | symbolCode} symbolCode  币种 或者 交易对
 * @return {*}
 */
export default ({ symbolCode, children }) => {
  const dispatch = useDispatch();
  const handle = useCallback(() => {
    if (symbolCode === 'USDT-USDT') {
      return;
    }
    symbolCode = symbolCode.includes('-USDT') ? symbolCode : `${symbolCode}-USDT`;
    dispatch({
      type: '$tradeKline/routeToSymbol',
      payload: { symbol: symbolCode },
    });
  }, [symbolCode]);
  if (!symbolCode) return children;
  return React.cloneElement(children, {
    onClick: handle,
    className: `${children.props.className} cursor-pointer`,
  });
};
