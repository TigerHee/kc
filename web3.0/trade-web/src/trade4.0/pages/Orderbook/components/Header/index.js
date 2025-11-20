/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import Type from './Type';
import Depth from './Depth';
import LastPrice from '../Bar/LastPrice';
import Price from '../Bar/Price';
import { HeaderWrapper } from './style';
import AmountType from './AmountType';

const Header = () => {
  return (
    <HeaderWrapper className="orderbook-header" data-inspector="trade-orderbook-header">
      <LastPrice className="header" />
      <Price className="padl26" dataKey="markPrice" tips="isolated.markPrice.desc" />
      <Price className="padl8" dataKey="indexPrice" tips="trade.orderbook.indexPrice.desc" />
      <Price className="header" dataKey="netAssets" tips="etf.netAssetValue.tip" />
      <Type />
      <Depth />
      <AmountType />
    </HeaderWrapper>
  );
};

export default Header;
