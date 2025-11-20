/*
 * owner: Clyne@kupotech.com
 */
import React, { memo, useEffect } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import Header from './components/Header';
import List from './components/List';
import { name } from './config';
import { Wrapper } from './style';
import { commonSensorsFunc } from '@/meta/sensors';

export default memo(() => {
  useEffect(() => {
    commonSensorsFunc(['recentTrade', 'recentTradeBtn', 'click']);
  }, []);
  return (
    <ComponentWrapper name={name}>
      <Wrapper className="recent-trade">
        <Header />
        <List />
      </Wrapper>
    </ComponentWrapper>
  );
});
