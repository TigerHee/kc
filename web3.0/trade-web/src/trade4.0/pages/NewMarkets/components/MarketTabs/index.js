/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import FirstTabs from './FirstTabs';
import { TabWrapper } from './style';
import SecondTabs from './SecondTabs';
import ThirdTabs from './ThirdTabs';

const RenderHook = () => {
  return null;
};

const MarketTabs = () => {
  return (
    <TabWrapper className="market-tabs">
      <RenderHook />
      <FirstTabs />
      <SecondTabs />
      <ThirdTabs />
    </TabWrapper>
  );
};

export default MarketTabs;
