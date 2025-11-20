/**
 * Owner: ella.wang@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { numberFormat } from '@kux/mui/utils';
import { currencyMap } from 'config/base';
import { multiplyFloor } from 'helper';
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';

const handlePrice = (price) => {
  return price.slice(0, 1) + (price.slice(1, 2) === '0' ? '' : price.slice(1, 2));
};

export default ({ price, symbol, isUnsaleATemporary, needTransfer, needHandlePrice, hideChar }) => {
  const currency = useSelector((state) => state.currency.currency);
  const currencyRate = useSelector((state) => state.currency.rates[currency]);
  const prices = useSelector((state) => state.currency.prices);
  const symbolsInfoMap = useSelector((state) => state.market.symbolsInfoMap);
  const { currentLang } = useLocale();

  const val = useMemo(() => {
    if (!+price) return price;
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
        let newPrice = !(Math.abs(price * 1) < 1) ? (target + '').split('.')[1] || '' : '';
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

  return val;
};
