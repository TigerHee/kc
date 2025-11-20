/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import style from './style.less';

const Empty = ({ empty }) => {
  return <div className={style.empty}>{empty}</div>;
};

export default Empty;
