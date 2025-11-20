/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import BaseDialog from './BaseDialog';
import { composeUrl } from '../../utils';

export default ({ notice, onClose, onOk, visible, userInfo, currentLang }) => {
  const { buttonAgree, buttonRefuse, content, title, buttonAgreeWebUrl, buttonRefuseWebUrl } =
    notice || {};

  const handleCancel = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_CLEARANCE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonRefuseWebUrl), currentLang);
    }
  }, [userInfo, buttonRefuseWebUrl, currentLang]);

  const handleOk = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_CLEARANCE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonAgreeWebUrl), currentLang);
    }
  }, [userInfo, buttonAgreeWebUrl, currentLang]);

  return (
    <BaseDialog
      visible={visible}
      title={title}
      content={content}
      buttonAgree={buttonAgree}
      buttonRefuse={buttonRefuse}
      onCancel={handleCancel}
      onOk={handleOk}
      showDefaultPolicy
    />
  );
};
