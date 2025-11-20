/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import style from './style.less';
import logoLoading from 'assets/logoLoading.svg';

export default () => {
  return (
    <div className={style.loading}>
      <div className={style.loading_center}>
        <div className={style.loading_center_absolute}>
          <img className={style.rotating} src={logoLoading} alt="" />
        </div>
      </div>
    </div>
  );
};
