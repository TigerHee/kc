/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import Dialog from '@mui/Dialog';

import { styled, _t, addLangToPath, siteCfg } from '../../builtinCommon';
import { useTrialFundActivateDialog } from '../../builtinHooks';

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

const NotActivatedDialog = () => {
  const { trialFundActivateVisible, onTrialFundActivateDialog } = useTrialFundActivateDialog();

  const handleConfirm = useCallback(() => {
    window.location.href = addLangToPath(`${siteCfg.KUMEX_HOST}/bonus`);
  }, []);

  return (
    <KuxDialog
      open={trialFundActivateVisible}
      title={_t('kyc.auth.title')}
      onCancel={() => onTrialFundActivateDialog(false)}
      onOk={handleConfirm}
      cancelText={_t('cancel')}
      okText={_t('trialFund.goActivate')}
    >
      <DialogContent>{_t('trialFund.notActivate')}</DialogContent>
    </KuxDialog>
  );
};

export default React.memo(NotActivatedDialog);
