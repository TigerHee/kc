/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
import { useTheme } from '@kux/mui-next';
import BaseDialog from '../BaseDialog';
import { composeUrl } from '../../../utils';
import logo from '../../../asset/AccountTransferTips.svg';
import logoDark from '../../../asset/AccountTransferTipsDark.svg';
import { Notice, UserInfo } from '../../../types';

interface Props {
  notice?: Notice;
  userInfo?: UserInfo;
  onClose: () => void;
  onOk: () => void;
  visible: boolean;
  bizType?: string;
}

const AccountTransferDialog: React.FC<Props> = ({ notice, userInfo, onClose, onOk, visible, bizType }) => {
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
    if (bizType && userInfo?.lastLoginAt) {
      storage.setItem(bizType, `${userInfo.lastLoginAt}`);
    }
  };

  const handleCancel = useCallback(() => {
    setStorage();
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonRefuseWebUrl)));
    }
  }, [buttonRefuseWebUrl, bizType, userInfo, onClose]);

  const handleOk = useCallback(() => {
    setStorage();
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.replace(addLangToPath(composeUrl(buttonAgreeWebUrl)));
    }
  }, [buttonAgreeWebUrl, bizType, userInfo, onOk]);

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
      closable={closable ?? true}
      icon={icon}
    />
  );
};

export default AccountTransferDialog;

