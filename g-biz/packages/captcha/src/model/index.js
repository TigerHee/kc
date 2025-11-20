/**
 * Owner: melon@kupotech.com
 */
import * as services from '../services';

import { recaptchaKey, geeTestKey, image, MODEL_NAMESPACE } from '../config';

export default {
  namespace: MODEL_NAMESPACE,
  state: {
    googleCaptchaVisible: false,
    captchaInit: {},
    imageCaptchaVisible: false,
    imgSrc: '',
    checkLoading: false,
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 人机校验初始化
    *captchaInit({ payload }, { call, put }) {
      try {
        const { bizType } = payload;
        // 版本号versionNo用于进行新旧人机校验版本隔离
        const versionNo = 20221008;
        const { data = {} } = yield call(services.captchaInit, { bizType, versionNo });
        const { captchaType } = data;

        if (captchaType === recaptchaKey) {
          yield put({
            type: 'update',
            payload: { googleCaptchaVisible: true },
          });
        } else if (captchaType === geeTestKey) {
          yield put({
            type: 'update',
            payload: { googleCaptchaVisible: false },
          });
        } else if (captchaType === image) {
          yield put({
            type: 'update',
            payload: {
              googleCaptchaVisible: false,
              imageCaptchaVisible: true,
            },
          });
          const { challenge = '' } = data || {};
          // const challenge = 'b5ad5f1e9a8349bfb760a137cd0f7e9b';
          yield put({
            type: 'getImage',
            payload: { challenge },
          });
        }

        yield put({
          type: 'update',
          payload: { captchaInit: data },
        });
      } catch (error) {
        const { handleError } = payload;
        handleError();
      }
    },
    // 校验人机
    *captchaVerify({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: {
          checkLoading: true,
        },
      });
      return yield call(services.captchaValidate, payload);
    },
    // 关闭校验
    *captchaClose(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          googleCaptchaVisible: false,
          captchaInit: {},
          imageCaptchaVisible: false,
          imgSrc: '',
          checkLoading: false,
        },
      });
    },
    // 校验成功
    *captchaSuccess(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          googleCaptchaVisible: false,
          captchaInit: {},
          imageCaptchaVisible: false,
          imgSrc: '',
          checkLoading: false,
        },
      });
    },
    // 获取校验图片
    *getImage({ payload }, { call, put }) {
      const { challenge = '' } = payload || {};
      const { success, data } = yield call(services.getImageVer, { challenge });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            imgSrc: `data:image/png;base64,${data}`,
          },
        });
      }
    },
  },
};
