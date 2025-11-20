/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { useSelector } from 'dva';
import { namespace } from '@/pages/RecentTrade/config';
import { _t } from 'utils/lang';
import { widthCfg } from '../style';

const Header = () => {
  const quoteCurrency = useSelector((state) => state[namespace].quoteCurrency);
  const baseCurrency = useSelector((state) => state[namespace].baseCurrency);
  const header = [
    { label: 'deal.price', currency: quoteCurrency },
    { label: 'deal.amount', currency: baseCurrency },
    { label: 'deal.time' },
  ];
  return (
    <div className="header-row" data-inspector="trade-recentTrade-header">
      {map(header, ({ label, currency = '' }, index) => (
        <div
          key={`list-header-${label}`}
          style={{ width: widthCfg[index] }}
        >{`${_t(label)}${currency ? `(${currency})` : ''}`}</div>
      ))}
    </div>
  );
};

export default Header;
