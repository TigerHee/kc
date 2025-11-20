import { goVerify } from '@kucoin-gbiz-next/verification';
import { Modal, toast, useTheme } from '@kux/design';
import { useState } from 'react';
import { deletePasskeyApi } from 'src/services/ucenter/passkey';
import { _t } from 'src/tools/i18n';
import deleteIconDarkSrc from 'static/account/security/passkey/passkey-delete.dark.svg';
import deleteIconSrc from 'static/account/security/passkey/passkey-delete.svg';
import { PASSKEY_BIZ_TYPE, PASSKEY_OPERATE_TYPE } from '../constants';
import * as styles from './styles.module.scss';

export default function PasskeyDeleteDialog({ open, values, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async () => {
    try {
      const { id } = values;
      goVerify({
        bizType: PASSKEY_BIZ_TYPE.UNBIND_PASSKEY,
        businessData: {
          operateType: PASSKEY_OPERATE_TYPE.UNBIND_PASSKEY,
        },
        onSuccess: async (res) => {
          setLoading(true);
          try {
            await deletePasskeyApi(
              { id },
              {
                headers: res?.headers,
              },
            );
            onSuccess();
          } catch (error) {
            toast.error(error?.msg ?? error?.message);
          } finally {
            setLoading(false);
          }
        },
        onCancel,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Modal
      isOpen={open}
      okText={_t('confirm')}
      onOk={handleSubmit}
      okButtonProps={{ loading }}
      cancelText={_t('c43851970c1e4000a0a2')}
      onCancel={onCancel}
      onClose={onCancel}
      className={styles.modal}
    >
      <div className={styles.content}>
        <img src={isDark ? deleteIconDarkSrc : deleteIconSrc} alt="delete icon" />
        <div>{_t('8a5a6d1461e44000acbb')}</div>
        <div>{_t('03dc6423e1024000a5c0')}</div>
      </div>
    </Modal>
  );
}
