/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'app/_detectPlatform' });
  }, []);

  return props.children;
};
