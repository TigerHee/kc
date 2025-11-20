/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import { styled } from '@kux/mui/emotion';

import { trackClick } from 'src/utils/ga';

import KuxAlert from '@mui/Alert';
import AdaptiveModal from '@mui/Dialog';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { MARGIN_MODE_TIPS } from '@/meta/futuresSensors/trade';
import { _t } from '@/pages/Futures/import';

import { useMarginModeExplainDialogProps, useCanChangeMarginMode } from './hooks';

const Dialog = styled(AdaptiveModal)`
  .KuxDialog-body{
    max-width: 520px;
  }
`;

const ContentBox = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
`;

const Alert = styled(KuxAlert)`
  margin: 0 0 24px;
`;

const MarginModeExplainDialog = () => {
  const symbol = useGetCurrentSymbol();
  const { explainDialogVisible, onExplainDialogChange } = useMarginModeExplainDialogProps();

  const { getCanChangeMarginModeForSymbol, getHasOrders } = useCanChangeMarginMode();

  const handleClose = useCallback(() => {
    onExplainDialogChange(false);
    trackClick([MARGIN_MODE_TIPS, '2']);
  }, [onExplainDialogChange]);

  const handleOk = useCallback(() => {
    onExplainDialogChange(false);
    trackClick([MARGIN_MODE_TIPS, '1']);
  }, [onExplainDialogChange]);

  return (
    <Dialog
      open={explainDialogVisible}
      disableBackdropClick
      onClose={handleClose}
      onOk={handleOk}
      className={'futures-explain-dialog'}
      okText={_t('security.form.btn')}
      cancelText={null}
      title={_t('futures.marginMode.title')}
    >
      {!getCanChangeMarginModeForSymbol(symbol, getHasOrders()) ? (
        <Alert showIcon type="warning" title={_t('futures.notChange.marginMode.tips')} />
      ) : null}
      <ContentBox>
        <div className="title">{_t('futures.cross.label')}</div>
        <div>{_t('futures.cross.explain')}</div>
      </ContentBox>
      <ContentBox>
        <div className="title">{_t('futures.isolated.label')}</div>
        <div>{_t('futures.isolated.explain')}</div>
      </ContentBox>
    </Dialog>
  );
};

export default React.memo(MarginModeExplainDialog);
