/**
 * Owner: willen@kupotech.com
 */
import useTranslation from '@/hooks/useTranslation';
import { addLangToPath } from '@/tools/i18n';
import { Modal } from '@kux/design';
import React from 'react';
import { connect } from 'react-redux';

function ConflictModal({ open, dispatch, isLogin }) {
  const { t } = useTranslation();

  const handleCancel = React.useCallback(() => {
    dispatch({
      type: 'user/update',
      payload: {
        conflictModal: false,
      },
    });
  }, []);

  const handleOk = React.useCallback(() => {
    handleCancel();
    if (isLogin) {
      window.location.href = addLangToPath('/account/security/updatepwd');
    } else {
      window.location.href = addLangToPath('/support');
    }
  }, [isLogin, handleCancel]);

  // 如果弹窗不显示，直接返回null，避免不必要的渲染
  if (!open) {
    return null;
  }

  let content;
  let cancelText;
  let okText;

  if (isLogin) {
    content = t('conflict.content1');
    cancelText = t('conflict.cancel');
    okText = t('conflict.pwd');
  } else {
    cancelText = null;
    content = t('conflict.content2');
    okText = t('conflict.contact');
  }

  return (
    <Modal
      title={t('conflict.title')}
      isOpen={open}
      onClose={handleCancel}
      cancelText={cancelText}
      onOk={handleOk}
      okText={okText}
    >
      {content}
    </Modal>
  );
}

export default connect((state) => {
  const { isLogin, conflictModal } = state.user;
  return {
    open: conflictModal,
    isLogin,
  };
})(ConflictModal);
