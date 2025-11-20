/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { ForgetPwdDrawer } from '@kucoin-biz/entrance';
// import { ForgetPwdDrawer } from '@remote/entrance';

export default () => {
  const dispatch = useDispatch();
  const { forgetPwdOpen } = useSelector((state) => state.app);
  const closeDrawer = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        forgetPwdOpen: false,
      },
    });
  }, [dispatch]);
  const openLogin = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        loginOpen: true,
      },
    });
  }, [dispatch]);
  return (
    <ForgetPwdDrawer
      anchor="right"
      onClose={closeDrawer}
      open={forgetPwdOpen}
      onSuccess={() => {
        closeDrawer();
        openLogin();
      }}
    />
  );
};
