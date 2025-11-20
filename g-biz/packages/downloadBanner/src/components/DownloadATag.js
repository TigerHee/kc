/**
 * Owner: iron@kupotech.com
 */
import React from 'react';

export default ({ children, onClick, ...restProps }) => {
  return (
    <a rel="nofollow" onClick={onClick} {...restProps}>
      {children}
    </a>
  );
};
