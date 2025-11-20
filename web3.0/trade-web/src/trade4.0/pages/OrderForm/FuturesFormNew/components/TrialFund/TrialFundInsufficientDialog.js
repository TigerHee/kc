/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import Dialog from '@mui/Dialog';

import { _t, styled } from '../../builtinCommon';
import { useTrialFundInsufficientDialog } from '../../builtinHooks';

const KuxDialog = styled(Dialog)`
  .KuxDialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .KuxButton-outlinedSizeLarge {
    margin-right: 12px;
  }
  .KuxButton-root {
    &:not(:last-child) {
      margin-right: 12px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxDialog-body {
      margin: 0 28px;
    }
  }
`;

const DialogContent = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
`;

const TrialFundInsufficientDialog = () => {
  const {
    trialFundInsufficientVisible,
    onTrialFundInsufficientDialog,
  } = useTrialFundInsufficientDialog();

  const handleConfirm = useCallback(() => {
    onTrialFundInsufficientDialog(false);
  }, [onTrialFundInsufficientDialog]);

  return (
    <KuxDialog
      open={trialFundInsufficientVisible}
      title={_t('kyc.auth.title')}
      onCancel={handleConfirm}
      onOk={handleConfirm}
      cancelText={null}
      okText={_t('security.form.btn')}
      maskClosable
    >
      <DialogContent>{_t('trialFund.insufficient')}</DialogContent>
    </KuxDialog>
  );
};

export default React.memo(TrialFundInsufficientDialog);
