/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import NumberFormat from 'components/common/NumberFormat';
import { styled } from '@kux/mui';

const Wrapper = styled.span`
  color: ${({ theme, color, zeroColor }) => theme.colors[color] || zeroColor};
  background-color: ${({ theme, bgColor }) => theme.colors[bgColor]};
`;

const ChangeRate = ({
  value,
  className,
  type,
  isNumber = false,
  zeroColor = 'text',
  numberFormatOptions,
  ...restProps
}) => {
  if (typeof value !== 'number') {
    value = +value;
  }
  let color = zeroColor;
  let bgColor = 'primary8';
  let prefix = '';
  if (value > 0) {
    color = 'primary';
    prefix = '+';
  } else if (value < 0) {
    color = 'secondary';
    bgColor = 'secondary8';
  }
  let styles = {};
  switch (type) {
    case 'normal':
    default:
      break;
    case 'bordered':
      styles = {
        borderRadius: 2,
        backgroundColor: bgColor,
        padding: '2px 6px',
        color: '#fff',
      };
      break;
  }

  const formatOptions = isNumber ? numberFormatOptions : { style: 'percent' };

  return (
    <Wrapper
      className={className}
      color={color}
      style={styles}
      zeroColor={zeroColor}
      {...restProps}
    >
      {prefix}
      <NumberFormat options={formatOptions}>{value}</NumberFormat>
    </Wrapper>
  );
};

ChangeRate.defaultProps = {
  value: 0,
  className: '',
  type: 'normal',
};

export default ChangeRate;
