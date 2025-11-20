/*
 * @owner: borden@kupotech.com
 * @desc: click会带来url变更的，处理成a标签href属性，但阻止默认行为
 */
import { useEventCallback } from '@kux/mui';
import React from 'react';

const SeoLink = ({ onClick, children, ...otherProps }) => {
  const handleClick = useEventCallback((e) => {
    e.preventDefault();
    if (onClick) onClick(e);
  });

  return (
    <a onClick={handleClick} {...otherProps}>
      {children}
    </a>
  );
};

export default React.memo(SeoLink);
