/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useResponsive } from 'hooks/useResponsive';

const withResponsive = (WrappedComponent) => {
  const Wrapper = React.forwardRef((props, ref) => {
    const responsive = useResponsive();
    return <WrappedComponent {...props} ref={ref} responsive={responsive} />;
  });
  Wrapper.displayName = 'withResponsive';
  return Wrapper;
};

export default withResponsive;
