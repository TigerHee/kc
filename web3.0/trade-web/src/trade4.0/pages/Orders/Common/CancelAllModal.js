/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { useResponsive, useTheme } from '@kux/mui';
import Dialog from '@mui/Dialog';
import Button from '@mui/Button';
import infoDark from '@/assets/orders/info-dark.png';
import infoLight from '@/assets/orders/info-light.png';
import { _t } from 'utils/lang';
import { CancelModalWrapper } from './style';

const CancelAllModal = (props) => {
  const {
    visible,
    onOK,
    onCancel,
  } = props;
  const { sm } = useResponsive();
  const { theme } = useTheme();

  return (
    <Dialog
      open={visible}
      onCancel={onCancel}
      onOK={onOK}
      footer={null}
      header={null}
    >
      <CancelModalWrapper className={!sm ? 'xs' : ''}>
        <img src={theme === 'dark' ? infoDark : infoLight} />
        <div className="desc">{_t('2fnpo2ViyRP55614YvvQRC')}</div>
        <div className="buttonWrapper">
          <Button size="large" type="default" variant="outlined" onClick={onCancel}>{_t('cancel')}</Button>
          <Button size="large" variant="contained" onClick={onOK}>{_t('confirm')}</Button>
        </div>
      </CancelModalWrapper>
    </Dialog>
  );
};

export default CancelAllModal;
