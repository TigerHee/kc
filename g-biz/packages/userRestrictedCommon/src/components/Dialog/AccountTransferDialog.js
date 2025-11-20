/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import { useTheme } from '@kux/mui';
import BaseDialog from './BaseDialog';
import { composeUrl } from '../../utils';
import logo from '../../asset/AccountTransferTips.svg';
import logoDark from '../../asset/AccountTransferTipsDark.svg';

const AccountTransferDialog = ({
  notice,
  userInfo,
  onClose,
  onOk,
  visible,
  currentLang,
  bizType,
}) => {
  const theme = useTheme();
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

  const setStorage = () => {
    storage.setItem(bizType, `${userInfo?.lastLoginAt}`);
  };

  const handleCancel = useCallback(() => {
    setStorage();
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonRefuseWebUrl), currentLang);
    }
  }, [buttonRefuseWebUrl, bizType]);

  const handleOk = useCallback(() => {
    setStorage();
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonAgreeWebUrl), currentLang);
    }
  }, [buttonAgreeWebUrl, bizType]);

  const icon = theme.currentTheme === 'dark' ? logoDark : logo;

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
      icon={icon}
    />
  );
};

export default AccountTransferDialog;
