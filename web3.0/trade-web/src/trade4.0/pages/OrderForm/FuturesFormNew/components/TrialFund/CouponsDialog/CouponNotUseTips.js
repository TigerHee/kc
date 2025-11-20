/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import Alert from '@mui/Alert';

import { _t, styled } from '../../../builtinCommon';
import { useCurrentCoupon, useSwitchTrialFund } from '../../../builtinHooks';

const AlertBox = styled(Alert)`
  position: relative;
  display: flex;
  align-items: center;
`;

const CouponNotUseTips = () => {
  const { switchTrialFund } = useSwitchTrialFund();
  const currentCoupon = useCurrentCoupon();

  if (!switchTrialFund || !currentCoupon?.remainValidDays) return null;

  return <AlertBox showIcon type="warning" title={_t('coupon.notUse.tips')} />;
};

export default React.memo(CouponNotUseTips);
