/**
 * Owner: kevyn.yu@kupotech.com
 */
// import { fade } from '@kux/mui/utils/colorManipulator.js';
import useScreen from 'src/hooks/useScreen';
// import { ReactComponent as EllipsisIcon } from '@/assets/coinDetail/ellipsis.svg';
// import { ReactComponent as BgIcon } from '@/assets/coinDetail/fastbuy-background-icon.svg';
// import { ReactComponent as AmexIcon } from '@/assets/coinDetail/payment-amex.svg';
// import { ReactComponent as MasterIcon } from '@/assets/coinDetail/payment-master.svg';
// import { ReactComponent as VisaIcon } from '@/assets/coinDetail/payment-visa.svg';
// import { ReactComponent as SwitchIcon } from '@/assets/coinDetail/switch-icon.svg';
// import { ReactComponent as RightArrowIcon } from '@/assets/markets/right-arrow.svg';
import EllipsisIcon from '@/assets/coinDetail/ellipsis.svg';
import BgIcon from '@/assets/coinDetail/fastbuy-background-icon.svg';
import AmexIcon from '@/assets/coinDetail/payment-amex.svg';
import MasterIcon from '@/assets/coinDetail/payment-master.svg';
import VisaIcon from '@/assets/coinDetail/payment-visa.svg';
import SwitchIcon from '@/assets/coinDetail/switch-icon.svg';
import RightArrowIcon from '@/assets/markets/right-arrow.svg';
import styles from './style.module.scss';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import { useMarketStore } from '@/store/market';
import { useCurrencyStore } from '@/store/currency';
import { addLangToPath } from '@/tools/i18n';
import { saTrackForBiz } from '@/tools/ga';
import useTranslation from '@/hooks/useTranslation';
import { bootConfig, getSiteConfig } from 'kc-next/boot';


const Coin = ({ coin = '' }) => {
  const coinInfo = useCategoriesStore((state) => state.coinDict[coin] ?? null);
  return (
    <div className={styles.coinWrapper}>
      <img src={coinInfo?.iconUrl || ''} alt={coin} />
      {coin}
    </div>
  );
};

const FastBuyTab = () => {
  const siteConfig = getSiteConfig();
  const router = useRouter();
  const coin = router?.query?.coin;
  const { _t } = useTranslation();
  const { isH5 } = useScreen();
  const currency = useCurrencyStore((state) => state.currency);
  const expressUrl = addLangToPath(
    `${siteConfig.KUCOIN_HOST}/express?base=${currency}&target=${coin}`,
  );
  const handleClick = (e) => {
    e.preventDefault();
    saTrackForBiz({}, ['RecommendModular', '5'], {
      symbol: coin,
    });
    if (typeof window !== 'undefined') {
      const newWindow = window.open(expressUrl, isH5 ? '_self' : '_blank');
      newWindow && (newWindow.opener = null);
    }
  };
  const hrefProp: any = {};
  if (siteConfig.KUCOIN_HOST && currency && coin) {
    hrefProp.href = expressUrl;
  }

  return (
    <a className={styles.wrapper} onClick={handleClick} {...hrefProp}>
      <img src={BgIcon} className={styles.styledBgIcon} />
      <div className={styles.innerWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>
              <Coin coin={bootConfig._BASE_CURRENCY_} />
              <img src={SwitchIcon} />
              {
                coin && (
                  <Coin coin={coin as string} />
                )
              }
              <img src={RightArrowIcon} className={styles.styledRightArrowIcon} />
            </h3>
            <p className={styles.subTitle}>{_t('oZTKkeMiRk558ea3hkt35u')}</p>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <p className={styles.dataRow}>
            <span>{_t('8hXY6XKquoYitYJhBzW19G')}</span>
            <img src={VisaIcon} />
            <img src={MasterIcon} />
            <img src={AmexIcon} />
            <img src={EllipsisIcon} />
          </p>
        </div>
      </div>
    </a>
  );
};

export default FastBuyTab;