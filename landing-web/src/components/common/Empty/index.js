/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import KCSvgIcon from '../KCSvgIcon';

export default ({ size, ...others }) => {
  return (
    <div {...others}>
      <KCSvgIcon
        iconId="rocket"
        style={{ width: `${size}px`, height: `${size}px`, color: 'rgba(0,0,0,0.1)' }}
      />
    </div>
  );
};
