/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import style from './style.less';

export default ({ baseHead, baseSubHead, children }) => {
  return (
    <React.Fragment>
      <div className={style.baseHead}>{baseHead}</div>
      {baseSubHead && <div className={style.baseSubHead}>{baseSubHead}</div>}
      <div className={style.baseContent}>{children}</div>
    </React.Fragment>
  );
};
