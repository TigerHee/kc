/**
 * Owner: mcqueen@kupotech.com
 */
import moment from 'moment';
import { ReactNode, useMemo } from 'react';
import ChangeRate from '@/components/common/ChangeRate';
import styles from './Context.module.scss';
import clsx from 'clsx';

export default (props: {
  coin: string;
  coinObj: any;
  renderedPrice: ReactNode;
  latestPrice: string | number | null;
  bestSymbol: string;
  currentChangeRate: number | null;
  changeRateLabel: string
}) => {
  const { coin, coinObj, renderedPrice, latestPrice, bestSymbol, currentChangeRate, changeRateLabel } = props;
  

  const coinNameView = useMemo(() => {
    const coinName = coinObj?.name || coin;
    const currencyName = coinObj?.currencyName ? `(${coinObj?.currencyName})` : `(${coin})`;

    return (
      <div className={styles.coinName}>
        <span>{coinName}</span>
        <span>{currencyName}</span>
      </div>
    )
  }, [coin, coinObj?.currencyName, coinObj?.name]);

  return (
    <div className={styles.wrapper} style={{ height: 400 }}>
      {coinObj?.iconUrl ? (
        <img
          alt="coin icon"
          className={styles.coinIcon}
          src={coinObj?.iconUrl + '?t=' + Date.now()}
          {...(coinObj?.iconUrl.includes('assets-currency.kucoin.net')
            ? {}
            : { crossOrigin: 'anonymous' })}
        />
      ) : null}
      {coinNameView}
      <div className={styles.price}>
        {latestPrice === null ? (
          '--'
        ) : renderedPrice}
      </div>

      <div className={clsx(styles.priceChange, {
        [styles.greaterThanZero]: (currentChangeRate ?? 0) > 0,
        [styles.lessThanZero]: (currentChangeRate ?? 0) < 0,
      })}>
        {currentChangeRate === null ? (
          '--'
        ) : (
          <>
            <ChangeRate value={currentChangeRate} className={styles.extendedChangeRate} />
            <span className={styles.changeRateLabel}>({changeRateLabel})</span>
          </>
        )}
      </div>
      <div className={styles.dateLabel}>{moment().utcOffset(0).format('YYYY/MM/DD HH:mm')} (UTC)</div>
    </div>
  );
};
