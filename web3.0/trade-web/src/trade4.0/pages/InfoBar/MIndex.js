/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import useIsMargin from '@/hooks/useIsMargin';
import SymbolSwitch from '@/pages/InfoBar/SymbolSwitch';
import { TradeWaySwitchRow } from './TradeWaySwitch';
import { getSingleModule } from '@/layouts/utils';
import {
  ReferRate,
  PriceInfo,
  ManagementFee,
  StatisticsInfo,
  useRealTimeMarketInfo,
} from '@/pages/InfoBar/RealTimeMarketInfo';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import LastPrice from './FuturesDetail/LastPrice';
import MFutureBaseInfo from './MFutureBaseInfo';
import MFutureOtherInfo from './MFutureOtherInfo';
import { fx } from 'src/trade4.0/style/emotion';
import { isFromTMA } from 'utils/tma/isFromTMA';

/** 样式开始 */
const FlexBox = styled.div`
  display: flex;
`;
const BetweenBox = styled(FlexBox)`
  flex-direction: column;
  justify-content: space-between;
`;
const Container = styled(FlexBox)`
  overflow: hidden;
  padding: 4px 12px 16px;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${(props) => props.theme.colors.overlay};
  ${(props) => props.theme.breakpoints.down('sm')} {
    .item-list {
      margin-top: 8px;
    }
  }
  &.futures-content {
    flex-wrap: nowrap;
    .futures-info-box {
      width: auto;
      min-width: 30%;
      max-width: 40%;
      justify-content: flex-start;
    }
    .ticker-left {
      > span {
        display: flex;
      }
    }
    .symbol-select {
      display: block;
      font-size: 16px;
      .symbol-name {
        ${props => fx.color(props, 'text')}
      }
      .symbol-type {
        font-size: 12px;
      }
    }
    .symbol-style {
      width: auto;
    }
  }
`;
const SymbolInfoBox = styled(BetweenBox)`
  width: 40%;
  margin-right: 24px;
  margin-top: 12px;
`;
const StatisticsBox = styled(BetweenBox)`
  min-width: 22%;
  margin-top: 12px;
`;
const StyledPriceInfo = styled(PriceInfo)`
  margin-top: 8px;
`;
/** 样式结束 */

const MSpotInfoBar = React.memo(() => {
  const {
    low,
    vol,
    high,
    volValue,
    changeRate,
    changePrice,
    lastDealPrice,
  } = useRealTimeMarketInfo();
  const etfCoin = useEtfCoin();
  const isMargin = useIsMargin();
  const { isSingle } = getSingleModule();
  return (
    <React.Fragment>
      {!isSingle && !isFromTMA() && <TradeWaySwitchRow />}
      <Container>
        <SymbolInfoBox>
          <SymbolSwitch />
          <StyledPriceInfo
            changeRate={changeRate}
            price={lastDealPrice}
            changePrice={changePrice}
          />
        </SymbolInfoBox>
        <StatisticsBox className="ml-12 mr-12">
          <StatisticsInfo {...high} />
          <StatisticsInfo {...vol} />
        </StatisticsBox>
        <StatisticsBox>
          <StatisticsInfo {...low} />
          <StatisticsInfo {...volValue} />
        </StatisticsBox>
        {isMargin && <ReferRate />}
        {Boolean(etfCoin) && <ManagementFee />}
      </Container>
    </React.Fragment>
  );
});

const MFutureInfoBar = () => {
  const { isSingle } = getSingleModule();
  return (
    <>
      {!isSingle && !isFromTMA() && <TradeWaySwitchRow />}
      <Container className="futures-content">
        <SymbolInfoBox className="futures-info-box">
          <SymbolSwitch />
          <LastPrice />
        </SymbolInfoBox>
        <MFutureBaseInfo />
      </Container>
      <MFutureOtherInfo />
    </>
  );
};

const MInfoBar = () => {
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  return isFutures ? <MFutureInfoBar /> : <MSpotInfoBar />;
};

export default MInfoBar;
