/*
 * @Owner: elliott.su@kupotech.com
 */

import React, { useCallback, useState, useEffect } from 'react';
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import { map, forEach, round } from 'lodash';
import { useTheme, styled } from '@kux/mui';
import { toPercent } from '@utils/math';
import { useLang } from '../../../hookTool';
import CoinIcon from '../../../components/CoinIcon';
import CoinTransferFold from '../../../components/CoinTransferFold';
import { defaultLimitNumber, pushHistory } from '../config';
import { Wrapper, Title, GetMore } from './styled';
import siteConfig from '../../siteConfig';
import {
  kcsensorsClick,
  kcsensorsManualTrack,
  shortenAddress,
  addLangToPath,
} from '../../../common/tools';

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
const Web3Title = styled.div`
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
const ItemTitleWrapper = styled.span`
  display: flex;
  align-items: center;
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
const Tag = styled.span`
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  background-color: ${(props) => props.theme.colors.cover4};
  margin-left: 4px;
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

const PriceWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  text-align: right;
`;

const RateWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.color};
  text-align: right;
`;
const Coins = styled.span`
  position: relative;
`;
const SmallCoinIcon = styled.img`
  width: 10px;
  height: 10px;
  margin: 0;
  position: absolute;
  left: 14px;
  bottom: 2px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.overlay};
`;
export default (props) => {
  const { data, additional, inDrawer, lang } = props;

  const [limitNumber, setLimitNumber] = useState(defaultLimitNumber);
  const { t } = useLang();
  const { KUCOIN_HOST } = siteConfig;
  const theme = useTheme();

  const clickAdditional = useCallback((val, _clickAdditional) => {
    const { name } = val;
    const data = {
      type: 'WEB3',
      showName: name,
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

  const percentNumber = useCallback(
    (value) => {
      if (typeof value !== 'number') {
        value = +value;
      }
      let color = theme.colors.text40;
      let prefix = '';
      if (value > 0) {
        color = theme.colors.primary;
        prefix = '+';
      } else if (value < 0) {
        color = theme.colors.secondary;
      }
      return {
        prefix,
        color,
      };
    },
    [theme],
  );

  useEffect(() => {
    if (data && data.length > 0) {
      forEach(data, (item) => {
        kcsensorsManualTrack(['NavigationSearchResult', '1'], {
          postType: 'web3',
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
        postType: 'web3',
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
          <span>Web3</span>
        </Title>
        {map(data, (item, index) => {
          const { resourceExtend } = item;
          const {
            chainName,
            token,
            name,
            price,
            priceChangePercent24H: prt,
            icon,
            chainIcon,
          } = resourceExtend;
          const url = addLangToPath(
            `${KUCOIN_HOST}/web3/swap?chain=${chainName}&address=${token}`,
            lang,
          );
          const { prefix, color } = percentNumber(prt);
          const prtStr = prt ? `${toPercent(round(prt, 4), lang)}` : '--';
          // id, invertCurrency
          if (index < limitNumber) {
            const _clickAdditional = {
              postType: 'web3',
              postId: item.resourceId,
              trade_pair: item.resourceId,
              groupId: additional.searchSessionId,
              contentItem: additional.searchWords,
              pagecate: 'NavigationSearchResult',
            };

            return (
              <Item
                key={item.resourceId}
                href={url}
                onClick={() => clickAdditional(resourceExtend, _clickAdditional)}
                inDrawer={inDrawer}
              >
                <Web3Title>
                  <Coins>
                    <CoinIcon icon={icon} />
                    <SmallCoinIcon src={chainIcon} />
                  </Coins>
                  <NameWrapper>
                    <ItemTitleWrapper>
                      <ItemTitle>{name}</ItemTitle>
                      <Tag>{chainName}</Tag>
                    </ItemTitleWrapper>
                    <TypeName>{shortenAddress(token)}</TypeName>
                  </NameWrapper>
                </Web3Title>
                <ContentWrapper>
                  <PriceWrapper>
                    <CoinTransferFold value={price} quoteCurrency="USD" />
                  </PriceWrapper>
                  <RateWrapper color={color}>
                    {prefix}
                    {prtStr}
                  </RateWrapper>
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
