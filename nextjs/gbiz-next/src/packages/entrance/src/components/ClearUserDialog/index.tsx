/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import { Dialog, Button } from '@kux/mui';
import { getSiteConfig } from 'kc-next/boot';
import { useLang } from '../../hookTool';
import DialogFailInfo from '../../../static/dialog-fail-info.svg';
import DialogFailInfoDark from '../../../static/dialog-fail-info-dark.svg';
import useThemeImg from '../../hookTool/useThemeImg';
import addLangToPath from 'tools/addLangToPath';
import clsx from 'clsx';
import styles from './index.module.scss';

interface ClearUserDialogProps {
  onClose?: () => void;
  visible: boolean;
}

export const ClearUserDialog: React.FC<ClearUserDialogProps> = ({ onClose, visible }) => {
  const { getThemeImg } = useThemeImg();
  const { t: _t } = useLang();

  const handleClose = () => {
    onClose?.();
    window.location.href = addLangToPath(`${getSiteConfig().CL_SITE_HOST}/ucenter/signin`);
  };

  return (
    <Dialog
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
      <div className={clsx(styles.dialogContentWrapper)}>
        <div className={clsx(styles.imgWrap)}>
          <img alt="dialog fail tip" src={getThemeImg({ light: DialogFailInfo, dark: DialogFailInfoDark })} />
        </div>
        <div className={clsx(styles.tipTitle)}>{_t('80f8e92599e34000a551')}</div>
        <div className={clsx(styles.contentWrap)}>
          <div className={clsx(styles.contentItem)}>{_t('95b46490fd224000a72a')}</div>
          <div className={clsx(styles.contentItem)}>{_t('89a9001fafe54000a18f')}</div>
        </div>
        <div className={clsx(styles.operate)}>
          <Button onClick={handleClose}>{_t('c9af292c5e484000ab09')}</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ClearUserDialog;
