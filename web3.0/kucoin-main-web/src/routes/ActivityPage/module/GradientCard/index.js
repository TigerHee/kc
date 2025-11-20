/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import style from './style.less';

const GradientCard = ({ className, children, panelStyle }) => {
  return (
    <div className={`${className || ''} ${style.card}`} style={panelStyle}>
      {children}
    </div>
  );
};

export default GradientCard;
