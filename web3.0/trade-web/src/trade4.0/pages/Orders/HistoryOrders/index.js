/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 16:40:35
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-29 16:53:20
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/HistoryOrders/index.js
 * @Description:
 */
import React, { memo } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import { name } from './config';
import { GlobalStyle } from './style';
import HistoryOrders from '@/pages/Orders/HistoryOrders/HistoryOrders';

export default memo(() => {
  const breakPoint = [280, 580, 768, 1024, 1280];
  return (
    <ComponentWrapper name={name} breakPoints={breakPoint}>
      <HistoryOrders />
      <GlobalStyle />
    </ComponentWrapper>
  );
});
