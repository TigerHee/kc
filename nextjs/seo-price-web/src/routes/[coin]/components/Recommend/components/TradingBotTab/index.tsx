/**
 * Owner: will.wang@kupotech.com
 */
import styles from './style.module.scss';
import { useCoinDetailStore } from '@/store/coinDetail';
import TradingItem from './TradingItem';
import useTranslation from '@/hooks/useTranslation';
import { getSiteConfig } from 'kc-next/boot';

const TradingBotTab = () => {
  const siteConfig = getSiteConfig();
  const { _t } = useTranslation();
  const contractGrid = useCoinDetailStore(
    (state) => state.coinInfo.currencyReferenceRecommend?.contractGrid,
  );
  const spotGrid = useCoinDetailStore(
  (state) => state.coinInfo.currencyReferenceRecommend?.spotGrid,
  );

  return (
    <ul className={styles.wrapper}>
      {spotGrid && (
        <li>
          <TradingItem
            type="spot"
            info={spotGrid}
            title={_t('gqfnfruHXpMqpaRXTbbrR3')}
            subTitle={_t('hkjGUkJooJ4Ftf55z8eGeh')}
            link={`${siteConfig.KUCOIN_HOST}/trade/strategy/spotgrid/`}
          />
        </li>
      )}
      {contractGrid && (
        <li>
          <TradingItem
            type="contract"
            info={contractGrid}
            title={_t('6GHorAKCdvwaALWmMvFZ5C')}
            subTitle={_t('sQYx9bbPyrFBq76BrrEE3p')}
            link={`${siteConfig.KUCOIN_HOST}/trade/strategy/futuresgrid/`}
          />
        </li>
      )}
    </ul>
  );
};

export default TradingBotTab;