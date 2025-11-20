/**
 * Owner: kevyn.yu@kupotech.com
 */
import { NumberFormat, styled, Tooltip } from '@kux/mui-next';
// import CoinCodeToName from 'src/components/common/CoinCodeToName';
import useScreen from 'src/hooks/useScreen';

// import { SYMBOL_TYPE } from 'src/routes/PricePage/config';
// import { ReactComponent as BgIcon } from '@/assets/coinDetail/trading-background-icon.svg';
// import { ReactComponent as RightArrowIcon } from '@/assets/markets/right-arrow.svg';
import BgIcon from '@/assets/coinDetail/trading-background-icon.svg';
import RightArrowIcon from '@/assets/markets/right-arrow.svg';
import contract from '@/assets/price/contract.svg';
import spot from '@/assets/price/spot.svg';

import styles from './tradingItem.module.scss'
import { useCoinDetailStore } from '@/store/coinDetail';
import { useLang } from 'gbiz-next/hooks';
import { useMarketStore } from '@/store/market';
import ChangeRate from '@/components/common/ChangeRate';
import clsx from 'clsx';
import CoinCodeToName from '@/components/common/CoinCodeToName';
import { SYMBOL_TYPE } from '@/config/kline';
import { saTrackForBiz } from '@/tools/ga';
import { addLangToPath } from '@/tools/i18n';
import useTranslation from '@/hooks/useTranslation';
import { bootConfig } from 'kc-next/boot';
import { getPerpFutureName } from '@/tools/helper';


const Symbol = ({ symbol }) => {
  const tradeData = useCoinDetailStore((state) => state.tradeData);
  const { _t } = useTranslation();
  const { currentLang } = useLang();
  const symbolInfo = useCoinDetailStore(
    (state) => state.tradingPairs?.find((item) => item.symbol === symbol),
  );
  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);
  const { price, baseCurrency, quoteCurrency } = symbolInfo || {};
  const currency = baseCurrency === 'XBT' ? 'BTC' : baseCurrency;
  const currentPrice = Number(tradeData[symbol]?.price || 0);
  const precision = symbolsInfoMap[symbol]?.precision || 2;
  const showPrice = currentPrice || price;
  const isFuture = symbolInfo?.category?.includes(SYMBOL_TYPE.FUTURE);

  return (
    <div className={styles.symbolWrapper}>
      <span className="title">
        {!isFuture && (
          <>
            <CoinCodeToName coin={currency} />
            <span>{'/'}</span>
            <CoinCodeToName coin={quoteCurrency} />
          </>
        )}
        {isFuture && getPerpFutureName({ symbol: currency, currency: quoteCurrency, tI18n: _t })}
      </span>
      <span className={styles.price}>
        {showPrice && (
          <NumberFormat
            options={{
              minimumFractionDigits: precision,
              maximumFractionDigits: precision,
            }}
            lang={currentLang}
          >
            {showPrice}
          </NumberFormat>
        )}
      </span>
      <ChangeRate
        value={tradeData[symbol]?.priceChangeRate24h}
        className={clsx(styles.extendedChangeRate, {
          [styles.negtive]: Number(tradeData[symbol]?.priceChangeRate24h || 0) <= 0,
        })}
      />
    </div>
  );
};

const TradingItem = ({ title, subTitle, info, link, type }) => {
  const { _t } = useTranslation();
  const { isH5 } = useScreen();
  const handleClick = (e) => {
    e.preventDefault();
    if (link) {
      saTrackForBiz({}, ['RecommendModular', type === 'spot' ? '2' : '3'], {
        symbol: info?.symbol,
      });
      if (typeof window !== 'undefined') {
        const newWindow = window.open(
          addLangToPath(`${link}${info.symbol}`),
          isH5 ? '_self' : '_blank',
        );
        newWindow && (newWindow.opener = null);
      }
    }
  };

  const hrefProp: any = {};
  if (link && info.symbol) {
    hrefProp.href = addLangToPath(`${link}${info.symbol}`);
  }

  return (
    <a className={styles.wrapper} onClick={handleClick} {...hrefProp}>
      <img src={BgIcon} className={styles.styledBgIcon} />
      <div className={styles.innerWrapper}>
        <div className={styles.headerWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>
              <h3 className={styles.gridLabel}>
                <img src={type ? spot : contract} alt="icon" />
                {title}
                <img src={RightArrowIcon} className={styles.styledRightArrowIcon} />
              </h3>
              <Symbol symbol={info.symbol} />
            </div>
            <p className={styles.subTitle}>{subTitle}</p>
          </div>
        </div>
        <div className={styles.bottomWrapper}>
          <dl className={styles.yearRate}>
            <dt>{_t('aMxwEX7RFqmj9KWbiJKgDw')}</dt>
            <dd>
              <ChangeRate value={info.todayTopProfitRateYear / 100} />
            </dd>
          </dl>
          <div className={styles.contentWrapper}>
            <dl className={styles.dataRow}>
              <dt>
                <Tooltip title={_t('prWQBLTuFaLgKNp4j6nHuB')} placement="top">
                  <span style={{ textDecoration: 'underline', textDecorationStyle: 'dashed' }}>
                    {_t('hF8S52nLGywgE9u3Sitagu')}
                  </span>
                </Tooltip>
              </dt>
              <dd>{info.minAmount} {bootConfig._BASE_CURRENCY_}</dd>
            </dl>
            {info.maxLeverage && (
              <dl className={styles.dataRow}>
                <dt>{_t('sW4PWNcY6F1Y2xWktFA1Zy')}</dt>
                <dd>{info.maxLeverage}X</dd>
              </dl>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default TradingItem;