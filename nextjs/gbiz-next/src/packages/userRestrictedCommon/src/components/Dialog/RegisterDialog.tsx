/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback } from 'react';
import BaseDialog from './BaseDialog';
import { Notice } from '../../types';

interface Props {
  notice?: Notice;
  onClose: () => void;
  onOk: () => void;
  visible: boolean;
}

const RegisterDialog: React.FC<Props> = ({ notice, onClose, onOk, visible }) => {
  const { buttonAgree, buttonRefuse, content, title } = notice || {};

  const handleCancel = useCallback(() => {
    // 新增封禁弹窗点击关闭并直接回到上一页面
    onClose();
    window.history.go(-1);
  }, [onClose]);

  const handleOk = useCallback(() => {
    // 新增封禁弹窗点击关闭并直接回到上一页面
    onOk();
    window.history.go(-1);
  }, [onOk]);

  return (
    <BaseDialog
      visible={visible}
      title={title}
      content={content}
      buttonAgree={buttonAgree}
      // buttonRefuse={buttonRefuse}
      onCancel={handleCancel}
      onOk={handleOk}
      showDefaultPolicy
      closable={false}
    />
  );
};

export default RegisterDialog;
