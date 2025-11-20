/*
 * @owner: borden@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import useLoginDrawer from '@/hooks/useLoginDrawer';

const withAuth = (Component) => memo(({ onClick, ...restProps }) => {
  const { open, isLogin } = useLoginDrawer();

  const handleClick = useCallback((...rest) => {
    if (!isLogin) {
      open();
      return;
    }

    if (onClick) {
      onClick(...rest);
    }
  }, [isLogin, onClick]);

  return <Component onClick={handleClick} {...restProps} />;
});

export default withAuth;
