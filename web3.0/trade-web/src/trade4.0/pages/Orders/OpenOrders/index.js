/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 16:40:35
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-07-18 16:29:00
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/OpenOrders/index.js
 * @Description:
 */
import React, { memo } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import { name } from './config';
import { GlobalStyle } from './style';
import OpenOrders from '@/pages/Orders/OpenOrders/OpenOrders';

export default memo(() => {
  // 现货合约响应节点
  const breakPoint = [280, 580, 768, 1024, 1280];
  return (
    <ComponentWrapper name={name} breakPoints={breakPoint}>
      <OpenOrders />
      <GlobalStyle />
    </ComponentWrapper>
  );
});
