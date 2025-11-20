/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useResponsive, NumberFormat } from '@kux/mui';
import { _t, _tHTML } from 'tools/i18n';
import { useSelector } from 'src/hooks/useSelector';
import { useLocale } from '@kucoin-base/i18n';
import { getPrecisionFromIncrement, formatNumber } from 'helper';
import { addLangToPath } from 'src/tools/i18n';
import { trackClick } from 'utils/ga';
import { getRobotRank, getBTCfutures } from 'services/bitcoinHalving';
import robot from 'static/bitcoin-halving/robot.svg';
import increase from 'static/bitcoin-halving/increase.svg';
import down from 'static/bitcoin-halving/down.svg';
import siteConfig from 'utils/siteConfig';
import { percentComp } from '../../config';
import {
  Wrapper,
  Card,
  Title,
  Transfer,
  PriceBox,
  SymbolBox,
  SymbolIcon,
  SymbolInfo,
  Icon,
  Symbol,
  PriceWrapper,
  Price,
  Rate,
  Img,
  TitleWraper,
  Button,
  RateInfo,
  RateWrapper,
  ActionWrapper,
  RateBox,
} from './index.style';

const { KUCOIN_HOST } = siteConfig;

const params = {
  criteria: [
    {
      field: 'currency',
      op: '=',
      value: 'BTC',
    },
    {
      field: 'templateType',
      op: '=',
      value: '2',
    },
  ],
  sort: {
    direction: 'DESC',
    field: 'profitRateYear',
  },
  currentPage: 0,
  pageSize: 10,
};

const BTC_Symbol = 'XBTUSDM';

