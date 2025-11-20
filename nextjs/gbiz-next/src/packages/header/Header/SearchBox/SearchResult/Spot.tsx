/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@kux/iconpack';
import { useTranslation } from 'tools/i18n';
import MarketRow from '../../../components/TradeList/List/Row';
import { defaultLimitNumber, pushHistory } from '../config';
import { getSymbolTick } from '../../service';
import { kcsensorsClick, kcsensorsManualTrack } from '../../../common/tools';
import styles from './styles.module.scss';

export default props => {
  const { data, additional, inDrawer, lang } = props;
  const [preLimitNumber, setPreLimitNumber] = useState(0);
  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const [withPriceList, setWithPriceList] = useState([]);

  const { t } = useTranslation('header');
  const clickAdditional = useCallback((val, _clickAdditional) => {
    const symbol = val.resourceId;
    const data = {
      type: 'SPOT',
      symbol,
      showName: symbol,
    };
    pushHistory(data);
    kcsensorsClick(['NavigationSearchTopSearch', '1'], _clickAdditional);
  }, []);

  const changeNumber = useCallback(
    e => {
      // 总数量
      const totalNumber = withPriceList.length;
      // 剩余适量
      const remainNumber = totalNumber - limitNumber;
      let targetNumber = limitNumber;
      if (remainNumber > 15) {
        targetNumber += 10;
      } else {
        targetNumber += remainNumber;
      }
      setPreLimitNumber(limitNumber);
      setLimitNumber(targetNumber);
      e.preventDefault();
      return false;
    },
    [limitNumber, withPriceList]
  );

  const packUp = useCallback(e => {
    setLimitNumber(defaultLimitNumber);
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    setWithPriceList(data);
  }, [data]);

  useEffect(() => {
    const reqList = data.filter((_, index) => index >= preLimitNumber && index < limitNumber);
    queryMarketsRecord(reqList);
  }, [data, preLimitNumber, limitNumber]);

  useEffect(() => {
    if (withPriceList && withPriceList.length > 3) {
      kcsensorsManualTrack(['NavigationSearchMoreButton', '1'], {
        postType: 'spot',
        groupId: additional.searchSessionId,
        contentItem: additional.searchWords,
        pagecate: 'NavigationSearchMoreButton',
      });
    }
  }, [additional, withPriceList]);

  const queryMarketsRecord = useCallback(list => {
    if (!list?.length) return;
    getSymbolTick({
      params: list.map(item => item.resourceId).join(','),
    }).then(res => {
      const { data: _data, success } = res;
      if (success && _data) {
        setWithPriceList((originArr: any) => {
          return originArr.map(item => {
            const findItem = _data.find(i => i.symbol === item.resourceId);
            if (findItem) {
              const { lastTradedPrice, changeRate } = findItem || {};
              return { ...item, lastTradedPrice, changeRate };
            }
            return item;
          });
        });
      }
    });
  }, []);

  if (withPriceList && withPriceList.length > 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.title} style={{ padding: inDrawer ? '0px' : '0 12px' }}>
          <span>{t('a4GmcWPFxK54BdMJohjMrJ')}</span>
        </div>
        {withPriceList.map((item: any, index) => {
          const icon = item?.resourceExtend?.icon;
          if (index < limitNumber) {
            const _clickAdditional = {
              postType: 'spot',
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
                  symbolCode: item.resourceId,
                  changeRate: item.changeRate,
                  lastTradedPrice: item.lastTradedPrice,
                  symbol: item.resourceId,
                }}
                sort={1}
                tradeType="SPOT"
                style={{ padding: inDrawer ? '0px' : '0 12px', borderRadius: 8 }}
                clickAdditional={() => clickAdditional(item, _clickAdditional)}
                additional={_clickAdditional}
                icon={icon}
                lang={lang}
                inDrawer={inDrawer}
              />
            );
          }
          return null;
        })}
        {withPriceList.length > 3 ? (
          limitNumber < withPriceList.length ? (
            <div
              className={styles.getMore}
              style={{ padding: inDrawer ? '8px 0px 0px' : '8px 12px 0px' }}
              onMouseDown={changeNumber}
            >
              <span>{`${t('iNZfQgokqiKoTmHFou5dyi')}(${withPriceList.length - limitNumber})`}</span>
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
