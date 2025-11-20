/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
// import { Modal } from '@kux/design';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
import { composeUrl } from '../../../utils';
import { Notice, UserInfo } from '../../../types';
import Alert from '../../Alert';

interface Props {
  notice?: Notice;
  onClose: () => void;
  onOk: () => void;
  visible: boolean;
  userInfo?: UserInfo;
}

const ForceKYCDialog: React.FC<Props> = ({ notice, onClose, onOk, visible, userInfo }) => {
  const { title, content, buttonRefuse, buttonAgree, buttonAgreeWebUrl, buttonRefuseWebUrl } = notice || {};

  const handleCancel = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_FORCE_KYC_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonRefuseWebUrl)));
    }
  }, [userInfo, buttonRefuseWebUrl, onClose]);

  const handleOk = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_FORCE_KYC_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonAgreeWebUrl)));
    }
  }, [userInfo, buttonAgreeWebUrl, onOk]);

  return (
    <Alert title={title} visible={visible} okText={buttonAgree} onOk={handleOk} onClose={handleCancel} cancelText={buttonRefuse}>
      {content}
    </Alert>
  );
};

export default ForceKYCDialog;