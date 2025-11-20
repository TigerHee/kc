/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export default (SvgComponent) => {
  return React.forwardRef((props, ref) => {
    const { color = 'currentColor', size = '1em', style = {}, ...otherProps } = props;
    return (
      <SvgComponent
        ref={ref}
        fill={color}
        width={size}
        height={size}
        style={{ ...style }}
        {...otherProps}
      />
    );
  });
};
