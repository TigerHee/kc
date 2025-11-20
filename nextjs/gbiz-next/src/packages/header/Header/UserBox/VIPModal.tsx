/**
 * Owner: lori@kupotech.com
 */
import React, { useCallback } from 'react';
import { Modal } from '@kux/design';
import { useTranslation } from 'tools/i18n';
import { kcsensorsClick } from '../../common/tools';

interface VIPModalProps {
  visible: boolean;
  onCancel: () => void;
}

const DidNotReceivedCode = (props: VIPModalProps) => {
  const { visible, onCancel } = props;
  const { t } = useTranslation('header');

  const handleOk = useCallback(() => {
    if (onCancel) {
      kcsensorsClick(['CheckDetails', '1']);
      onCancel();
    }
  }, [onCancel]);

  return (
    <Modal
      maskClosable
      title={t('Kc_VIPservice_open_title')}
      isOpen={visible}
      cancelText={null}
      onCancel={onCancel}
      onClose={onCancel}
      onOk={handleOk}
      okText={t('Kc_VIPservice_popup_button')}
    >
      <p>{t('Kc_VIPservice_popup_explain1')}</p>
      <p>{t('Kc_VIPservice_popup_explain2')}</p>
    </Modal>
  );
};

export default DidNotReceivedCode; 