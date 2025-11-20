/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import { useLang } from '../../../hookTool';
import MarketRow from '../../../components/TradeList/List/Row';
import { defaultLimitNumber, pushHistory } from '../config';
import { Wrapper, Title, GetMore } from './styled';
import { getSymbolTick } from '../../service';
import { kcsensorsClick, kcsensorsManualTrack } from '../../../common/tools';

export default (props) => {
  const { data, additional, inDrawer, lang } = props;
  const [preLimitNumber, setPreLimitNumber] = useState(0);
  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const [withPriceList, setWithPriceList] = useState([]);

  const { t } = useLang();
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
    (e) => {
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
    [limitNumber, withPriceList],
  );

  const packUp = useCallback((e) => {
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

  const queryMarketsRecord = useCallback((list) => {
    if (!list?.length) return;
    getSymbolTick({
      params: list.map((item) => item.resourceId).join(','),
    }).then((res) => {
      const { data: _data, success } = res;
      if (success && _data) {
        setWithPriceList((originArr) => {
          return originArr.map((item) => {
            const findItem = _data.find((i) => i.symbol === item.resourceId);
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
      <Wrapper>
        <Title inDrawer={inDrawer}>
          <span>{t('a4GmcWPFxK54BdMJohjMrJ')}</span>
        </Title>
        {withPriceList.map((item, index) => {
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
              />
            );
          }
          return null;
        })}
        {withPriceList.length > 3 ? (
          limitNumber < withPriceList.length ? (
            <GetMore onMouseDown={changeNumber} inDrawer={inDrawer}>
              <span>{`${t('iNZfQgokqiKoTmHFou5dyi')}(${withPriceList.length - limitNumber})`}</span>
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
