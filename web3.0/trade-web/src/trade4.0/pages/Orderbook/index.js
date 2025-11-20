/*
 * owner: Clyne@kupotech.com
 */
import React, { memo, useEffect } from 'react';
import Header from '@/pages/Orderbook/components/Header';
import Content from '@/pages/Orderbook/components/Content';
import Tip from '@/pages/Orderbook/components/List/Tip';
import ComponentWrapper from '@/components/ComponentWrapper';
import { name } from './config';
import { Content as Wrapper } from './style';
import { commonSensorsFunc } from '@/meta/sensors';

export default memo(() => {
  useEffect(() => {
    commonSensorsFunc(['orderBook', 'orderBookBtn', 'click']);
  }, []);
  return (
    <ComponentWrapper name={name} breakPoints={[600]}>
      <Wrapper className="order-book">
        <Header />
        <Content />
        <Tip />
      </Wrapper>
    </ComponentWrapper>
  );
});
