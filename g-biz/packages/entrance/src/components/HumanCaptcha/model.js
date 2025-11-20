/**
 * Owner: iron@kupotech.com
 */
import * as services from './service';

const geeTestKey = 'geetest';
const googleKey = 'recaptcha';
const image = 'image';

export default {
  state: {
    googleCaptchaVisible: false,
    captchInit: {},
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
    *captchaInit({ payload }, { call, put, take, race }) {
      const { bizType, onCallBack } = payload;
      const { data = {} } = yield call(services.captchaInit, { bizType });
      const { captchaType } = data;
      if (captchaType === googleKey) {
        yield put({
          type: 'update',
          payload: { googleCaptchaVisible: true, captchInit: data },
        });
      } else if (captchaType === geeTestKey) {
        yield put({
          type: 'update',
          payload: { googleCaptchaVisible: false, captchInit: data },
        });
      } else if (captchaType === image) {
        yield put({
          type: 'update',
          payload: { imageCaptchaVisible: true, captchInit: data },
        });
        const { challenge = '' } = data || {};
        yield put({
          type: 'getImage',
          payload: { challenge },
        });
      }
      const { success } = yield race({
        quite: take('captchaClose/@@end'),
        success: take('captchaSuccess/@@end'),
      });
      if (success) {
        yield put(onCallBack);
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
      return yield call(services.captchaVerify, payload);
    },
    // 关闭校验
    *captchaClose(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          googleCaptchaVisible: false,
          captchInit: {},
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
          captchInit: {},
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
