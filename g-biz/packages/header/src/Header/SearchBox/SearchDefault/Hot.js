/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect, useCallback, useState } from 'react';
import round from 'lodash/round';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, styled, NumberFormat } from '@kux/mui';

import { toPercent } from '@utils/math';
import siteConfig from '../../siteConfig';
import { getSymbolTick } from '../../service';
import HotSearchBG from '../../../../static/newHeader/hotSearchBG.png';
import { namespace } from '../../model';
import {
  sub,
  divide,
  kcsensorsManualTrack,
  kcsensorsClick,
  addLangToPath,
  formatLangNumber,
} from '../../../common/tools';
import CountDown from './countDown';
// import { pushHistory } from '../config';
import { Wrapper, Title } from './styled';
import { useLang } from '../../../hookTool';

const ContentWrapper = styled.a`
  width: 100%;
  height: 82px;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
  text-decoration: none;
`;
const ContentBG = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  position: relative;
  cursor: pointer;
`;

const HotTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  height: 43px;
`;
const NewCoinTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
`;
const ItemTitle = styled.span`
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  span {
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    margin-left: 2px;
    color: ${(props) => props.theme.colors.text30};
  }
`;
const PriceContent = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const RateWrapper = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: ${(props) => props.fontSize || '12px'};
  line-height: 130%;
  margin-left: 2px;
  color: ${(props) => props.color};
`;
const NormalWrapper = styled.div`
  min-width: 59px;
  height: 50px;
  padding: 8px;
  background: ${(props) =>
    props.theme.currentTheme === 'light'
      ? props.theme.colors.textEmphasis
      : 'rgba(0, 13, 29, 0.4)'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;
const SearchNumber = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
`;

const SearchTips = styled.span`
  font-weight: 600;
  font-size: 10px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
`;

const NewListingWrapper = styled.div`
  min-width: 59px;
  height: 50px;
  padding: 8px;
  background: ${(props) =>
    props.theme.currentTheme === 'light'
      ? props.theme.colors.textEmphasis
      : props.theme.colors.text40};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
`;
const NewListingItem = styled.div`
  min-width: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;
const NewListingNumber = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.color || props.theme.colors.text};
  margin-bottom: 2px;
`;
const NewListingType = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.3;
`;

const Divider = styled.span`
  width: 1px;
  height: 28px;
  margin: 0 12px;
  background: ${(props) => props.theme.colors.divider};
`;
const PreNewListingWrapper = styled.div`
  min-width: 98px;
  height: 42px;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 2;
`;

const CountDownText = styled.div`
  font-weight: 500;
  font-size: 10px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 4px;
`;

const ComingWrapper = styled(PreNewListingWrapper)`
  justify-content: flex-end;
  align-items: center;
