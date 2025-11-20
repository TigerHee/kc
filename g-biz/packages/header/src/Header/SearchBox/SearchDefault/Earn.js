/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { map, round } from 'lodash';
import { styled } from '@kux/mui';
import { toPercent } from '@utils/math';
import { useLang } from '../../../hookTool';
import CoinIcon from '../../../components/CoinIcon';
import { Wrapper, Title, Content } from './styled';
import siteConfig from '../../siteConfig';
import { kcsensorsManualTrack, kcsensorsClick, addLangToPath } from '../../../common/tools';
import { getEarnUrl } from '../config';

const Item = styled.a`
  width: 100%;
  height: 60px;
  padding: 12px 16px;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  text-decoration: none;
  &:last-of-type {
    margin-bottom: 0;
  }
  &:hover {
    background: ${(props) => props.theme.colors.cover4};
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
  const { data, inDrawer, lang } = props;
  const { t } = useLang();
  const { POOLX_HOST, KUCOIN_HOST } = siteConfig;

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearchTopEarn', '1'], {
      pagecate: 'NavigationSearchTopEarn',
    });
  }, []);

  const markHistory = useCallback((index) => {
    kcsensorsClick(['NavigationSearchTopEarn', '1'], {
      sortPosition: index,
      pagecate: 'NavigationSearchTopEarn',
    });
  }, []);
  if (data && data.earn && data.earn.length > 0) {
    return (
      <Wrapper>
        <Title inDrawer={inDrawer}>
          <span>{t('iASDc954cNKzLNZMN9kKsf')}</span>
        </Title>
        <Content>
          {map(data.earn, (item, index) => {
            const {
              id,
              invertCurrency,
              productCategory,
              name,
              icon,
              productCategoryItemStr,
              prt,
              minPrt,
              maxPrt,
              webJumpUrl,
            } = item;
            let prtStr = prt ? `${toPercent(round(Number(prt / 100), 4), lang)}` : '--';
            // minPrt或者maxPrt同时存在，则展示范围
            if (minPrt && maxPrt) {
              prtStr = `${toPercent(round(Number(minPrt / 100), 4), lang)} - ${toPercent(
                round(Number(maxPrt / 100), 4),
                lang,
              )}`;
            }
            const url = addLangToPath(getEarnUrl({ webJumpUrl, productCategory }), lang);
            if (index < 3) {
              return (
                <Item key={id} href={url} onClick={() => markHistory(index)}>
                  <EarnTitle>
                    <CoinIcon coin={invertCurrency} icon={icon} />
                    <NameWrapper>
                      <ItemTitle>{name}</ItemTitle>
                      <TypeName>{productCategoryItemStr}</TypeName>
                    </NameWrapper>
                  </EarnTitle>
                  <ContentWrapper>
                    <RateWrapper>{prtStr}</RateWrapper>
                    <Tip>{t('8HU9JHaf5vQXV2by9jScTd')}</Tip>
                  </ContentWrapper>
                </Item>
              );
            }
            return null;
          })}
        </Content>
      </Wrapper>
    );
  }
  return null;
};
