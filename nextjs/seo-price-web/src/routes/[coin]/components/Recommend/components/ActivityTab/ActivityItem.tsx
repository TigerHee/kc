import moment from 'moment';
import useScreen from 'src/hooks/useScreen';
// import { ReactComponent as BgIcon } from '@/assets/coinDetail/activity-background-icon.svg';
// import { ReactComponent as RightArrowIcon } from '@/assets/markets/right-arrow.svg';
import BgIcon from '@/assets/coinDetail/activity-background-icon.svg';
import RightArrowIcon from '@/assets/markets/right-arrow.svg';
import styles from './activeItem.module.scss';
import { useRouter } from 'kc-next/compat/router';
import { addLangToPath } from '@/tools/i18n';
import { saTrackForBiz } from '@/tools/ga';
import useTranslation from '@/hooks/useTranslation';
import { readableNumber } from '@/tools/formatNumber';
import { bootConfig } from 'kc-next/boot';

const ActivityItem = ({ info }) => {
  const router = useRouter();
  const coin = router?.query?.coin;
  const { isH5 } = useScreen();
  const { _t } = useTranslation();

  const landUrl = addLangToPath(`/land/KuRewards/detail?id=${info.id}`);
  const handleClick = (e) => {
    e.preventDefault();
    if (info.link) {
      saTrackForBiz({}, ['RecommendModular', '1'], {
        symbol: coin,
      });

      if (typeof window !== 'undefined') {
        const newWindow = window.open(landUrl, isH5 ? '_self' : '_blank');
        if (newWindow) {
          newWindow.opener = null; 
        }
      }
    }
  };

  const renderTime = () => {
    return (
      moment(info.startTime).format('YYYY/MM/DD') +
      ' - ' +
      moment(info.endTime).format('YYYY/MM/DD')
    );
  };

  const hrefProp: any = {};
  if (info.id) {
    hrefProp.href = landUrl;
  }

  return (
    <a className={styles.wrapper} onClick={handleClick} {...hrefProp}>
      <img src={BgIcon} className={styles.styledBgIcon} />
      <div className={styles.innerWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>
              <span>{info.title}</span>
              <img src={RightArrowIcon} className={styles.styledRightArrowIcon} />
            </h2>
            <h3 className={styles.subTitle}>{info.subtitle}</h3>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.dataRow}>
            <span>{_t('oCAWiBZe72wi9e11zWQ6G5')}</span>
            <span className={styles.price}>
              +{info.totalAmount} {bootConfig._BASE_CURRENCY_}
            </span>
          </div>
          <div className={styles.dataRow}>
            <span>{_t('vqzV9b54girPTuAuX6TuBK')}</span>
            <span>{readableNumber(info.signUpNum)}</span>
          </div>
          <div className={styles.dataRow}>
            <span>{_t('3UCZa2iQ3pGrgy4SCGCSsC')}</span>
            <span>{renderTime()}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ActivityItem;