/**
 * Owner: willen@kupotech.com
 */
import { Alert, Dialog, Input, styled, useSnackbar } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';

const ExtendAlert = styled(Alert)`
  margin-bottom: 20px;
  .KuxAlert-icon {
    width: 23px;
    margin-top: 1px;
  }
`;

const ExtendInput = styled(Input)`
  input {
    font-weight: 500;
    caret-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModifyNicknameModal = ({ open, onCancel }) => {
  const [name, setName] = useState('');
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((s) => s.loading);
  const dispatch = useDispatch();
  const { message } = useSnackbar();

  useEffect(() => {
    if (user?.nickname && open) {
      setName(user.nickname);
    }
  }, [user, open]);

  const onOk = async () => {
    if (!name || !name.trim().length) {
      message.error(_t('form.prefix.required'));
      return false;
    }
    if (name.trim().length > 24) {
      message.error(_t('form.prefix.checked'));
      return false;
    }
    await dispatch({ type: 'user/updateNickName', payload: { nickname: name } });
    message.success(_t('operation.succeed'));
    onCancel && onCancel();
  };

  return (
    <Dialog
      cancelText={null}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={user?.nickname ? _t('modify') : _t('setting')}
      okText={_t('save')}
      okButtonProps={{
        loading: loading.effects['user/updateNickName'],
      }}
    >
      <ExtendAlert type="info" title={_t('nickname.help')} />
      <ExtendInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        label={_t('nick.name')}
        size="xlarge"
      />
    </Dialog>
  );
};

export default ModifyNicknameModal;
