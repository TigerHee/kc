/**
 * Owner: will.wang@kupotech.com
 */
import styles from './styles.module.scss';
import useTranslation from '@/hooks/useTranslation';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { getDefaultPlatform } from '@/tools/getPlatform';

export type CoinIconAndNameProps = {
  coin: string;
  iconUrl?: string | null;
  name?: string;
  currencyName?: string;
};

/**
 * price详情币种列表
 * @param {CoinIconAndNameProps} props
 */
export default function CoinIconAndName (props: CoinIconAndNameProps) {
  const { coin, iconUrl, name, currencyName } = props;
  const { t } = useTranslation();
  const initialProps = useInitialProps();

  const IS_H5 = initialProps?._platform === 'mobile' || initialProps?._platform === 'app';

  const coinDisplayName = currencyName ? `(${currencyName})` : `(${coin})`;

  if (IS_H5) {
    return (
      <header className={styles.coinWrapper}>
        {iconUrl ? <img className={styles.coinIcon} src={iconUrl} alt='coin icon' /> : null}
        <div className={styles.coinNameBox}>
          <h1 className={styles.coinFullName}>
            {t('coin.detail.kline.coin.latest.price', { name: name || coin })}
          </h1>
          <h2 className={styles.coinName}>{coinDisplayName}</h2>
        </div>
      </header>
    );
  }
  return (
    <header className={styles.coinWrapper}>
      {iconUrl ? <img className={styles.coinIcon} src={iconUrl} alt='coin icon' /> : null}
      <h1 className={styles.coinFullName}>
        {t('coin.detail.kline.coin.latest.price', { name: name || coin })}
      </h1>
      <h2 className={styles.coinName}>{coinDisplayName}</h2>
    </header>
  );
};