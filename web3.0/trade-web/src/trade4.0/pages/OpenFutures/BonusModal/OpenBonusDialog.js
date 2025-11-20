/**
 * Owner: clyne@kupotech.com
 */
import React, { useState, useImperativeHandle, memo, forwardRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import bonusBg from '@/assets/openFutures/success.svg';

import { styled } from '@kux/mui/emotion';
import Dialog from '@/components/AdaptiveModal';
import TrialFunds from './TrialFunds';
import Welfare from './Welfare';

const styles = {};

const DialogContent = styled(Dialog)`
  .KuxDialog-content {
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
  }
`;

const ContentWrapper = styled.div`
  padding: 32px;
`;

const BgImg = styled.img`
  width: 100%;
`;

const BonusContentMap = {
  TRIAL_FUNDS: TrialFunds,
  DEDUCTION_COUPON: Welfare,
  DEFAULT: Welfare,
};

const OpenBonusDialog = ({ type }, ref) => {
  const [open, setOpen] = useState(false);
  const [bonusData, setBonusData] = useState({});

  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    setOpen(false);
    dispatch({
      type: 'app/update',
      payload: {
        quickOrderStatus: true,
      },
    });
  }, [dispatch]);

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setOpen(true);
      setBonusData(data);
    },
    close: () => {
      handleClose();
    },
  }));

  // 默认走DEFAULT 有奖励就渲染对应的
  const BonusContent = React.useMemo(() => {
    let Component = BonusContentMap.DEFAULT;
    if (bonusData && bonusData.rewards) {
      Component = BonusContentMap[bonusData.rewardType || 'DEDUCTION_COUPON'];
    }
    return <Component type={type} onClose={handleClose} bonusData={bonusData} />;
  }, [bonusData, handleClose, type]);

  return (
    <DialogContent
      open={open}
      footer={null}
      header={null}
      disableBackdropClick
      onClose={handleClose}
      className={styles.dialogBox}
    >
      <BgImg src={bonusBg} alt="bg" />
      <ContentWrapper>{BonusContent}</ContentWrapper>
    </DialogContent>
  );
};

export default memo(forwardRef(OpenBonusDialog));
