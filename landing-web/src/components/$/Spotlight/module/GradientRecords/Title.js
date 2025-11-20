/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import style from './style.less';

const Title = ({ title }) => {
  return (
    <div className={style.title}>
      { title }
    </div>
  );
};

export default Title;
