/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Dialog } from '@kufox/mui';
import style from './style.less';

const Tip = ({ children, title, ...rest }) => {
  return (
    <Dialog
      {...rest}
      className={style.root}
      title={
        <span className={style.title}>
          {title}
        </span>
      }
      okButtonProps={{
        className: style.okBtn,
      }}
    >
      <p className={style.content}>
        {children}
      </p>
    </Dialog>
  )
};

export default Tip;