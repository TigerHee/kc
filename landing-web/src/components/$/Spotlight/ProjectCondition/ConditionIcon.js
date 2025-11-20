/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import SvgIcon from 'kc-svg-sprite';
import style from './style.less';

const ConditionIcon = ({ iconId, width, height }) => {
  return (
    <div className={style.conditionIcon}>
      <SvgIcon iconId={iconId} style={{ width, height }} />
    </div>
  );
};

export default ConditionIcon;
