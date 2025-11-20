/**
 * Owner: sherry.li@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { currencyMap } from '@/config/base';
import { numberFormat } from '@kux/mui-next/utils';
import { useLang } from 'gbiz-next/hooks';
import multiplyFloor from '@/tools/math/multiplyFloor';
import { useCurrencyStore } from '@/store/currency';
import { useMarketStore } from '@/store/market';
import { bootConfig } from 'kc-next/boot';

export default ({ price, symbol, hideChar, needRateConversion }) => {
  const { currentLang } = useLang();
  const currency = useCurrencyStore((state) => state.currency);
  const currencyRate = useCurrencyStore((state) => state.rates[currency]);
  const prices = useCurrencyStore((state) => state.prices);
  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);

  
  const char = useMemo(() => {
    return currencyMap[currency] || currency
  }, [currency]);


  /**
   * @param {number} price 价格
   * @param {boolean} needRateConversion 是否需要汇率换算
   */
  const NumberFormat = useCallback(
    (price, needRateConversion = true) => {
      const getfallbackPrice = () => numberFormat({
        number: price,
        lang: currentLang,
        options: { maximumFractionDigits: 8 },
      });
      
      try {
        if (!price || !+price) return '--';
        if (!prices || !symbolsInfoMap[symbol]) return getfallbackPrice();
        
        const baseCoin = symbol.split('-')[1];
        const baseCoinRate = prices ? prices[baseCoin] : null;
        const shouddCalculation = baseCoinRate && symbolsInfoMap[symbol].precision;
        const shouldThCalculation = bootConfig._BRAND_SITE_ === 'TH' && baseCoinRate;

        if (shouddCalculation || shouldThCalculation) {
          let precision = symbolsInfoMap[symbol]?.precision || 8;

          let target = needRateConversion
            ? multiplyFloor(baseCoinRate, price, precision)
            : multiplyFloor(currencyRate, price, precision);

          /**
           * 1）大于1，两位小数
           * 2）小于1，按币种精度展示
           * 3）拿不到币种精度，直接展示
           * 4）小于币种精度(8位小数)，展示< 0.0xxxx1
           */
          if (Number(target) >= 1) {
            target = numberFormat({
              number: target,
              options: { maximumFractionDigits: 2 },
              lang: currentLang,
            });
          } else {
            if (precision) {
              const minNum = '0.00000001';
              target =
                target < minNum
                  ? `< ${numberFormat({
                      number: minNum,
                      options: { maximumFractionDigits: 8 },
                      lang: currentLang,
                    })}`
                  : numberFormat({
                      number: target,
                      lang: currentLang,
                      options: {
                        maximumFractionDigits: precision,
                        minimumFractionDigits: precision,
                      },
                    });
            }
          }
          return target;
        } else {
          return getfallbackPrice();
        }
      } catch (error) {
        return getfallbackPrice();
      }
    },
    [symbol, prices, symbolsInfoMap, currencyRate, currentLang],
  );

  const finalPrice = NumberFormat(price, needRateConversion);
  if (!price || !+price) return '--';
  return hideChar ? finalPrice : `${char || ''}${finalPrice}`;
};
