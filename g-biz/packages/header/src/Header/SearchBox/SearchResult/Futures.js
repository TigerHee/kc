/**
 * Owner: roger@kupotech.com
 */
import React, { useState, useCallback, useEffect } from 'react';
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import { map } from 'lodash';
import { useSelector } from 'react-redux';
import { useCompliantShow } from '@packages/compliantCenter';
import { getFuturesMarketList } from '../../service';
import { useLang } from '../../../hookTool';
import MarketRow from '../../../components/TradeList/List/Row';
import { defaultLimitNumber, pushHistory } from '../config';
import { Wrapper, Title, GetMore } from './styled';
import { namespace } from '../../model';
import { kcsensorsClick, kcsensorsManualTrack } from '../../../common/tools';
import { SEARCH_FUTURE_ENTRANCE_FUTURE_SPM } from '../../config';

export default (props) => {
  const { data, additional, inDrawer, lang } = props;
  const { futuresSymbols } = useSelector((state) => state[namespace] || {});
  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const [withPriceList, setWithPriceList] = useState([]);

  const { t } = useLang();
  const changeNumber = useCallback(
    (e) => {
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
    [limitNumber, data],
  );

  const packUp = useCallback((e) => {
    setLimitNumber(defaultLimitNumber);
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    queryMarketsRecord();
  }, [data, queryMarketsRecord]);

  const queryMarketsRecord = useCallback(() => {
    getFuturesMarketList()
      .then((res) => {
        const { data: _data, success } = res;
        if (success) {
          // 合并行情详情
          const allFuturesSymbols = map(futuresSymbols, (_symbol) => {
            const item = _data.find((i) => i.symbol === _symbol.symbol) || {};
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
      <Wrapper>
        <Title inDrawer={inDrawer}>
          <span>{t('3HsgsszURbkGDMWWEGUHZk')}</span>
        </Title>
        {map(data, (item, index) => {
          const icon = item?.resourceExtend?.icon;
          const { lastPrice, priceChgPct, symbol, ...rest } =
            withPriceList.find((i) => i.symbol === item.resourceId) || {};
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
                clickAdditional={() =>
                  clickAdditional(symbol, _clickAdditional, { symbol, ...rest })
                }
                additional={_clickAdditional}
                icon={icon}
                lang={lang}
              />
            );
          }
          return null;
        })}
        {data.length > 3 ? (
          limitNumber < data.length ? (
            <GetMore onMouseDown={changeNumber} inDrawer={inDrawer}>
              <span>{`${t('iNZfQgokqiKoTmHFou5dyi')}(${data.length - limitNumber})`}</span>
              <ICArrowDownOutlined />
            </GetMore>
          ) : (
            <GetMore onMouseDown={packUp} inDrawer={inDrawer}>
              <span>{t('1UHjkjvY81upkuviX1m189')}</span>
              <ICArrowUpOutlined />
            </GetMore>
          )
        ) : null}
      </Wrapper>
    );
  }
  return null;
};
