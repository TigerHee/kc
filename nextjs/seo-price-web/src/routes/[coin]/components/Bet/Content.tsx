/**
 * Owner: mcqueen@kupotech.com
 */
import { Spin } from '@kux/mui-next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BET_MAP, STORAGE_NAME } from './config';
import NewContent from './NewContent';
import Percent from './Percent';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import { useCoinDetailStore } from '@/store/coinDetail';
import storage from 'gbiz-next/storage';
import { trackClick } from 'gbiz-next/sensors';
import { makeBet } from '@/services/coinDetail';
import styles from './content.module.scss';
import useTranslation from '@/hooks/useTranslation';
import clsx from 'clsx';
import { useRequest } from 'ahooks';


export default ({ closeAminate = () => {} }) => {
  const router = useRouter();
  const coin = router?.query.coin as string || null;

  const [value, setValue] = useState<number>();
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coin ? coinDict[coin as string] || null : null;
  const fallPercent = useCoinDetailStore((state) => state.fallPercent);
  const risePercent = useCoinDetailStore((state) => state.risePercent);
  const getBetResult = useCoinDetailStore(s => s.getBetResult);

  const { run, loading } = useRequest(getBetResult, { manual: true })
  
  const makeBetLoading = false;
  const fetchNewCoinInfosLoading = false;
  const getBetResultLoading = false;

  const { _t } = useTranslation();

  useEffect(() => {
    if (!coin) return;
    
    const data = storage.getItem(STORAGE_NAME);
    if (data && data[coin as string] !== undefined) {
      setValue(data[coin as string]);
    }
  }, [coin]);

  useEffect(() => {
    if (value !== undefined) {
      closeAminate();
    }
  }, [value, closeAminate]);

  const onClick = async (val: number) => {
    if (value !== undefined) return;
    if (!coin) return;

    closeAminate();
    try {
      trackClick(['Preview', val === 0 ? '1' : '2'], { symbol: coinObj?.currencyName || coin });
      const success = await makeBet({
        currency: coin,
        trendGuessEnum: BET_MAP[val],
      });

      if (success) {
        setValue(val);
        const data = storage.getItem(STORAGE_NAME);
        storage.setItem(STORAGE_NAME, {
          ...(data ? data : {}),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          time: moment().utc(0).valueOf(),
          [coin]: val,
        });

        run({ coin });
      }
    } catch (error) {}
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.infoWrapper}>
        <h2 className={styles.title}>{_t('uLH2nFzESdfwWwDU5BmCc7', { coinCode: coinObj?.name || coin })}</h2>
        <small className={styles.desc}>{_t('nJSKVsbsZqb6mhPvt9DCw9')}</small>
      </header>
      <Spin
        spinning={loading}
        type="normal"
      >
        <div
          className={clsx(styles.btnCont, {
            [styles.voted]: value !== undefined,
            [styles.spinning]: loading,
          })}
          
        >
          {value === undefined ? (
            <NewContent upOnClick={() => onClick(0)} downOnClick={() => onClick(1)} />
          ) : (
            <Percent risePercent={risePercent} fallPercent={fallPercent} />
          )}
        </div>
      </Spin>
    </section>
  );
};