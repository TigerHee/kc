/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useDispatch, useSelector } from 'dva';

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);

  React.useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({ type: 'app/init' });
      });
    }
  }, [dispatch, isInApp]);

  return <React.Fragment>{children}</React.Fragment>;
};