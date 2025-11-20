import {useMemoizedFn} from 'ahooks';
import React, {forwardRef} from 'react';

import {useWithLoginFn} from './useWithLoginFn';

const withAuth = Component =>
  forwardRef(({onPress, onFocus, ...restProps}, ref) => {
    const handleLogin = useMemoizedFn((...rest) => {
      onPress?.(...rest);
      onFocus?.(...rest);
    });

    const {run} = useWithLoginFn(handleLogin);

    return <Component onPress={run} onFocus={run} ref={ref} {...restProps} />;
  });

export default withAuth;
