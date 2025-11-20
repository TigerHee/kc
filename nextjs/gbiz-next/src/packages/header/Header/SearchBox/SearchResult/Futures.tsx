/**
 * Owner: roger@kupotech.com
 */
import React, { useState, useCallback, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@kux/iconpack';
import { map } from 'lodash-es';
import { getFuturesMarketList } from '../../service';
import { useTranslation } from 'tools/i18n';
import MarketRow from '../../../components/TradeList/List/Row';
import { defaultLimitNumber, pushHistory } from '../config';
import { kcsensorsClick, kcsensorsManualTrack } from '../../../common/tools';
import { useHeaderStore } from '../../model';
import styles from './styles.module.scss';
import { useCompliantShow } from 'packages/compliantCenter';
import { SEARCH_FUTURE_ENTRANCE_FUTURE_SPM } from '../../config';

export default props => {
  const { data, additional, inDrawer, lang } = props;
  const futuresSymbols = useHeaderStore(state => state.futuresSymbols) || [];
  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const [withPriceList, setWithPriceList] = useState([]);

  const { t } = useTranslation('header');
  const changeNumber = useCallback(
    e => {
      // 总数量
      const totalNumber = data.length;
      // 剩余适量
      const remainNumber = totalNumber - limitNumber;
      let targetNumber = limitNumber;
      if (remainNumber > 15) {
        targetNumber += 10;
      } else {
        targetNumber += remainNumber;
      }
      setLimitNumber(targetNumber);
      e.preventDefault();
      return false;
    },
    [limitNumber, data]
  );

  const packUp = useCallback(e => {
    setLimitNumber(defaultLimitNumber);
    e.preventDefault();
    return false;
  }, []);

  const queryMarketsRecord = useCallback(() => {
    getFuturesMarketList()
      .then(res => {
        const { data: _data, success } = res;
        if (success) {
          // 合并行情详情
          const allFuturesSymbols = map(futuresSymbols, _symbol => {
            const item = _data.find(i => i.symbol === _symbol.symbol) || {};
            const { lastPrice, priceChgPct } = item;
            return {
              ..._symbol,
              ...item,
              changeRate: priceChgPct,
              lastTradedPrice: lastPrice,
            };
          });
          setWithPriceList(allFuturesSymbols);
        }
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    queryMarketsRecord();
  }, [data, queryMarketsRecord]);

  const clickAdditional = useCallback((symbol, _clickAdditional, contract) => {
    const data = {
      type: 'FUTURES',
      symbol,
      showName: symbol,
      contract,
    };
    pushHistory(data);
    kcsensorsClick(['NavigationSearchTopSearch', '1'], _clickAdditional);
  }, []);

  useEffect(() => {
    if (data && data.length > 3) {
      kcsensorsManualTrack(['NavigationSearchMoreButton', '1'], {
        postType: 'futures',
        groupId: additional.searchSessionId,
        contentItem: additional.searchWords,
        pagecate: 'NavigationSearchMoreButton',
      });
    }
  }, [additional, data]);

  // 使用spmid判断(如英国ip隐藏合约搜索结果)
  const showSearchFuture = useCompliantShow(SEARCH_FUTURE_ENTRANCE_FUTURE_SPM);

  if (data && data.length > 0 && showSearchFuture) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.title} style={{ padding: inDrawer ? '0px' : '0 12px' }}>
          <span>{t('3HsgsszURbkGDMWWEGUHZk')}</span>
        </div>
        {map(data, (item, index) => {
          const icon = item?.resourceExtend?.icon;
          const { lastPrice, priceChgPct, symbol, ...rest } =
            withPriceList.find((i: any) => i.symbol === item.resourceId) || ({} as any);
          if (index < limitNumber) {
            const _clickAdditional = {
              postType: 'futures',
              postId: item.resourceId,
              trade_pair: item.resourceId,
              groupId: additional.searchSessionId,
              contentItem: additional.searchWords,
              pagecate: 'NavigationSearchResult',
            };
            return (
              <MarketRow
                key={item.resourceId}
                record={{
                  ...rest,
                  changeRate: priceChgPct,
                  lastTradedPrice: lastPrice,
                  symbol: item.resourceId,
                }}
                tradeType="FUTURES_USDT"
                style={{ padding: inDrawer ? '0px' : '0 12px', borderRadius: 8 }}
                clickAdditional={() => clickAdditional(symbol, _clickAdditional, { symbol, ...rest })}
                additional={_clickAdditional}
                icon={icon}
                lang={lang}
                inDrawer={inDrawer}
              />
            );
          }
          return null;
        })}
        {data.length > 3 ? (
          limitNumber < data.length ? (
            <div
              className={styles.getMore}
              style={{ padding: inDrawer ? '8px 0px 0px' : '8px 12px 0px' }}
              onMouseDown={changeNumber}
            >
              <span>{`${t('iNZfQgokqiKoTmHFou5dyi')}(${data.length - limitNumber})`}</span>
              <ArrowDownIcon size={16} />
            </div>
          ) : (
            <div
              className={styles.getMore}
              style={{ padding: inDrawer ? '8px 0px 0px' : '8px 12px 0px' }}
              onMouseDown={packUp}
            >
              <span>{t('1UHjkjvY81upkuviX1m189')}</span>
              <ArrowUpIcon size={16} />
            </div>
          )
        ) : null}
      </div>
    );
  }
  return null;
};
