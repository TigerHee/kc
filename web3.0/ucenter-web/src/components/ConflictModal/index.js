/**
 * Owner: willen@kupotech.com
 */
import { useMemo } from 'react';
import { connect } from 'react-redux';

import { push } from 'utils/router';

import { useLocale } from '@kucoin-base/i18n';
import { Dialog } from '@kux/mui';
import { _t } from 'tools/i18n';

const useForkMemo = (fn, deps) => {
  return useMemo(() => {
    return (...arg) => {
      fn(...arg);
    };
  }, deps);
};

function ConflictModal({ open, dispatch, isLogin }) {
  useLocale();
  const handleCancel = useForkMemo(() => {
    dispatch({
      type: 'user/update',
      payload: {
        conflictModal: false,
      },
    });
  }, []);
  const handleOk = useForkMemo(() => {
    handleCancel();
    if (isLogin) {
      push('/account/security/updatepwd');
    } else {
      push('/support');
    }
  }, [isLogin]);
  let content;
  let cancelText;
  let okText;
  if (isLogin) {
    content = _t('conflict.content1');
    cancelText = _t('conflict.cancel');
    okText = _t('conflict.pwd');
  } else {
    cancelText = null;
    content = _t('conflict.content2');
    okText = _t('conflict.contact');
  }
  return (
    <Dialog
      title={_t('conflict.title')}
      open={open}
      onCancel={handleCancel}
      cancelText={cancelText}
      onOk={handleOk}
      okText={okText}
    >
      {content}
    </Dialog>
  );
}

export default connect((state) => {
  const { isLogin, conflictModal } = state.user;
  return {
    open: conflictModal,
    isLogin,
  };
})(ConflictModal);
