/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import React from 'react';

const ChangeRate = ({ value, className, type }) => {
  if (typeof value !== 'number') {
    value = +value;
  }
  let color = '';
  let bgColor = '#01aa78';
  let prefix = '';
  if (value > 0) {
    color = 'color-high';
    prefix = '+';
  } else if (value < 0) {
    color = 'color-low';
    bgColor = '#FF495F';
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

  return (
    <span className={`${className} ${color}`} style={styles}>
      { prefix }
      { _.round(value * 100, 2) }%
    </span>
  );
};

ChangeRate.defaultProps = {
  value: 0,
  className: '',
  type: 'normal',
};

export default ChangeRate;
