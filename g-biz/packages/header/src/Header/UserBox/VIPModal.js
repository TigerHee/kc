/**
 * Owner: lori@kupotech.com
 */
import React, { useCallback } from 'react';
import { Dialog } from '@kux/mui';
import { useLang } from '../../hookTool';
import { kcsensorsClick } from '../../common/tools';

const DidNotReceiveCode = (props) => {
  const { visible, onCancel } = props;
  const { t } = useLang();

  const handleOk = useCallback(() => {
    if (onCancel) {
      kcsensorsClick(['CheckDetails', '1']);
      onCancel();
    }
  }, [onCancel]);

  return (
    <Dialog
      maskClosable
      title={t('Kc_VIPservice_open_title')}
      open={visible}
      cancelText={null}
      onCancel={onCancel}
      onOk={handleOk}
      okText={t('Kc_VIPservice_popup_button')}
    >
      <p>{t('Kc_VIPservice_popup_explain1')}</p>
      <p>{t('Kc_VIPservice_popup_explain2')}</p>
    </Dialog>
  );
};

export default DidNotReceiveCode;
