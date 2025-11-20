/**
 * Owner: june.lee@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Premarket from 'src/components/Premarket';
import { usePathRedirect } from 'src/components/Premarket/hooks';

export default () => {
  usePathRedirect();
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch({
        type: 'aptp/resetCurrencyInfo',
      });
    };
  }, [dispatch]);
  return <Premarket />;
};
