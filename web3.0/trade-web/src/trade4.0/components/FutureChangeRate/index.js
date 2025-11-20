/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';
import { toPercent } from 'helper';
import { styled } from '@kux/mui/emotion';

const RateBox = styled.span`
  white-space: nowrap;
  color: ${(props) => {
    return props.value > 0 ? props.theme.colors.primary : props.theme.colors.secondary;
  }};
`;

const ChangeRate = ({ value, className, precision }) => {
  if (value == null || value === '-') return '-';
  return (
    <RateBox value={value} className={`${className} changeRate`}>
      {toPercent(value, precision, undefined, undefined, true)}
    </RateBox>
  );
};

export default React.memo(ChangeRate);
