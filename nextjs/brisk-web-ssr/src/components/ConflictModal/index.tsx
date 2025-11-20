/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Modal } from '@kux/design';
import { useUserStore } from '@/store/user';
import useTranslation from '@/hooks/useTranslation';
import { addLangToPath } from '@/tools/i18n';

export default function ConflictModal() {
  const { t } = useTranslation();
  const showConflictModal = useUserStore((state) => state.conflictModal);
  const isLogin = useUserStore((state) => state.isLogin);

  const handleCancel = React.useCallback(() => {
    useUserStore.setState({ conflictModal: false });
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
  if (!showConflictModal) {
    return null;
  }

  let content: string;
  let cancelText: string | null;
  let okText: string;

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
      isOpen={showConflictModal}
      onClose={handleCancel}
      cancelText={cancelText}
      onOk={handleOk}
      okText={okText}
    >
      {content}
    </Modal>
  );
}
