import React from 'react';

import NumberFormat from '.';

/** 收益数值展示 相比 NumberFormat 增加 跟单收益 精度限制 */
export const ProfitNumber = props => {
  return <NumberFormat {...props} isProfitNumber />;
};
