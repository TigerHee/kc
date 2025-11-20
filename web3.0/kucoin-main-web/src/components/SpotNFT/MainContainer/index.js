/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import cls from 'classnames';
import style from './style.less';

export default (props) => {
  const classNameProp = props.className || '';
  return <div className={cls(style.mainContainer, classNameProp)}>{props.children}</div>;
};
