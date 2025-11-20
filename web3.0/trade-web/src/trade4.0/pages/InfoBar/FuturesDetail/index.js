/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';
import MarkPrice from './MarkPrice';
import LastPrice from './LastPrice';
import IndexPrice from './IndexPrice';
import Volume from './Volume';
import TurnOver from './TurnOver';
import OpenValue from './OpenValue';
import OpenInterest from './OpenInterest';
import FundingRate from './FundingRate';
import ProjectedFundingRate from './ProjectedFundingRate';
import { FuturesDetailWrapper } from './style';
import { useSocket } from './hooks/useSocket';

export const RenderHook = memo(() => {
  useSocket();
  return <></>;
});

const FuturesDetail = () => {
  return (
    <FuturesDetailWrapper className="observe-child">
      <RenderHook />
      <LastPrice />
      <MarkPrice />
      <IndexPrice />
      <Volume />
      <TurnOver />
      <OpenInterest />
      <OpenValue />
      <FundingRate />
      <ProjectedFundingRate />
    </FuturesDetailWrapper>
  );
};

export default memo(FuturesDetail);
