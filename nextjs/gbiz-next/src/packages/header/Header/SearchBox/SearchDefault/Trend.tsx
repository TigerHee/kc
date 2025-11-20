/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { map } from 'lodash-es';
import clsx from 'clsx';
import PriceRate from './PriceRate';
import SymbolCodeToName from '../../../components/SymbolCodeToName';
import { kcsensorsManualTrack, kcsensorsClick } from '../../../common/tools';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath'
import styles from './styles.module.scss';

const TRADE_PATH = '/trade';

export default props => {
  const { data, inDrawer, lang } = props;
  const { t } = useTranslation('header');

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearchTopSearch', '1'], {
      pagecate: 'NavigationSearchTopSearch',
    });
  }, []);

  const markHistory = useCallback(index => {
    kcsensorsClick(['NavigationSearchTopSearch', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchTopSearch',
    });
  }, []);
  if (data && data.spot && data.spot.length > 0) {
    return (
      <div className={styles.wrapper}>
        <div className={clsx(styles.title, inDrawer && styles.titleInDrawer)}>
          <span>{t('wkrjMts2VZUjxjFKvh6BXJ')}</span>
        </div>
        {inDrawer ? (
          <div className={styles.h5Content}>
            {map(data.spot, (item, index) => {
              const url = addLangToPath(`${TRADE_PATH}/${item.symbol}`);
              if (index < 3) {
                return (
                  <a key={item.symbol} href={url} className={styles.h5SymbolItem} onClick={() => markHistory(index)}>
                    <div className={styles.trendCodeName}>
                      <SymbolCodeToName code={item.symbol} noIcon />
                    </div>
                    <PriceRate rate={item.changeRate} price={item.price} lang={lang} inDrawer />
                  </a>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className={styles.content}>
            {map(data.spot, (item, index) => {
              const url = addLangToPath(`${TRADE_PATH}/${item.symbol}`);
              if (index < 3) {
                return (
                  <a key={item.symbol} href={url} className={styles.symbolItem} onClick={() => markHistory(index)}>
                    <div className={styles.trendCodeName}>
                      <SymbolCodeToName code={item.symbol} noIcon />
                    </div>
                    <PriceRate rate={item.changeRate} price={item.price} lang={lang} />
                  </a>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  }
  return null;
};
