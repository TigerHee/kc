/**
 * Owner: willen@kupotech.com
 */
import { Dialog } from '@kux/mui-next';
import React from 'react';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';
import NoticeIcon from '../../static/homepage/notice-warn.png';

interface ConfirmModalProps {
  title: string;
  display: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content: string;
}

export default function ConfirmModal({ title, display, onClose, onConfirm, content }: ConfirmModalProps) {
  const { t: _t } = useTranslation('notice-center');

  return (
    <Dialog
      header={null}
      open={display}
      maskClosable
      onCancel={onClose}
      cancelText={null}
      onOk={onConfirm}
      showCloseX={false}
      centeredFooterButton
      okText={_t('confirm')}
      className={styles.CusDialog}
    >
      <div className={styles.Content}>
        <img src={NoticeIcon} className={styles.NoticeImg} alt='notice-icon' width={136} height={136} />
        <div className={styles.Text}>{title}</div>
        <div className={styles.Des}>{content}</div>
      </div>
    </Dialog>
  );
}
