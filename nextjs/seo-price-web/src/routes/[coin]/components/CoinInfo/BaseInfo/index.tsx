/**
 * Owner: kevyn.yu@kupotech.com
 */
import { fade } from '@kux/mui-next/utils/colorManipulator.js';
import { useState } from 'react';
import HighAndLowPrice from '../HighAndLowPrice';
import MoreBtn from '../MoreBtn';
import PriceInfo from '../PriceInfo';
import RankInfo from '../RankInfo';
import SocialInfo from '../SocialInfo';
import PriceAnalysis from './PriceAnalysis';
import clsx from 'clsx';
import styles from './style.module.scss';
import { useCoinDetailStore } from '@/store/coinDetail';
import { trackClick } from 'gbiz-next/sensors';
import useTranslation from '@/hooks/useTranslation';
import Title from '@/components/common/Title';
import { useCategoriesStore } from '@/store/categories';
import NewBet from '@/routes/[coin]/components/Bet';
import { useRouter } from 'kc-next/compat/router';


export default () => {
  const router = useRouter();
  const coin = router?.query.coin;
  const coinInfo = useCoinDetailStore((state) => state.coinInfo);
  const { isUnsale, isTemporary } = coinInfo;
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coin ? coinDict[coin as string] || null : null;

  const { t } = useTranslation()

  const [opened, setOpen] = useState(false);

  const moreToggle = () => {
    trackClick(['ViewMore', '1']);
    setOpen(!opened);
  };

  return (
    <div className={styles.wrapper}>
      {!(isUnsale || isTemporary) && <PriceAnalysis />}
      <NewBet />
      <section>
        <header>
          <Title
            data-ssg="coin-info-title"
            title={t('3hPSxoF5iF6p9m12oNqy8k', {
              coinName: `${coinObj?.name || coin}(${coinObj?.currencyName || coin})`,
            })}
          />
        </header>
        <div className={styles.rowWrapper}>
          <RankInfo />
          <MoreBtn onClick={moreToggle} reverse={opened} />
        </div>
        <div className={clsx(styles.moreCont, {
          [styles.hidden]: !opened,
        })}
        style={{
          borderColor: fade('#1d1d1d', 0.08),
          backgroundColor: fade('#1d1d1d', 0.02),
        }}
        >
          <SocialInfo data-ssg="social-info" />
        </div>
        <div className={styles.priceWrapper}>
          <HighAndLowPrice data-ssg="price-range" />
          <div className={styles.dividerWrapper}>
            <hr />
          </div>
          <div className={styles.infoWrapper}>
            <PriceInfo data-ssg="price-info" />
          </div>
        </div>
      </section>
    </div>
  );
};