/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect, useCallback, useState } from 'react';
import round from 'lodash-es/round';
import { useTheme, NumberFormat } from '@kux/design';
import clsx from 'clsx';

import { toPercent } from 'tools/math';
import { useSiteConfig } from '../../siteConfig';
import { getSymbolTick } from '../../service';
import HotSearchBG from '../../../static/newHeader/hotSearchBG.png';
import { sub, divide, kcsensorsManualTrack, kcsensorsClick, formatLangNumber } from '../../../common/tools';
import CountDown from './countDown';
// import { pushHistory } from '../config';
import { useHeaderStore } from '../../model';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import styles from './styles.module.scss';
import { usePageProps } from 'provider/PageProvider';

const SymbolCodeToName = props => {
  const { code, divide = '/' } = props;
  const symbols = useHeaderStore(state => state.symbols) || [];
  const symbol: any = symbols.find((s: any) => s.code === code);
  const resultSymbol = symbol ? symbol.symbol.replace('-', divide) : code.replace('-', divide);
  const currencyArr = resultSymbol.split(divide);
  const baseCurrency = currencyArr[0];
  const quoteCurrency = currencyArr[1];
  const result = (
    <span className={styles.hotItemTitle}>
      {baseCurrency}
      <span>{`${divide}${quoteCurrency}`}</span>
    </span>
  );

  return result;
};
const TRADE_PATH = '/trade';

export default props => {
  const { data, lang, inDrawer } = props;
  const { t } = useTranslation('header');
  const [priceOrigin, setPrice] = useState<number>();
  const [rateOrigin, setRate] = useState<number>(0);
  // NEW_LISTING, NORMAL, PRE_NEW_LISTING
  const { KUCOIN_HOST } = useSiteConfig();
  const { openingPrice, spotTag, countdownTime, previewEnableShow, searchCount, symbol } = data || {};
  const theme = useTheme();
  let rate = rateOrigin;
  if (typeof rate !== 'number') {
    rate = +rate;
  }
  let rateColor = 'var(--kux-text40)';
  let prefix = '';
  if (rate > 0) {
    rateColor = '#01BC8D';
    prefix = '+';
  } else if (rate < 0) {
    rateColor = 'var(--kux-brandRed)';
  }
  const price = priceOrigin ? formatLangNumber(priceOrigin) : '--';
  const rateString = rate ? `${prefix}${toPercent(round(rate, 4), lang)}` : '--';

  let url = `${TRADE_PATH}/${symbol}`;
  if (previewEnableShow) {
    url = `${KUCOIN_HOST}/markets/new-cryptocurrencies`;
  }
  url = addLangToPath(url);

  const recommendSpot = useHeaderStore(state => state.recommendSpot);

  const CountDownFn = useCallback(() => {
    recommendSpot?.();
  }, []);

  const queryMarketsRecord = useCallback(_symbols => {
    if (!_symbols) {
      return;
    }
    getSymbolTick({
      params: _symbols,
    })
      .then(res => {
        const { data = [], success } = res;
        if (success && data) {
          const { lastTradedPrice, changeRate } = data[0];
          setPrice(lastTradedPrice);
          let _changeRate = changeRate;
          if (openingPrice) {
            _changeRate = divide(sub(lastTradedPrice, openingPrice), openingPrice, 2);
          }
          setRate(_changeRate);
        }
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (spotTag === 'NEW_LISTING' || spotTag === 'NORMAL') {
      queryMarketsRecord(symbol);
    }
    kcsensorsManualTrack(['NavigationSearchRealTopSearch', '1'], {
      trade_pair: symbol,
      contentType: spotTag,
      pagecate: 'NavigationSearchRealTopSearch',
    });
  }, [queryMarketsRecord, spotTag, symbol]);

  const markHistory = useCallback(() => {
    kcsensorsClick(['navigationFunction', '1'], {
      trade_pair: symbol,
      contentType: spotTag,
      pagecate: 'navigationFunction',
    });
  }, [spotTag, symbol]);

  const combo = () => {
    if (spotTag === 'NORMAL') {
      return (
        <div className={styles.hotContent}>
          <div className={styles.hotTitle}>
            <SymbolCodeToName code={symbol} />
            <span className={styles.priceContent}>
              {price}
              <span className={styles.hotRateWrapper} style={{ fontSize: '12px', color: rateColor }}>
                {rate ? rateString : ''}
              </span>
            </span>
          </div>
          <div
            className={styles.normalWrapper}
            style={{
              background: theme === 'light' ? 'var(--kux-textEmphasis)' : 'rgba(0, 13, 29, 0.4)',
            }}
          >
            <span className={styles.searchNumber}>
              <NumberFormat maximumFractionDigits={2} notation="compact">
                {searchCount}
              </NumberFormat>
            </span>
            <span className={styles.searchTips}>{t('vUJDZagB11KkRtGQiSMjFe')}</span>
          </div>
        </div>
      );
    }
    if (spotTag === 'NEW_LISTING') {
      return (
        <div className={styles.hotContent}>
          <div className={styles.hotTitle}>
            <div className={styles.newCoinTitle}>{t('p7pq9X5TZ95e2c9t5SRSF8')}</div>
            <SymbolCodeToName code={symbol} />
          </div>
          <div
            className={styles.newListingWrapper}
            style={{
              background: theme === 'light' ? 'var(--kux-textEmphasis)' : 'var(--kux-text40)',
            }}
          >
            <div className={styles.newListingItem}>
              <div className={styles.newListingNumber}>{price}</div>
              <div className={styles.newListingType}>{t('6LVSFEWEwbpFrsRsRmr3He')}</div>
            </div>
            <span className={styles.hotDivider} />
            <div className={styles.newListingItem}>
              <div className={styles.newListingNumber} style={{ color: rateColor }}>
                {rateString}
              </div>
              <div className={styles.newListingType}>{t('7nAZY172313GGycYAVm9g6')}</div>
            </div>
          </div>
        </div>
      );
    }
    if (spotTag === 'PRE_NEW_LISTING') {
      return (
        <div className={styles.hotContent}>
          <div className={styles.hotTitle}>
            <div className={styles.newCoinTitle}>{t('p7pq9X5TZ95e2c9t5SRSF8')}</div>
            <SymbolCodeToName code={symbol} />
          </div>
          {previewEnableShow ? (
            <div className={styles.preNewListingWrapper}>
              <CountDown initialSec={countdownTime} finishFn={CountDownFn} />
              <div className={styles.countDownText}>{t('jJHhubkQzfRPJfys8yA6MC')}</div>
            </div>
          ) : (
            <div className={styles.comingWrapper}>
              <div className={styles.coming}>{t('sMUjriV7ZakUsQWbw49gp7')}</div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };
  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.title, inDrawer && styles.titleInDrawer)}>
        <span>{t('wTcEtrkYPxY1uERe6hhYPY')}</span>
      </div>
      <a href={url} className={styles.hotContentWrapper} onClick={markHistory}>
        <img className={styles.contentBG} src={HotSearchBG} />
        {combo()}
      </a>
    </div>
  );
};
