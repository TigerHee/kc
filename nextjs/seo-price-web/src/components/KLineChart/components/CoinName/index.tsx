/**
 * Owner: sherry.li@kupotech.com
 */
import useScreen from 'src/hooks/useScreen';
import styles from './styles.module.scss';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import useTranslation from '@/hooks/useTranslation';

/**
 * 
 */
export default () => {
  const router = useRouter();
  const coin = router?.query.coin as string;
  const coinDict = useCategoriesStore((s) => s.coinDict);
  const coinObj = coin && coinDict ? coinDict[coin] : {};
  const { isSm } = useScreen();
  const { _t } = useTranslation();

  const coinDisplayName = coinObj?.currencyName ? `(${coinObj?.currencyName})` : `(${coin})`;

  if (isSm) {
    return (
      <header className={styles.coinWrapper}>
        {coinObj?.iconUrl ? <img className={styles.coinIcon} src={coinObj?.iconUrl} alt='coin icon' /> : null}
        <div className={styles.coinNameBox}>
          <h1 className={styles.coinFullName}>
            {_t('coin.detail.kline.coin.latest.price', { name: coinObj?.name || coin })}
          </h1>
          <h2 className={styles.coinName}>{coinDisplayName}</h2>
        </div>
      </header>
    );
  }
  return (
    <header className={styles.coinWrapper}>
      {coinObj?.iconUrl ? <img className={styles.coinIcon} src={coinObj?.iconUrl} alt='coin icon' /> : null}
      <h1 className={styles.coinFullName}>
        {_t('coin.detail.kline.coin.latest.price', { name: coinObj?.name || coin })}
      </h1>
      <h2 className={styles.coinName}>{coinDisplayName}</h2>
    </header>
  );
};