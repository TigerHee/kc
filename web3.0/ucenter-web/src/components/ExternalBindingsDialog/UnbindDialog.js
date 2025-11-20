/**
 * Owner: tiger@kupotech.com
 */
import { Dialog, useSnackbar } from '@kux/mui';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { unbindExternal } from 'services/user';
import { _t } from 'tools/i18n';

export default ({ open, onCancel, curItem, onCheckValidate }) => {
  const { message } = useSnackbar();
  const dispatch = useDispatch();

  const handleOk = debounce(() => {
    const callback = () => {
      const { extPlatform } = curItem;
      unbindExternal({ extPlatform })
        .then((res) => {
          if (res?.success) {
            message.success(_t('t4EEuWMub59n2p4rJ4ZgMc'));
            dispatch({
              type: 'account_security/getExternalBindings',
            });
          }
        })
        .catch((err) => {
          err?.msg && message.error(err?.msg);
        });
    };

    onCancel();
    onCheckValidate(callback);
  }, 300);

  return (
    <Dialog
      title={_t('94JeGusfZS5Yo1tiHSnohP')}
      okText={_t('tppinNDGXBLetsiQdYRywH')}
      cancelText={null}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      style={{ margin: 16 }}
    >
      {_t('gMhW7Dk4MbThQrutLt8W27')}
    </Dialog>
  );
};
