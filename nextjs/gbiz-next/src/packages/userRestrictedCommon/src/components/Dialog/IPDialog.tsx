/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
// import BaseDialog from './BaseDialog';
import { composeUrl } from '../../utils';
import { Notice } from '../../types';
import Alert from '../Alert';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { jumpPage, PrivacyPolicy } from './BaseDialog';

interface Props {
  notice?: Notice;
  onClose: () => void;
  onOk: () => void;
  visible: boolean;
  bizType?: string;
}

const IPDialog: React.FC<Props> = ({ notice, onClose, onOk, visible, bizType }) => {
  const {
    buttonAgree,
    buttonRefuse,
    content,
    title,
    buttonRefuseWebUrl,
    buttonAgreeWebUrl,
    privacy,
    privacyUrl,
    closable, // 弹窗是否可关闭
  } = notice || {};

  const handleCancel = useCallback(() => {
    // IP封禁弹窗点击直接关闭并记录关闭时间
    if (bizType) {
      storage.setItem(`GBIZ_DIALOG_SHOW_TIMESTAMP_${bizType}`, `${Date.now()}`);
    }
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonRefuseWebUrl)));
    }
  }, [buttonRefuseWebUrl, bizType, onClose]);

  const handleOk = useCallback(() => {
    // IP封禁弹窗点击直接关闭并记录关闭时间
    if (bizType) {
      storage.setItem(`GBIZ_DIALOG_SHOW_TIMESTAMP_${bizType}`, `${Date.now()}`);
    }
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonAgreeWebUrl)));
    }
  }, [buttonAgreeWebUrl, bizType, onOk]);

  return (
    <Alert title={title} visible={visible} onClose={handleCancel} okText={buttonAgree} onOk={handleOk} cancelText={buttonRefuse} closable={closable}>
      {content}
      <PrivacyPolicy showDefaultPolicy={false} privacy={privacy} privacyUrl={privacyUrl} />
    </Alert>
  );
};

export default IPDialog;
