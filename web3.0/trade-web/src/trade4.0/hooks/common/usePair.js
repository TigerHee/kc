/**
 * Owner: borden@kupotech.com
 */
import { useSelector } from 'dva';
import { getCoinInfo, getCurrencyInfo } from './useCoin';
import { getStateFromStore } from '@/utils/stateGetter';
import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from './useSymbol';
import { FUTURES } from 'src/trade4.0/meta/const';

// 获取价格，数量的单位
export const getPriceAndAmountCurrency = ({ tradeType }) => {
  const currentSymbol = useGetCurrentSymbol();
  // 现货逻辑根据当前symbol分割，然后根据币种数据去拿currencyName
  const [base, quote] = currentSymbol.split('-');
  const baseCurrency = useSelector((state) => state.categories[base]?.currencyName);
  const quoteCurrency = useSelector((state) => state.categories[quote]?.currencyName);
  // 合约融合
  const isFutures = tradeType === FUTURES;
  const { baseCurrency: _baseCurrency, quoteCurrency: _quoteCurrency } = useGetCurrentSymbolInfo();
  return {
    baseCurrency: isFutures ? _baseCurrency : baseCurrency,
    quoteCurrency: isFutures ? _quoteCurrency : quoteCurrency,
  };
};

export default function usePair(symbol) {
  const _symbol = useSelector((state) => state.trade.currentSymbol);

  if (!symbol) {
    symbol = _symbol;
  }

  const [base, quote] = symbol.split('-');
  const baseInfo = getCoinInfo({ coin: base });
  const quoteInfo = getCoinInfo({ coin: quote });

  return {
    symbol,
    baseInfo,
    quoteInfo,
  };
}

export function getPair(symbol) {
  if (!symbol) {
    symbol = getStateFromStore((state) => state.trade.currentSymbol);
  }

  const [base, quote] = symbol.split('-');
  const baseInfo = getCurrencyInfo(base);
  const quoteInfo = getCurrencyInfo(quote);

  return {
    symbol,
    baseInfo,
    quoteInfo,
  };
}
