/**
 * Owner: Clyne@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { FuturesDetailWrapper as Wrapper } from '../style';
import MarkPrice from '../MarkPrice';
import IndexPrice from '../IndexPrice';
import Volume from '../Volume';
import TurnOver from '../TurnOver';
import OpenInterest from '../OpenInterest';
import OpenValue from '../OpenValue';
import FundingRate from '../FundingRate';
import ProjectedFundingRate from '../ProjectedFundingRate';
import { event } from 'src/trade4.0/utils/event';

const optionConfigs = [
  {
    label: (
      <Wrapper isMore>
        <MarkPrice />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <IndexPrice />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <Volume />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <TurnOver />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <OpenInterest />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <OpenValue />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <FundingRate />
      </Wrapper>
    ),
  },
  {
    label: (
      <Wrapper isMore>
        <ProjectedFundingRate />
      </Wrapper>
    ),
  },
];

export const useMore = () => {
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    const handle = ({ hiddenIndex }) => {
      setConfigs(optionConfigs.slice(hiddenIndex));
    };
    event.on('HEADER_HIDDEN_INDEX', handle);

    return () => event.off('HEADER_HIDDEN_INDEX');
  }, [setConfigs]);
  return { configs };
};
