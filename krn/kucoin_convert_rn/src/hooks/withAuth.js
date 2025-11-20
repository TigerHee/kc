/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {forwardRef} from 'react';
import {useSelector} from 'react-redux';
import {openNative} from '@krn/bridge';

const withAuth = Component =>
  forwardRef(({onPress, onFocus, ...restProps}, ref) => {
    const isLogin = useSelector(state => state.app.isLogin);

    const handleLogin = (...rest) => {
      if (!isLogin) {
        openNative('/user/login');
        return;
      }

      onPress && onPress(...rest);
      onFocus && onFocus(...rest);
    };

    return (
      <Component
        onPress={handleLogin}
        onFocus={handleLogin}
        ref={ref}
        {...restProps}
      />
    );
  });

export default withAuth;
