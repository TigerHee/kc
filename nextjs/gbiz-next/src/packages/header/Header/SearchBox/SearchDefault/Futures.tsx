/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { map } from 'lodash-es';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath'
import PriceRate from './PriceRate';
import FutureSymbolText from '../../../components/FutureSymbolText';
import { kcsensorsManualTrack, kcsensorsClick } from '../../../common/tools';
import { useHeaderStore } from '../../model';
import { useTenantConfig } from '../../../tenantConfig';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { useCompliantShow } from 'packages/compliantCenter';
import { SEARCH_FUTURE_ENTRANCE_FUTURE_SPM } from '../../config';

export default props => {
  const { data, inDrawer, lang } = props;
  const { t } = useTranslation('header');
  const tenantConfig = useTenantConfig();
  const futuresSymbols = useHeaderStore(state => state.futuresSymbols) || [];

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearchTopFutures', '1'], {
      pagecate: 'NavigationSearchTopFutures',
    });
  }, []);

  const markHistory = useCallback(index => {
    kcsensorsClick(['NavigationSearchTopFutures', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchTopFutures',
    });
  }, []);

  // 使用spmid判断(如英国ip隐藏合约搜索结果)
  const showSearchFuture = useCompliantShow(SEARCH_FUTURE_ENTRANCE_FUTURE_SPM);

  if (data && data.feature && data.feature.length > 0 && showSearchFuture) {
    return (
      <div className={styles.wrapper}>
        <div className={clsx(styles.title, inDrawer && styles.titleInDrawer)}>
          <span>{t('5UnWKFvimpbzaE1UkugYLU')}</span>
        </div>
        {inDrawer ? (
          <div className={styles.h5Content}>
            {map(data.feature, (item, index) => {
              if (index < 3) {
                const url = addLangToPath(`${tenantConfig.KUMEX_TRADE}/${item.symbol}`);
                const { baseCurrency, type, settleDate, quoteCurrency } =
                  futuresSymbols.find((i: any) => i.symbol === item.symbol) || ({} as any);
                return (
                  <a
                    className={styles.h5SymbolItem}
                    key={item.symbol}
                    title={item.symbol}
                    href={url}
                    onClick={() => markHistory(index)}
                  >
                    <div className={styles.codeName}>
                      <FutureSymbolText
                        isTag
                        symbol={item.symbol}
                        contract={{
                          baseCurrency,
                          type,
                          settleDate,
                          quoteCurrency,
                        }}
                      />
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
            {map(data.feature, (item, index) => {
              if (index < 3) {
                const url = addLangToPath(`${tenantConfig.KUMEX_TRADE}/${item.symbol}`);
                const { baseCurrency, type, settleDate, quoteCurrency } =
                  futuresSymbols.find((i: any) => i.symbol === item.symbol) || ({} as any);
                return (
                  <a
                    className={styles.symbolItem}
                    key={item.symbol}
                    href={url}
                    title={item.symbol}
                    onClick={() => markHistory(index)}
                  >
                    <div className={styles.codeName}>
                      <FutureSymbolText
                        isTag
                        symbol={item.symbol}
                        contract={{
                          baseCurrency,
                          type,
                          settleDate,
                          quoteCurrency,
                        }}
                      />
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
