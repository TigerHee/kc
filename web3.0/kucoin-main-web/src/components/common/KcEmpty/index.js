/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import tableEmptySvg from 'static/assets/tableEmpty.svg';

export default ({ size = 150, ...others }) => {
  return (
    <div {...others}>
      <img width={size} src={tableEmptySvg} alt="" />
    </div>
  );
};
