/**
 * Owner: garuda@kupotech.com
 * 提取保证金
 */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  useShowWithdrawMargin,
  useGetWithdrawAvailable,
} from '@/hooks/futures/useOperatorMargin';

import ChangeRealLeverageDialog from './ChangeRealLeverageDialog';
import OperatorMarginDialog from './OperatorMarginDialog';

const OperatorMargin = () => {
  const showWithdrawMargin = useShowWithdrawMargin();
  const getWithdrawAvailable = useGetWithdrawAvailable();
  const isLogin = useSelector(state => state.user.isLogin);

  useEffect(() => {
    if (isLogin) {
      getWithdrawAvailable();
    }
  }, [getWithdrawAvailable, isLogin]);

  if (!showWithdrawMargin) {
    return null;
  }

  return (
    <>
      <OperatorMarginDialog />
      <ChangeRealLeverageDialog />
    </>
  );
};

export default React.memo(OperatorMargin);
