import React, {memo} from 'react';

import {PanelWrap} from '../components';
import HoldingStats from './HoldingStats';
import Performance from './Performance';
import PnL from './PnL';
import Preference from './Preference';

const OverviewPanel = () => {
  return (
    <PanelWrap>
      <PnL />
      <Performance />
      <HoldingStats />
      <Preference />
    </PanelWrap>
  );
};

export default memo(OverviewPanel);
