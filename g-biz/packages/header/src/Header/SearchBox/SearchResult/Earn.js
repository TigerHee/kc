/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import { map, forEach, round } from 'lodash';
import { styled } from '@kux/mui';
import { toPercent } from '@utils/math';
import { useLang } from '../../../hookTool';
import CoinIcon from '../../../components/CoinIcon';
import { defaultLimitNumber, pushHistory, getEarnUrl } from '../config';
import { Wrapper, Title, GetMore } from './styled';
import siteConfig from '../../siteConfig';
import { kcsensorsClick, kcsensorsManualTrack, addLangToPath } from '../../../common/tools';

const Item = styled.a`
  width: 100%;
  height: 60px;
  padding: ${(props) => (props.inDrawer ? '12px 0' : '12px 12px')};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  &:last-of-type {
    margin-bottom: 0;
  }
  :hover {
    background: ${(props) => props.theme.colors.cover2};
  }
`;
const EarnTitle = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

const NameWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
`;
const ItemTitle = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const TypeName = styled.span`
  font-weight: 400;
  font-size: 12px;
  margin-top: 2px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
`;
const RateWrapper = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 2px;
`;

const Tip = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;

export default (props) => {
  const { data, additional, inDrawer, lang } = props;
  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const { t } = useLang();
  const { POOLX_HOST, KUCOIN_HOST } = siteConfig;

  const clickAdditional = useCallback((val, _clickAdditional) => {
    const { id, invertCurrency, productCategory, name, productCategoryItemStr, webJumpUrl } = val;
    const data = {
      type: 'EARN',
      productId: id,
      invertCurrency,
      lendingCurrency: name,
      productCategory,
      showName: `${name} - ${productCategoryItemStr}`,
      webJumpUrl,
    };
    pushHistory(data);
    kcsensorsClick(['NavigationSearchTopSearch', '1'], _clickAdditional);
  }, []);

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
    if (data && data.length > 0) {
      forEach(data, (item) => {
        kcsensorsManualTrack(['NavigationSearchResult', '1'], {
          postType: 'earn',
          postId: item.resourceId,
          trade_pair: item.resourceId,
          groupId: additional.searchSessionId,
          contentItem: additional.searchWords,
          pagecate: 'NavigationSearchResult',
        });
      });
    }
    if (data && data.length > 3) {
      kcsensorsManualTrack(['NavigationSearchMoreButton', '1'], {
        postType: 'earn',
        groupId: additional.searchSessionId,
        contentItem: additional.searchWords,
        pagecate: 'NavigationSearchMoreButton',
      });
    }
  }, [additional, data]);

  if (data && data.length > 0) {
    return (
      <Wrapper>
        <Title inDrawer={inDrawer}>
          <span>{t('ojYrMzQofE5RtTPXmyRi2u')}</span>
        </Title>
        {map(data, (item, index) => {
          const { resourceExtend } = item;
          const {
            name,
            prt,
            maxPrt,
            minPrt,
            icon,
            id,
            invertCurrency,
            productCategory,
            productCategoryItemStr,
            webJumpUrl,
          } = resourceExtend;
          let prtStr = prt ? `${toPercent(round(Number(prt / 100), 4), lang)}` : '--';
          // minPrt或者maxPrt同时存在，则展示范围
          if (minPrt && maxPrt) {
            prtStr = `${toPercent(round(Number(minPrt / 100), 4), lang)} - ${toPercent(
              round(Number(maxPrt / 100), 4),
              lang,
            )}`;
          }
          // id, invertCurrency
          if (index < limitNumber) {
            const _clickAdditional = {
              postType: 'earn',
              postId: item.resourceId,
              trade_pair: item.resourceId,
              groupId: additional.searchSessionId,
              contentItem: additional.searchWords,
              pagecate: 'NavigationSearchResult',
            };
            const url = addLangToPath(getEarnUrl({ webJumpUrl, productCategory }), lang);
            return (
              <Item
                key={item.id}
                href={url}
                onClick={() => clickAdditional(resourceExtend, _clickAdditional)}
                inDrawer={inDrawer}
              >
                <EarnTitle>
                  <CoinIcon coin={item.onvertCurrency} icon={icon} />
                  <NameWrapper>
                    <ItemTitle>{name}</ItemTitle>
                    <TypeName>{productCategoryItemStr}</TypeName>
                  </NameWrapper>
                </EarnTitle>
                <ContentWrapper>
                  <RateWrapper> {prtStr}</RateWrapper>
                  <Tip>{t('8HU9JHaf5vQXV2by9jScTd')}</Tip>
                </ContentWrapper>
              </Item>
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
