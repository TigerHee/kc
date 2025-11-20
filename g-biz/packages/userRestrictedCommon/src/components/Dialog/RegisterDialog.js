/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback } from 'react';
import BaseDialog from './BaseDialog';

export default ({ notice, onClose, onOk, visible }) => {
  const { buttonAgree, buttonRefuse, content, title } = notice || {};
  const handleCancel = useCallback(() => {
    // 新增封禁弹窗点击关闭并直接回到上一页面
    onClose();
    window.history.go(-1);
  }, []);

  const handleOk = useCallback(() => {
    // 新增封禁弹窗点击关闭并直接回到上一页面
    onOk();
    window.history.go(-1);
  }, []);

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
