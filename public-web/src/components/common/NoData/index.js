/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import noData from 'static/global/no-data.svg';
import style from './style.less';

// 无数据
const NoData = ({ icon = noData, text }) => {
  if (!text) {
    return null;
  }
  const iconComp = icon ? (
    React.isValidElement(icon) ? (
      icon
    ) : (
      <img src={icon} className={style.icon} alt="" />
    )
  ) : null;
  return (
    <div className={style.empty}>
      {iconComp}
      {!!text && <span className={style.text}>{text}</span>}
    </div>
  );
};

export default NoData;
