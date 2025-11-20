/**
 * Owner: willen@kupotech.com
 */
import { uploadImg } from 'services/authentication';
import { getBase64 } from 'helper';

export default {
  state: {
    fields: {},
    fieldLoading: {},
    validateStatus: {},
  },
  effects: {
    *upload({ type, payload: { file, id, uploadParams = {} }, callBack }, { call, put, select }) {
      const namespace = type.split('/')[0];
      const { fieldLoading } = yield select((state) => state[namespace]);
      yield put({
        type: 'update',
        payload: {
          fieldLoading: {
            ...fieldLoading,
            [id]: true,
          },
        },
      });
      try {
        const { data } = yield call(uploadImg, { file, ...uploadParams });
        const imgUrl = yield call(getBase64, file);
        // 上传后 再取拿一次最新数据
        const { fields: updatedFields, fieldLoading: updatedFieldLoading } = yield select(
          (state) => state[namespace],
        );
        yield put({
          type: 'update',
          payload: {
            fields: {
              ...updatedFields,
              [id]: {
                imgUrl,
                fileId: data,
              },
            },
            fieldLoading: {
              ...updatedFieldLoading,
              [id]: false,
            },
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            fieldLoading: {
              ...fieldLoading,
              [id]: false,
            },
          },
        });
        callBack(e.msg);
      }
    },
  },
};
