/**
 * Owner: tom@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import Listing from 'routes/Listing';
import { useLocale } from '@kucoin-base/i18n';

export default () => {
  useLocale();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLogin) {
      dispatch({ type: 'listing/getSummary' });
    }
  }, [isLogin]);

  return <Listing />;
};
