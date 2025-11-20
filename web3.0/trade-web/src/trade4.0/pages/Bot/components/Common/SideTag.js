/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Tag from '@kux/mui/Tag';
import { _t } from 'Bot/utils/lang';

const color = {
  buy: 'primary',
  sell: 'secondary',
};
/**
 * @description: 买卖方向
 * @return {*}
 */
export default ({ side, className }) => {
  return (
    <Tag color={color[side]} className={`${className} mr-4`}>
      {_t(side)}
    </Tag>
  );
};

// lang币种市场
const marketType = {
  limit: 'config3',
  market: 'config4',
};
/**
 * @description: 市场类型
 * @param {*} type
 * @return {*}
 */
export const MarketType = ({ type, children, className }) => {
  const child = type && marketType[type] ? _t(marketType[type]) : children;
  return (
    <Tag color="default" className={className}>
      {child}
    </Tag>
  );
};
