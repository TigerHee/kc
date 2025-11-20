/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { NumberFormat as NumberFormatMui } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { useLocale } from '@kucoin-base/i18n';
import { _t, addLangToPath } from 'src/tools/i18n';
import siteConfig from 'utils/siteConfig';
import MoneyAmountFormat from 'components/common/MoneyAmountFormat';
import Bet from '../Bet';
import SupplyFormat from './SupplyFormat';
import { percentComp } from '../../config';
import {
  Wrapper,
  PriceBox,
  PriceWrapper,
  Title,
  Price,
  ListBox,
  ListItem,
  InfoTitle,
  Info,
  Line,
  RiseFall,
  TitleWrapper,
  RiseFallTitle,
  RiseFallInnfo,
} from './index.style';

const { KUCOIN_HOST } = siteConfig;

const symbol = 'BTC-USDT';

export default () => {
  const { coinInfo, tradeData } = useSelector((state) => state.bitcoinHalving);
  const prices = useSelector((state) => state.currency.prices);
  const { currentLang } = useLocale();

  const NumberFormat = (price, symbol, idx = 0) => {
    try {
      if (!price) return price;
      const baseCoin = symbol.split('-')[idx];
      const baseCoinRate = prices ? prices[baseCoin] : null;
      if (baseCoinRate) {
        let target = baseCoinRate * price; // 多次高精度计算的bug
        return target;
      } else {
        return price;
      }
    } catch (error) {
      return price;
    }
  };

  return (
    <Wrapper>
      <PriceWrapper>
        <PriceBox>
          <Title>
            <a href={addLangToPath(`${KUCOIN_HOST}/price/BTC`)}>
              {_t('qMY2A6J4HwpdHHUW6j1mko')} ({_t('coin.detail.line.type.24H')})
            </a>
          </Title>
          <Price>
            {tradeData?.price ? (
              <React.Fragment>
                $
                <NumberFormatMui
                  options={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                  lang={currentLang}
                >
                  {tradeData?.price}
                </NumberFormatMui>
              </React.Fragment>
            ) : (
              '--'
            )}
          </Price>
        </PriceBox>
        <ListBox>
          <ListItem>
            <InfoTitle>{_t('xAWQqiub9CZXPNiN3xFuHN')}</InfoTitle>
            <Info color="#F3F3F3">
              <MoneyAmountFormat
                value={NumberFormat(tradeData?.volume24h, symbol)}
                needTransfer={false}
              />
            </Info>
          </ListItem>
          <ListItem>
            <InfoTitle>{_t('fnw9HzRe3h9AfsyGTrkwGh')}</InfoTitle>
            <Info color={tradeData?.priceChangeRate24h >= 0 ? '#01BC8D' : 'rgb(246, 103, 84)'}>
              {percentComp(tradeData?.priceChangeRate24h, currentLang)}
            </Info>
          </ListItem>
          <ListItem>
            <InfoTitle>{_t('4UbG1Sh3rug7uML9cyh5rt')}</InfoTitle>
            <Info color="#F3F3F3">
              <SupplyFormat value={coinInfo.circulatingSupply} />
            </Info>
          </ListItem>
        </ListBox>
      </PriceWrapper>
      <Line />
      <RiseFall>
        <TitleWrapper>
          <RiseFallTitle>{_t('reES9CXZgQkUBgsuF23ZXN')}</RiseFallTitle>
          <RiseFallInnfo>{_t('1Z14cxFBtjbJWCMrvh6jhs')}</RiseFallInnfo>
        </TitleWrapper>
        <Bet />
      </RiseFall>
    </Wrapper>
  );
};
