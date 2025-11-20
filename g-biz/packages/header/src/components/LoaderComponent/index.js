/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { namespace } from '../../Header/model';

const LoaderComponent = ({ children, show: visible, fallback }) => {
  const dispatch = useDispatch();
  const thunkLoaded = useSelector((state) => state[namespace].thunkLoaded);

  useEffect(() => {
    if (visible) {
      // 全局加载
      dispatch({
        type: `${namespace}/update`,
        payload: {
          thunkLoaded: true,
        },
      });
    }
  }, [visible, dispatch]);

  if (thunkLoaded || visible) {
    return children;
  }

  return <>{fallback}</>;
};

export default memo(LoaderComponent);
