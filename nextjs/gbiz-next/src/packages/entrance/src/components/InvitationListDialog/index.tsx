/**
 * Owner: sean.shi@kupotech.com
 */
import { Button, Dialog } from '@kux/mui';
import { useTranslation } from 'tools/i18n';
import { getTenantConfig } from '../../config/tenant';
import DialogWarningInfo from '../../../static/status-warning-light.svg';
import DialogWarningInfoDark from '../../../static/status-warning-dark.svg';
import useThemeImg from '../../hookTool/useThemeImg';
import styles from './index.module.scss';

interface InvitationListDialogProps {
  onClose?: () => void;
  visible: boolean;
}

export const InvitationListDialog = ({ onClose, visible }: InvitationListDialogProps) => {
  const { getThemeImg } = useThemeImg();
  const { t } = useTranslation('entrance');

  const handleClose = () => {
    onClose?.();
  };

  // 联系客服
  const handleContract = () => {
    window.open(getTenantConfig().signup.contactCustomer, '_blank');
  };

  return (
    <Dialog
      className={styles.dialogWrapper}
      open={visible}
      title={null}
      header={null}
      footer={null}
      onOk={null}
      onCancel={null}
      cancelText={null}
      okText={null}
      style={{ maxWidth: 400, width: '100%' }}
    >
      <div className={styles.dialogContentWrapper}>
        <div className={styles.imgWrap}>
          <img
            alt="dialog fail tip"
            src={getThemeImg({ light: DialogWarningInfo, dark: DialogWarningInfoDark })}
          />
        </div>
        <div className={styles.contentWrap}>{t('4e6447d650024000a90d')}</div>
        <section className={styles.operate}>
          <Button variant="outlined" onClick={handleClose}>
            {t('4c068400a77e4800a9b4')}
          </Button>
          <Button onClick={handleContract}>{t('2bc4fbea87ea4800a412')}</Button>
        </section>
      </div>
    </Dialog>
  );
};
