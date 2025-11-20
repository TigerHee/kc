/**
 * Owner: willen@kupotech.com
 */
import { selfTransfer } from 'services/assets';
import { _t } from 'tools/i18n';

export default {
  effects: {
    *transfer({ payload: { params } }, { call, put }) {
      const { success } = yield call(selfTransfer, params);
      if (success) {
        yield put({
          type: 'app/setToast',
          payload: { message: _t('operation.succeed'), type: 'success' },
        });
      }
    },
  },
};
