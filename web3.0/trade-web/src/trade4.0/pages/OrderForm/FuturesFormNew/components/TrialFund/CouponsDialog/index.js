/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';

// import { trackClick } from 'utils/sensors';
// import { BONUS_CARD_SELECT } from 'sensorsKey/trialFund';

import Dialog from '@mui/Dialog';

import CouponDeductionCard from './CouponDeductionCard';
import CouponNotUseTips from './CouponNotUseTips';
import Header from './Header';
import TrialFundCard from './TrialFundCard';

import { _t, styled } from '../../../builtinCommon';
import { useTrialFundDialog, useSwitchTrialFund } from '../../../builtinHooks';

const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    max-width: 520px;
    max-height: 560px;
  }
  .KuxDialog-content {
    min-height: 260px;
  }
  .KuxDrawer-content {
    max-height: 80vh;
    padding-bottom: 88px;
  }
  .mobile-btn {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px 16px 20px;
    background: ${(props) => props.theme.colors.layer};
  }
`;

const TrialFundCardCls = styled(TrialFundCard)`
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
  }
`;

const CouponsDialog = () => {
  const [trialFundSelect, setTrialFundSelect] = useState(false);
  const { trialFundVisible, onTrialFundDialog } = useTrialFundDialog();
  const { switchTrialFund, onSwitchTrialFund } = useSwitchTrialFund();

  const handleClose = useCallback(() => {
    onTrialFundDialog(false);
  }, [onTrialFundDialog]);

  const handleConfirm = useCallback(() => {
    console.log('confirm --->', trialFundSelect);
    if (trialFundSelect !== switchTrialFund) {
      onSwitchTrialFund(trialFundSelect);
      // 埋点-点击卡券选择
      // trackClick([BONUS_CARD_SELECT, trialFundSelect ? '1' : '2']);
    }
    handleClose();
  }, [handleClose, onSwitchTrialFund, switchTrialFund, trialFundSelect]);

  // 更新 trialFundSelect 的选择状态
  useEffect(() => {
    setTrialFundSelect(switchTrialFund);
  }, [trialFundVisible, switchTrialFund]);

  return (
    <DialogWrapper
      open={trialFundVisible}
      onClose={handleClose}
      destroyOnClose
      title={_t('select.coupons')}
      onOk={handleConfirm}
      cancelText={_t('cancel')}
      okText={_t('security.form.btn')}
    >
      <Header />
      <TrialFundCardCls checked={trialFundSelect} onChange={setTrialFundSelect} />
      <CouponDeductionCard />
      <CouponNotUseTips />
    </DialogWrapper>
  );
};

export default React.memo(CouponsDialog);
