/**
 * Owner: will.wang@kupotech.com
 */
import useTranslation from "@/hooks/useTranslation";
import { useCurrencyStore } from "@/store/currency";
import styles from './KlineStatus.module.scss';
import clsx from "clsx";
import numberFixed from "@/tools/numberFixed";

const LabelMap = {
  open: '9gW2oLsoMGQYtoDHKs7Sdo',
  high: 'pT1r4HNfXr3zEzhsAm6bhw',
  low: 'wywQaaQS4PWDJSABFhFyAG',
  close: '5QPyaWBbRAw2t3ssNMZGoU',
};

const KlineStatus = (props: {
  bar: any;
  precision: number;
  symbol: string;
}) => {
  const { _t } = useTranslation();
  const { bar: price = {}, precision, symbol } = props;
  const isNegative = price.close < price.open;
  const change = ((price.close - price.open) / price.open) * 100;
  const range = ((price.high - price.low) / price.open) * 100;
  const prices = useCurrencyStore((state) => state.prices);

  const NumberFormat = (price, symbol, idx = 0) => {
    try {
      if (!price) return price;
      const baseCoin = symbol.split('-')[idx];
      const baseCoinRate = prices ? prices[baseCoin] : null;

      if (baseCoinRate) {
        let target = Number(baseCoinRate || 0) * price; // 多次高精度计算的bug
        return target;
      } else {
        return price;
      }
    } catch (error) {
      return price;
    }
  };

  return (
    <div className={styles.wrapper}>
      {!!price.open && (
        <>
          {Object.keys(LabelMap).map((key) => {
            return (
              <span className={styles.label} key={key}>
                {_t(LabelMap[key])}
                <span
                  className={clsx(styles.priceChange, {
                    [styles.negative]: isNegative,
                  })}
                 >
                  {numberFixed(NumberFormat(price[key], symbol, 1), precision)}
                </span>
              </span>
            );
          })}
          <span className={styles.label}>
            {_t('7fBjKjvMKrxnbJxAyXJudy')}
            <span
              className={clsx(styles.priceChange, {
                [styles.negative]: isNegative,
              })}
            >
              {numberFixed(change, 2)}%
            </span>
          </span>
          <span className={styles.label}>
            {_t('qmGh3gT1uWxgaNy2zxSMhm')}
            <span
              className={clsx(styles.priceChange, {
                [styles.negative]: isNegative,
              })}
            >
              {numberFixed(range, 2)}%
            </span>
          </span>
        </>
      )}
    </div>
  );
};

export default KlineStatus;