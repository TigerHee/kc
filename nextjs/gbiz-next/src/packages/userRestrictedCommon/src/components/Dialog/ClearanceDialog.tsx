/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
import BaseDialog, { PrivacyPolicy } from './BaseDialog';
import { composeUrl } from '../../utils';
import { Notice, UserInfo } from '../../types';
import Alert from '../Alert';

interface Props {
  notice?: Notice;
  onClose: () => void;
  onOk: () => void;
  visible: boolean;
  userInfo?: UserInfo;
}

const ClearanceDialog: React.FC<Props> = ({ notice, onClose, onOk, visible, userInfo }) => {
  const { buttonAgree, buttonRefuse, content, title, buttonAgreeWebUrl, buttonRefuseWebUrl } = notice || {};

  const handleCancel = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_CLEARANCE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonRefuseWebUrl)));
    }
  }, [userInfo, buttonRefuseWebUrl, onClose]);

  const handleOk = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_CLEARANCE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonAgreeWebUrl)));
    }
  }, [userInfo, buttonAgreeWebUrl, onOk]);

  return (
    <Alert title={title} visible={visible} onClose={handleCancel} okText={buttonAgree} onOk={handleOk} cancelText={buttonRefuse}>
      {content}
      <PrivacyPolicy showDefaultPolicy />
    </Alert>
  );
};

export default ClearanceDialog;
