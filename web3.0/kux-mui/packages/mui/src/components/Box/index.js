/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';
import each from 'lodash-es/each';
import {
  space,
  color,
  typography,
  layout,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
} from 'styled-system';
import shouldForwardProp from '@styled-system/should-forward-prop'
import useClassNames from './useClassNames';

const BoxRoot = styled('div', {
  shouldForwardProp,
})(
  {
    boxSizing: 'border-box',
    minHeight: 0,
    minWidth: 0,
  },
  space,
  color,
  typography,
  layout,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
);

const Box = React.forwardRef(({ children, className, style, ...others }, ref) => {
  const screens = useResponsive();

  const responsiveArray = Object.keys(screens);

  const { length } = responsiveArray;

  const props = {
    style,
  };

  each(others, (propValue, propKey) => {
    if (typeof propValue === 'object') {
      for (let i = 0; i < length; i++) {
        const breakpoint = responsiveArray[i];
        if (screens[breakpoint] && propValue[breakpoint] !== undefined) {
          props[propKey] = propValue[breakpoint];
        }
      }
    } else {
      props[propKey] = propValue;
    }
  });

  const _classNames = useClassNames();

  return (
    <BoxRoot className={clsx(_classNames.root, className)} {...props} ref={ref}>
      {children}
    </BoxRoot>
  );
});

export default Box;
