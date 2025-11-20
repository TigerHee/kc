/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t } from 'src/utils/lang';
import { CloseIcon, InfoContent, InfoHeader, InfoModal } from './StyledComps';

const InfoDialog = ({ visible, onClose }) => {
  return (
    <InfoModal
      header={null}
      footer={null}
      maskClosable
      open={visible}
      onCancel={onClose}
      classNames={{ content: 'info-content' }}
      rootProps={{ style: { zIndex: 1080 } }}
    >
      <InfoHeader>
        <CloseIcon onClick={onClose} />
        <h2>{_t('mDQ7SDykrxucTksBWjpd3m')}</h2>
      </InfoHeader>
      <InfoContent>
        <p>{_t('nVF5qkchSaWziMeAbpLSyo', { num: 10 })}</p>
        <p>{_t('9Ve4pa6TSQPH9cUiTzpX7g')}</p>
        <p>{_t('j4CH1fCfTz9U23MBuJywXj')}</p>
        <p>{_t('2YqPxhN51tChgFZ7qyqgT1')}</p>
      </InfoContent>
    </InfoModal>
  );
};

export default InfoDialog;
