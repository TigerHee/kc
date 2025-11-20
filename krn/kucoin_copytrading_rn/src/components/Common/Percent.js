import React, {memo} from 'react';

import NumberFormat from './NumberFormat';

const Percent = props => {
  const {options, style, placeholder, ...others} = props;

  return (
    <NumberFormat
      style={style}
      placeholder={placeholder}
      options={{
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...(options || {}),
      }}
      {...others}
    />
  );
};

export default memo(Percent);
