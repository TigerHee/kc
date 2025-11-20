/*
 * owner: Clyne@kupotech.com
 */
import React, { memo } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import Chart from './Chart';
import { name } from './config';
import { GlobalStyle } from './style';

export default memo(() => {
  return (
    <ComponentWrapper name={name} className="depth-wrapper">
      <Chart />
      <GlobalStyle />
    </ComponentWrapper>
  );
});
