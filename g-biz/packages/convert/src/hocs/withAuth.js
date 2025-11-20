/*
 * @owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import { isFunction } from 'lodash';
import { useEventCallback } from '@kux/mui';
import useContextSelector from '../hooks/common/useContextSelector';
import pushTo from '../utils/pushRouter';

const withAuth = (Component) =>
  memo(({ onClick, ...restProps }) => {
    const loginFn = useContextSelector((state) => state.loginFn);
    const isLogin = useContextSelector((state) => Boolean(state.user));

    const handleClick = useEventCallback((e) => {
      if (!isLogin) {
        e.preventDefault();
        if (isFunction(loginFn)) {
          loginFn();
        } else {
          pushTo('/ucenter/signin');
        }
      } else if (onClick) {
        onClick();
      }
    });

    return <Component onClick={handleClick} {...restProps} />;
  });

export default withAuth;
