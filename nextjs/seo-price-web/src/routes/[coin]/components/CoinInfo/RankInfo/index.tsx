/**
 * Owner: will.wang@kupotech.com
 */
import { useCoinDetailStore } from '@/store/coinDetail';
import Rank from '@/assets/price/rank.svg';
import Rating from '@/assets/price/rating.svg';
import styles from './style.module.scss'
import Tip from '@/components/common/Tip';
import useTranslation from '@/hooks/useTranslation';

export default () => {
  const { _t } = useTranslation();
  const coinInfo = useCoinDetailStore((state) => state.coinInfo);

  return (
    <div className={styles.wrapper}>
      <div className={styles.dataWrapper} style={{ backgroundColor: 'rgba(248, 178, 0, 0.08)' }} color="#F8B200">
        <Tip
          text={_t('6puhhABB7qMfm1z3mSMnwh')}
          spm={['currencyMoreInformation', '1']}
          sensorsData={{ position: 'Rank' }}
        >
          <img src={Rank} alt="alt" />
          <span>{_t('coin.detail.coin.info.rank.title')}</span>
          <span data-ssg="rank">{coinInfo.rank ? coinInfo.rank : '--'}</span>
        </Tip>
      </div>
      <div className={styles.dataWrapper} style={{ backgroundColor: 'rgba(1, 188, 141, 0.08)' }} color="#01BC8D">
        <Tip
          text={_t('quj8UJgbLEKGxfuXvZrfXd')}
          spm={['currencyMoreInformation', '1']}
          sensorsData={{ position: 'Rating' }}
        >
          <img src={Rating} alt="rate" />
          <span data-ssg="rating">{coinInfo.rating || '--'}</span>
        </Tip>
      </div>
    </div>
  );
};