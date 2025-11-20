/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-03-11 14:25:40
 * @Description: 获取当前交易对中包含的杠杆代币(只可能包含一种)
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default (symbol) => {
  const currentSymbol = useSelector(state => state.trade.currentSymbol);
  const symbolsMap = useSelector(state => state.symbols.symbolsMap);
  const _symbol = symbol || currentSymbol;
  // 杠杆代币的交易对，杠杆代币一定是base币种
  return useMemo(() => {
    let nextEtfCoin;
    if (
      symbolsMap[_symbol] &&
      symbolsMap[_symbol].type === 'MARGIN_FUND'
    ) {
      nextEtfCoin = (_symbol.split('-'))[0];
    }
    return nextEtfCoin;
  }, [_symbol, symbolsMap]);
};

