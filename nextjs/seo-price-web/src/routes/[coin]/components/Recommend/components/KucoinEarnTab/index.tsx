/**
 * Owner: kevyn.yu@kupotech.com
 */
import useScreen from 'src/hooks/useScreen';
import ChangeRate from 'src/components/common/ChangeRate';
// import { ReactComponent as BgIcon } from '@/assets/coinDetail/earn-background-icon.svg';
// import { ReactComponent as RightArrowIcon } from '@/assets/markets/right-arrow.svg';
import BgIcon from '@/assets/coinDetail/earn-background-icon.svg';
import RightArrowIcon from '@/assets/markets/right-arrow.svg';
import styles from './index.module.scss';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import { useCoinDetailStore } from '@/store/coinDetail';
import { addLangToPath } from '@/tools/i18n';
import { saTrackForBiz } from '@/tools/ga';
import useTranslation from '@/hooks/useTranslation';
import { getSiteConfig } from 'kc-next/boot';

const KucoinEarnTab = () => {
  const siteConfig = getSiteConfig();
  const router = useRouter();
  const coin = router?.query?.coin;
  const { isH5 } = useScreen();
  const { _t } = useTranslation();
  const coinInfo = useCategoriesStore((state) => coin ? state.coinDict[coin as string] : null);
  const info = useCoinDetailStore(
    (state) => state.coinInfo.currencyReferenceRecommend?.poolStakingProducts || null,
  );

  const earnUrl = addLangToPath(`${siteConfig.KUCOIN_HOST}/earn?currency=${coin}`);
  const handleClick = (e) => {
    e.preventDefault();
    saTrackForBiz({}, ['RecommendModular', '4'], {
      symbol: coin,
    });
    if (typeof window !== 'undefined') {
      const newWindow = window.open(earnUrl, isH5 ? '_self' : '_blank');
      newWindow && (newWindow.opener = null);
    }
  };

  const hrefProp: any = {};
  if (siteConfig.KUCOIN_HOST && coin) {
    hrefProp.href = earnUrl;
  }

  return (
    <div className={styles.wrapper}>
      <a onClick={handleClick} {...hrefProp}>
        <img src={BgIcon} className={styles.styledBgIcon} />
      </a>
      <div className={styles.innerWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>
              {coin}
              <span>&nbsp;/</span>
              <span>{coinInfo?.name || coin}</span>
              <img src={RightArrowIcon} className={styles.styledRightArrowIcon} />
            </h3>
            {!!info?.products?.length && <p className={styles.payment}>{info?.products.join(' | ')}</p>}
            <small className={styles.subTitle}>{_t('shW1jYDXqp6ihVfnRoQmUj')}</small>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <p className={styles.dataRow}>
            <span>{_t('eUTdQoUn6eZwExoNWCjtJi')}</span>
            <ChangeRate value={Number(info?.todayTopProfitRateYear ?? 0) / 100} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default KucoinEarnTab;