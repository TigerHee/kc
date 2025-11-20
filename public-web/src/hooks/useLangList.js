/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'app/pullLangList',
    });
  }, [dispatch]);
};
