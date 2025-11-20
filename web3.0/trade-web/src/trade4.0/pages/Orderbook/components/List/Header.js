/*
 * owner: Clyne@kupotech.com
 */
import React, { useContext } from 'react';
import { map } from 'lodash';
import { useSelector } from 'dva';
import { namespace, WrapperContext } from '@/pages/Orderbook/config';
import { _t } from 'utils/lang';
import { HeaderRow, widthCfg } from './style';

const Header = ({ showHeader, display }) => {
  const quoteCurrency = useSelector((state) => state[namespace].quoteCurrency);
  const baseCurrency = useSelector((state) => state[namespace].baseCurrency);
  const screen = useContext(WrapperContext);
  const header = [
    { label: 'deal.price', currency: quoteCurrency },
    { label: 'deal.amount', currency: baseCurrency },
    { label: 'margin.total', currency: baseCurrency },
  ];
  if (display === 'inner' && screen === 'sm') {
    return null;
  }
  if (display === 'outer' && screen === 'md') {
    return null;
  }
  if (!showHeader) {
    return null;
  }

  return (
    <HeaderRow key="header">
      {map(header, ({ label, currency }, index) => (
        <div
          key={`list-header-${label}`}
          style={{ width: widthCfg[index] }}
        >{`${_t(label)} (${currency})`}</div>
      ))}
    </HeaderRow>
  );
};

export default Header;