export default () => {
  const responsive = useResponsive();
  const { currentLang } = useLocale();
  const [robotYearRate, setRobotYearRate] = useState();
  const { coinInfo, tradeData } = useSelector((state) => state.bitcoinHalving);
  const [futureInfo, setFutureInfo] = useState({});

  useEffect(() => {
    getBTCfutures({ currentPage: 1, keyword: BTC_Symbol, pageSize: 30, tabType: 'FUTURE' }).then(
      (res) => {
        if (res.success && res.data && res.data.data) {
          res.data.data.find((item) => {
            if (item.symbolCode === BTC_Symbol) {
              return setFutureInfo(item);
            }
          });
        }
      },
    );
  }, []);

  useEffect(() => {
    getRobotRank(params).then((res) => {
      if (res && res.success && res.items) {
        const data = res.items[0] || {};
        const profitRateYear = data.profitRateYear;
        if (profitRateYear) {
          setRobotYearRate(profitRateYear);
        }
      }
    });
  }, []);

  const handleClick = useCallback((blockid) => {
    if (blockid) {
      trackClick([blockid, '1']);
    }
  }, []);

  return (
    <Wrapper>
      <Card>
        <Title>{_t('wLNTRPWU749NABR4NjpKat')}</Title>
        <Transfer>
          <PriceBox>
            <SymbolBox>
              <Icon src={coinInfo?.logo} alt="symbol" />
              <Symbol>BTC/USDT</Symbol>
            </SymbolBox>
            <PriceWrapper>
              <Price>
                {tradeData?.price ? (
                  <React.Fragment>
                    $
                    <NumberFormat
                      options={{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }}
                      lang={currentLang}
                    >
                      {tradeData?.price}
                    </NumberFormat>
                  </React.Fragment>
                ) : (
                  '--'
                )}
              </Price>
              <RateBox>
                <Rate
                  color={
                    Number(tradeData?.priceChangeRate24h) >= 0 ? '#01BC8D' : 'rgb(246, 103, 84)'
                  }
                >
                  {percentComp(tradeData?.priceChangeRate24h, currentLang)}
                </Rate>
                <Img
                  src={Number(tradeData?.priceChangeRate24h) >= 0 ? increase : down}
                  alt="icon"
                />
              </RateBox>
            </PriceWrapper>
          </PriceBox>
          <Button
            href={addLangToPath(`${KUCOIN_HOST}/trade/BTC-USDT`)}
            onClick={() => {
              handleClick('spottrade');
            }}
          >
            {_t('7weyyr9FkEcLTy43XtayBL')}
          </Button>
        </Transfer>
      </Card>
      <Card>
        <Title>{_t('78tYEpeipyniJ2Lcs8S5d3')}</Title>
        <Transfer>
          <PriceBox>
            <SymbolBox>
              <Icon src={coinInfo?.logo} alt="symbol" />
              <Symbol>BTC PERP/USD</Symbol>
            </SymbolBox>
            <PriceWrapper>
              <Price>
                {futureInfo?.lastTradePrice ? (
                  <React.Fragment>
                    $
                    <NumberFormat
                      lang={currentLang}
                      options={{
                        maximumFractionDigits: getPrecisionFromIncrement(futureInfo?.tickSize) || 2,
                      }}
                    >
                      {futureInfo?.lastTradePrice}
                    </NumberFormat>
                  </React.Fragment>
                ) : (
                  '--'
                )}
              </Price>
              <RateBox>
                <Rate
                  color={Number(futureInfo?.changeRate24h) >= 0 ? '#01BC8D' : 'rgb(246, 103, 84)'}
                >
                  {percentComp(futureInfo.changeRate24h, currentLang)}
                </Rate>
                <Img src={Number(futureInfo?.changeRate24h) >= 0 ? increase : down} alt="icon" />
              </RateBox>
            </PriceWrapper>
          </PriceBox>
          <Button
            href={addLangToPath(`${KUCOIN_HOST}/futures/trade/XBTUSDM`)}
            onClick={() => {
              handleClick('futuretrade');
            }}
          >
            {_t('7weyyr9FkEcLTy43XtayBL')}
          </Button>
        </Transfer>
      </Card>
      <Card>
        <Title>{_t('o1d1NjqyHxe8iCyU8WnpSE')}</Title>
        <Transfer>
          <PriceBox>
            <TitleWraper>
              <img src={robot} alt="icon" />
              <span>{_t('iva7qh8XD9cM7D2mhsFB9p')}</span>
            </TitleWraper>
            <SymbolBox>
              <SymbolIcon src={coinInfo?.logo} alt="symbol" />
              <SymbolInfo>BTC/USDT</SymbolInfo>
            </SymbolBox>
          </PriceBox>
          {!responsive.lg ? (
            <ActionWrapper>
              <RateWrapper>
                <RateInfo>APY</RateInfo>
                <Rate color={Number(robotYearRate) >= 0 ? '#01BC8D' : 'rgb(246, 103, 84)'}>
                  {robotYearRate ? `${formatNumber(robotYearRate * 100, 2)}%` : '--'}
                </Rate>
              </RateWrapper>
              <Button
                href={addLangToPath(`${KUCOIN_HOST}/trading-bot/dca/BTC-USDT`)}
                onClick={() => {
                  handleClick('robottrade');
                }}
              >
                {_t('2zz5WHdkSHPNZS58kr5J3Y')}
              </Button>
            </ActionWrapper>
          ) : (
            <React.Fragment>
              <RateWrapper>
                <RateInfo>APY</RateInfo>
                <Rate color={Number(robotYearRate) >= 0 ? '#01BC8D' : 'rgb(246, 103, 84)'}>
                  {robotYearRate ? `${formatNumber(robotYearRate * 100, 2)}%` : '--'}
                </Rate>
              </RateWrapper>
              <Button
                href={addLangToPath(`${KUCOIN_HOST}/trading-bot/dca/BTC-USDT`)}
                onClick={() => {
                  handleClick('robottrade');
                }}
              >
                {_t('2zz5WHdkSHPNZS58kr5J3Y')}
              </Button>
            </React.Fragment>
          )}
        </Transfer>
      </Card>
      <Card>
        <Title>{_t('ipZpU8K5jr6TokMftpiCxQ')}</Title>
        <Transfer>
          <PriceBox>
            <TitleWraper>
              <span>{_t('pSMDoR5hXv9YEMR25732eq')}</span>
            </TitleWraper>
            <SymbolBox>
              <SymbolIcon src={coinInfo?.logo} alt="symbol" />
              <SymbolInfo>BTC/USDT</SymbolInfo>
            </SymbolBox>
          </PriceBox>
          {!responsive.lg ? (
            <ActionWrapper last>
              <Button
                href={addLangToPath(`${KUCOIN_HOST}/earn`)}
                onClick={() => {
                  handleClick('earn');
                }}
              >
                {_t('2zz5WHdkSHPNZS58kr5J3Y')}
              </Button>
            </ActionWrapper>
          ) : (
            <React.Fragment>
              <Button
                href={addLangToPath(`${KUCOIN_HOST}/earn`)}
                onClick={() => {
                  handleClick('earn');
                }}
              >
                {_t('2zz5WHdkSHPNZS58kr5J3Y')}
              </Button>
            </React.Fragment>
          )}
        </Transfer>
      </Card>
    </Wrapper>
  );
};
