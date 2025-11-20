/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import style from './style.less';

const Empty = ({ empty, styles }) => {
  return (
    <div className={style.empty} >
      { empty }
    </div>
  );
};

export default Empty;
