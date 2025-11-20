/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import { ICArrowRightOutlined } from '@kux/icons';

import Button from '@mui/Button';
import AdaptiveModal from '@mui/Dialog';

import { _t, styled } from '@/pages/Futures/import';


import { useMarginModeMobileDialogProps } from './hooks';

const FooterWrapper = styled.div`
  padding: 16px;
`;

const SwitchItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  font-size: 16px;
  .label {
    font-weight: 500;
    line-height: 1.3;
  }
`;

const MarginModeMSwitchDialog = ({ handleSetMarginCross, handleSetMarginIsolated }) => {
  const { modeDialogVisible, onMarginModeDialogChange } = useMarginModeMobileDialogProps();

  const handleCloseDialog = useCallback(() => {
    onMarginModeDialogChange(false);
  }, [onMarginModeDialogChange]);

  return (
    <AdaptiveModal
      open={modeDialogVisible}
      disableBackdropClick
      onClose={handleCloseDialog}
      okText={null}
      cancelText={null}
      footer={null}
      title={_t('futures.setAs')}
      destroyOnClose
    >
      <SwitchItems onClick={handleSetMarginCross}>
        <div className="label">{_t('futures.cross')}</div>
        <ICArrowRightOutlined />
      </SwitchItems>
      <SwitchItems onClick={handleSetMarginIsolated}>
        <div className="label">{_t('futures.isolated')}</div>
        <ICArrowRightOutlined />
      </SwitchItems>
      <FooterWrapper>
        <Button type="primary" variant="contained" onClick={handleCloseDialog} fullWidth>
          {_t('cancel')}
        </Button>
      </FooterWrapper>
    </AdaptiveModal>
  );
};

export default React.memo(MarginModeMSwitchDialog);