`;

const Coming = styled.div`
  display: flex;
  align-items: center;
  height: 18px;
  padding: 0 4px;
  height: 18px;
  background: linear-gradient(305.3deg, #01bc8d 3.32%, #2ccfa8 100%);
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  color: ${(props) => props.theme.colors.textEmphasis};
`;

const SymbolCodeToName = (props) => {
  const { code, divide = '/' } = props;
  const { symbols } = useSelector((state) => state[namespace] || {});
  const symbol = symbols.find((s) => s.code === code);
  const resultSymbol = symbol ? symbol.symbol.replace('-', divide) : code.replace('-', divide);
  const currencyArr = resultSymbol.split(divide);
  const baseCurrency = currencyArr[0];
  const quoteCurrency = currencyArr[1];
  const result = (
    <ItemTitle>
      {baseCurrency}
      <span>{`${divide}${quoteCurrency}`}</span>
    </ItemTitle>
  );

  return result;
};
const TRADE_PATH = '/trade';

export default (props) => {
  const { data, lang, inDrawer } = props;
  const { t } = useLang();
  const [priceOrigin, setPrice] = useState();
  const [rateOrigin, setRate] = useState();
  const dispatch = useDispatch();
  // NEW_LISTING, NORMAL, PRE_NEW_LISTING
  const { KUCOIN_HOST } = siteConfig;
  const { openingPrice, spotTag, countdownTime, previewEnableShow, searchCount, symbol } =
    data || {};
  const theme = useTheme();
  const { colors } = theme;
  let rate = rateOrigin;
  if (typeof rate !== 'number') {
    rate = +rate;
  }
  let rateColor = colors.text40;
  let prefix = '';
  if (rate > 0) {
    rateColor = '#01BC8D';
    prefix = '+';
  } else if (rate < 0) {
    rateColor = colors.secondary;
  }
  const price = priceOrigin ? formatLangNumber(priceOrigin, lang) : '--';
  const rateString = rate ? `${prefix}${toPercent(round(rate, 4), lang)}` : '--';

  let url = `${TRADE_PATH}/${symbol}`;
  if (previewEnableShow) {
    url = `${KUCOIN_HOST}/markets/new-cryptocurrencies`;
  }
  url = addLangToPath(url, lang);
  const CountDownFn = useCallback(() => {
    dispatch({
      type: `${namespace}/recommendSpot`,
    });
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
  const queryMarketsRecord = useCallback((_symbols) => {
    if (!_symbols) {
      return;
    }
    getSymbolTick({
      params: _symbols,
    })
      .then((res) => {
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
        <Content>
          <HotTitle>
            <SymbolCodeToName code={symbol} />
            <PriceContent>
              {price}
              <RateWrapper color={rateColor} fontSize={12}>
                {rate ? rateString : ''}
              </RateWrapper>
            </PriceContent>
          </HotTitle>
          <NormalWrapper>
            <SearchNumber>
              <NumberFormat lang={lang} options={{ maximumFractionDigits: 2, notation: 'compact' }}>
                {searchCount}
              </NumberFormat>
            </SearchNumber>
            <SearchTips>{t('vUJDZagB11KkRtGQiSMjFe')}</SearchTips>
          </NormalWrapper>
        </Content>
      );
    }
    if (spotTag === 'NEW_LISTING') {
      return (
        <Content>
          <HotTitle>
            <NewCoinTitle>{t('p7pq9X5TZ95e2c9t5SRSF8')}</NewCoinTitle>
            <SymbolCodeToName code={symbol} />
          </HotTitle>
          <NewListingWrapper>
            <NewListingItem>
              <NewListingNumber>{price}</NewListingNumber>
              <NewListingType>{t('6LVSFEWEwbpFrsRsRmr3He')}</NewListingType>
            </NewListingItem>
            <Divider />
            <NewListingItem>
              <NewListingNumber color={rateColor}>{rateString}</NewListingNumber>
              <NewListingType>{t('7nAZY172313GGycYAVm9g6')}</NewListingType>
            </NewListingItem>
          </NewListingWrapper>
        </Content>
      );
    }
    if (spotTag === 'PRE_NEW_LISTING') {
      return (
        <Content>
          <HotTitle>
            <NewCoinTitle>{t('p7pq9X5TZ95e2c9t5SRSF8')}</NewCoinTitle>
            <SymbolCodeToName code={symbol} />
          </HotTitle>
          {previewEnableShow ? (
            <PreNewListingWrapper>
              <CountDown initialSec={countdownTime} finishFn={CountDownFn} />
              <CountDownText>{t('jJHhubkQzfRPJfys8yA6MC')}</CountDownText>
            </PreNewListingWrapper>
          ) : (
            <ComingWrapper>
              <Coming>{t('sMUjriV7ZakUsQWbw49gp7')}</Coming>
            </ComingWrapper>
          )}
        </Content>
      );
    }

    return null;
  };
  return (
    <Wrapper>
      <Title inDrawer={inDrawer}>
        <span>{t('wTcEtrkYPxY1uERe6hhYPY')}</span>
      </Title>
      <ContentWrapper href={url} onClick={markHistory}>
        <ContentBG src={HotSearchBG} />
        {combo()}
      </ContentWrapper>
    </Wrapper>
  );
};
