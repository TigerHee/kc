/**
 * Owner: Clyne@kupotech.com
 */

import React, { memo, useState } from 'react';
import { Wrapper } from './style';
import TurnOver from '../FuturesDetail/TurnOver';
import OpenInterest from '../FuturesDetail/OpenInterest';
import OpenValue from '../FuturesDetail/OpenValue';
import FundingRate from '../FuturesDetail/FundingRate';
import ProjectedFundingRate from '../FuturesDetail/ProjectedFundingRate';
import ArrowIcon from './ArrowIcon';

const Content = memo(() => (
  <>
    <TurnOver />
    <OpenInterest />
    <OpenValue />
    <FundingRate itemType="fund" />
    <FundingRate itemType="settle" />
    <ProjectedFundingRate />
  </>
));

const MFutureOtherInfo = () => {
  const [active, setActive] = useState();
  const onClick = () => {
    setActive(active ? '' : 'active');
  };
  return (
    <Wrapper active={active}>
      <Content />
      <ArrowIcon onClick={onClick} active={active} />
    </Wrapper>
  );
};

export default MFutureOtherInfo;
