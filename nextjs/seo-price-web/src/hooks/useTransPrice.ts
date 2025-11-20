/**
 * Owner: ella.wang@kupotech.com
 */
import { useMemo } from 'react';
import { numberFormat } from '@kux/mui-next/utils';
import { useLang } from 'gbiz-next/hooks';
import { currencyMap } from '@/config/base';
import { useCurrencyStore } from '@/store/currency';
import { useMarketStore } from '@/store/market';
import multiplyFloor from '@/tools/math/multiplyFloor';

const handlePrice = (price) => {
  return price.slice(0, 1) + (price.slice(1, 2) === '0' ? '' : price.slice(1, 2));
};

export default (props: { 
  price?: string;
  symbol: string | null;
  isUnsaleATemporary: boolean;
  needTransfer:  boolean;
  needHandlePrice:  boolean;
  hideChar?: boolean;
 }) => {
  const { price, symbol, isUnsaleATemporary, needTransfer, needHandlePrice, hideChar = false } = props;
  const currency = useCurrencyStore((state) => state.currency);
  const currencyRate = useCurrencyStore((state) => state.rates[currency]);
  const prices = useCurrencyStore((state) => state.prices);
  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);
  const { currentLang } = useLang();

  const transPrice = useMemo(() => {
    if (!price || typeof price !== 'string') return '';
    if (!+price) return price;
    if (!symbol) return price;

    const char = currencyMap[currency] || currency;
    const baseCoin = symbol?.split('-')[1];
    const baseCoinRate = prices ? prices[baseCoin] : null;

    if (baseCoinRate) {
      let precision = symbolsInfoMap[symbol]?.precision || 2;
      if (isUnsaleATemporary && +price < 1) {
        const decimal = (price + '').split('.')[1];
        precision = decimal?.length ?? 0;
      }

      let target = needTransfer
        ? multiplyFloor(baseCoinRate, price, precision)
        : multiplyFloor(currencyRate, price, precision);
      if (needHandlePrice) {
        //整数位大于1，小数点后取2位，末位去0。否则按照默认精度
        let newPrice = !(Math.abs(Number(price) * 1) < 1) ? (target + '').split('.')[1] || '' : '';
        target = newPrice ? (target + '').split('.')[0] + '.' + handlePrice(newPrice) : target;
      }
      target = numberFormat({
        number: target,
        lang: currentLang,
        options: { maximumFractionDigits: precision, minimumFractionDigits: precision },
      });
      return hideChar ? target : `${char}${target}`;
    } else {
      return numberFormat({
        number: price,
        lang: currentLang,
        options: { maximumFractionDigits: 2 },
      });
    }
  }, [
    currency,
    currencyRate,
    prices,
    symbolsInfoMap,
    price,
    symbol,
    isUnsaleATemporary,
    needTransfer,
    needHandlePrice,
    hideChar,
    currentLang,
  ]);

  return transPrice;
};
