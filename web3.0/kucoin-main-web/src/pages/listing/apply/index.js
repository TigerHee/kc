/**
 * Owner: tom@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { replace } from 'utils/router';
import StepForm from 'routes/Listing/StepForm';
import { useLocale } from '@kucoin-base/i18n';

export default () => {
  useLocale();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLogin) {
      dispatch({ type: 'listing/getSummary' });
    } else {
      replace('/listing');
    }
  }, [isLogin]);

  return <StepForm />;
};
