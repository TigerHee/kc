/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import classNames from 'classnames';
import CmsComs from 'components/CmsComs';
import style from './style.less';

export default ({ className = '' }) => {
  return (
    <div className={`${className} ${style.logo}`}>
      <CmsComs.Load run="com.newheader.logo" />
    </div>
  );
};
