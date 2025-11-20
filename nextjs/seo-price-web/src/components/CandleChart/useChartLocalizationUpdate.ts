/**
 * Owner: will.wang@kupotech.com
 */
import { numberFormat } from '@kux/mui-next/utils';
import { IChartApi } from "lightweight-charts";
import multiplyFloor from "@/tools/math/multiplyFloor";
import { useUpdateEffect } from "ahooks";
import { MutableRefObject } from "react";
import { useCurrencyStore } from "@/store/currency";
import { useLang } from "gbiz-next/hooks";
import { useMarketStore } from "@/store/market";
import Decimal from 'decimal.js';

export default function useChartLocalizationUpdate(options: {
  symbol: string;
  resolution: string;
  chartRef: MutableRefObject<IChartApi | null>;
}) {
  const { symbol, resolution, chartRef } = options;
  const { currentLang: lang } = useLang();
  const currency = useCurrencyStore((state) => state.currency);
  const prices = useCurrencyStore((state) => state.prices);
  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);

  useUpdateEffect(() => {
    if (currency && symbol && chartRef.current) {
      chartRef.current.applyOptions({
        localization: {
          priceFormatter(price: Decimal.Value) {
            let baseCoinRate = prices[symbol.split('-')[1]];

            if (baseCoinRate) {
              let target =
                multiplyFloor(
                  baseCoinRate,
                  price,
                  !(Math.abs(+price) < 1) ? 2 : symbolsInfoMap[symbol]?.precision,
                ) + '';

              let integer = target.split('.')[0];
              let decimals = '';
              let unit = '';

              //整数位大于1，小数点后取2位，末位去0。否则按照默认精度
              //当数值大于等于10000时，使用K，小数保留两位
              //当数值大于等于1000000时，使用M，小数保留两位

              if (integer.length > 6) {
                target = (+integer * 1) / 1000000 + '';
                decimals = target.split('.')[1];
                unit = 'M';
              } else if (integer.length > 4) {
                target = (+integer * 1) / 1000 + '';
                decimals = target.split('.')[1];
                unit = 'K';
              } else {
                // (避免出现竖轴的数据1.00xxx的数据变化(1.11232,1.11453,保留两位展示1.11)，调整展示全部小数)
                // decimals = !(Math.abs(price) < 1) ? (target+'').split('.')[1] : '';
              }

              target = decimals
                ? (target + '').split('.')[0] +
                  '.' +
                  decimals.slice(0, 1) +
                  (decimals.slice(1, 2) === '0' ? '' : decimals.slice(1, 2))
                : target;

              const precision = decimals ? 2 : symbolsInfoMap[symbol]?.precision || 8;

              target = numberFormat({
                number: target,
                lang: lang,
                options: { maximumFractionDigits: precision, minimumFractionDigits: precision },
              });
              return target + unit;
            }

            return price
              ? numberFormat({
                  number: price,
                  lang,
                  options: {
                    maximumFractionDigits: symbolsInfoMap[symbol]?.precision || 8,
                    minimumFractionDigits: symbolsInfoMap[symbol]?.precision || 2,
                  },
                })
              : price;
          },
        },
      });
    }
  }, [currency, symbol, prices, symbolsInfoMap, lang, resolution]);
}