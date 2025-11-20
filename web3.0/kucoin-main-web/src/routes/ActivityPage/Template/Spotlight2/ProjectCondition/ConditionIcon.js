/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import SvgIcon from 'components/common/KCSvgIcon';
import style from './style.less';

const ConditionIcon = ({ iconId, width, height }) => {
  return (
    <div className={style.conditionIcon}>
      <SvgIcon iconId={iconId} style={{ width, height }} />
    </div>
  );
};

export default ConditionIcon;
