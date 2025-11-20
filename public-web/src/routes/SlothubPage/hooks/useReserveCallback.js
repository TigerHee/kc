/*
 * @owner: borden@kupotech.com
 * @desc: 预约之后的通用处理逻辑
 */
import { useSnackbar } from '@kux/mui';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IS_RESERVED_KEY } from 'routes/SlothubPage/constant';
import { _t } from 'src/tools/i18n';
import storage from 'utils/storage';

export default function useReserveCallback() {
  const dispatch = useDispatch();
  const { message } = useSnackbar();

  const reserveCallback = useCallback(() => {
    const isReserved = storage.getItem(IS_RESERVED_KEY);
    if (isReserved === true) {
      message.success(_t('9f3a81d668cf4000a661'));
    } else {
      dispatch({
        type: 'slothub/update',
        payload: {
          reserveVisible: true,
        },
      });
      storage.setItem(IS_RESERVED_KEY, true);
    }
  }, []);

  return reserveCallback;
}
