/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import SvgIcon from 'components/KCSvgIcon';

export default ({ size, ...others }) => {
  return (
    <div {...others}>
      <SvgIcon
        iconId="rocket"
        style={{ width: `${size}px`, height: `${size}px`, color: 'rgba(0,0,0,0.1)' }}
      />
    </div>
  );
};
