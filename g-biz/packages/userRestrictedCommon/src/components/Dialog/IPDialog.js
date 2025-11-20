/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import BaseDialog from './BaseDialog';
import { composeUrl } from '../../utils';

export default ({ notice, onClose, onOk, visible, currentLang, bizType }) => {
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
    storage.setItem(`GBIZ_DIALOG_SHOW_TIMESTAMP_${bizType}`, `${Date.now()}`);
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonRefuseWebUrl), currentLang);
    }
  }, [buttonRefuseWebUrl, bizType]);

  const handleOk = useCallback(() => {
    // IP封禁弹窗点击直接关闭并记录关闭时间
    storage.setItem(`GBIZ_DIALOG_SHOW_TIMESTAMP_${bizType}`, `${Date.now()}`);
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonAgreeWebUrl), currentLang);
    }
  }, [buttonAgreeWebUrl, bizType]);

  return (
    <BaseDialog
      visible={visible}
      title={title}
      content={content}
      buttonAgree={buttonAgree}
      buttonRefuse={buttonRefuse}
      onCancel={handleCancel}
      onOk={handleOk}
      privacy={privacy}
      privacyUrl={privacyUrl}
      currentLang={currentLang}
      closable={closable ?? true}
    />
  );
};
