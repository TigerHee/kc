import React, {memo} from 'react';
import {useSelector} from 'react-redux';

import ActivityBanner from './ActivityBanner';
import ApplyTraderCard from './ApplyTraderCard';
import {BarWrapper} from './styles';

const ActivityBar = () => {
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);

  return (
    <BarWrapper>
      <ApplyTraderCard isLeadTrader={isLeadTrader} />
      <ActivityBanner isLeadTrader={isLeadTrader} />
    </BarWrapper>
  );
};

export default memo(ActivityBar);
