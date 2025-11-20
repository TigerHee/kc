/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-18 18:30:51
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-18 19:14:16
 * @FilePath: /trade-web/src/trade4.0/components/ChangeRate/index.js
 * @Description:
 */
import _ from 'lodash';
import React from 'react';
import { useTheme } from '@kux/mui';
import { styled } from '@/style/emotion';

export const Wrapper = styled.span`
  display: inline-block;

  [dir='rtl'] & {
    direction: rtl;
  }
`;

const ChangeRate = ({ value }) => {
  const theme = useTheme();
  if (typeof value !== 'number') {
    value = +value;
  }
  let color = theme.colors.primary;
  let prefix = '';
  if (value > 0) {
    prefix = '+';
  } else if (value < 0) {
    color = theme.colors.secondary;
  }

  return (
    <Wrapper style={{ color }}>
      {prefix}
      {_.round(value * 100, 2)}%
    </Wrapper>
  );
};

ChangeRate.defaultProps = {
  value: 0,
};

export default ChangeRate;
