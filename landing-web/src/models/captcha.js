/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { captchaInit, captchaValidate, getImageVer } from 'services/captcha';
import Toast from 'components/Toast';
import base from 'utils/common_models/base';

export default extend(base, {
  namespace: 'captcha',

  state: {
    captcha_enable: false,
    captcha_verify: false,
    captcha_config: null,
    captcha_ready: false,
    captcha_bizType: '',
    captchaType: '',
    imageTimestamp: '',
    imageVerVisible: false,
    imageSrc: '',
  },
  reducers: {
    captcha_verify(state) {
      const { captcha_ready } = state;
      if (captcha_ready) {
        return {
          ...state,
          captcha_verify: true,
        };
      } else {
        return {
          ...state,
        };
      }
    },
    captcha_clear(state, { resetReady = true }) {
      return {
        ...state,
        captcha_config: null,
        captcha_verify: false,
        ...(resetReady
          ? {
            captcha_ready: false,
          }
          : null),
      };
    },
    captcha_ready(state, { payload = {} }) {
      const { captcha_verify = false } = payload;
      return {
        ...state,
        captcha_verify,
        captcha_ready: true,
      };
    },
  },
  effects: {
    *captcha_start(
      {
        type,
        payload: { bizType = '' },
      },
      { put },
    ) {
      console.log('init gee ', type);
      yield put({
        type: 'captcha_init',
        payload: {
          captcha_enable: true,
          captcha_verify: false,
          bizType,
        },
      });
    },

    *captcha_init({ payload = {}, type }, { call, put, select }) {
      const modelName = type.split('/')[0];
      const { captcha_bizType } = yield select(state => state[modelName]);

      const { bizType } = payload;
      console.log('init gee test', bizType);
      let result = {};
      // 极验接口失败之后，弹出提示
      try {
        result = yield call(captchaInit, bizType || captcha_bizType);
        if (result && result.code !== '200') {
          throw new Error('接口失败');
        } else if (!result) {
          throw new Error('请求失败');
        }
      } catch (e) {
        Toast({
          type: 'error',
          msg: '极验初始化失败，请刷新页面重试'
        })
        return;
      }
      const { data } = result;
      data.captchaType = window.cpty || data.captchaType;
      if (data.captchaType === 'geetest') {
        yield put({
          type: 'update',
          payload: {
            ...payload,
            captcha_config: data,
            captcha_gt: data.gt,
            captcha_bizType: bizType || captcha_bizType,
            captchaType: data.captchaType,
          },
        });
      } else if (data.captchaType === 'recaptcha') {
        console.log('init reCAPTCHA');
        yield put({
          type: 'update',
          payload: {
            ...payload,
            captcha_bizType: bizType || captcha_bizType,
            captchaType: data.captchaType,
            reCAPTCHA_time: Date.now(),
          },
        });
      } else if (data.captchaType === 'image') {
        yield put({
          type: 'update',
          payload: {
            ...payload,
            captcha_bizType: bizType || captcha_bizType,
            captchaType: data.captchaType,
            challenge: data.challenge,
            imageVerVisible: true,
          },
        });
        yield put({
          type: 'getImage',
        });
      }

      return data;
    },

    *getImage(_, { select, call, put }) {
      const { challenge } = yield select(state => state.captcha);
      try {
        const { success, data } = yield call(getImageVer, { challenge });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              imageSrc: `data:image/png;base64,${data}`,
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            imageVerVisible: false,
          },
        });
        throw e;
      }
    },

    *captcha_retry(
      {
        payload: { bizType = '' },
      },
      { put },
    ) {
      yield put({ type: 'captcha_clear' });
      yield put({
        type: 'captcha_init',
        payload: {
          bizType,
        },
      });
    },

    // 校验极验结果
    *captcha_verifyIfOk({ type, payload }, { call, select, put }) {
      const modelName = type.split('/')[0];

      // 图片验证需要这个参数
      const { challenge } = yield select(state => state.captcha);

      const { captcha_gt, captcha_bizType } = yield select(state => state[modelName]);
      const { validate, captchaType = 'GEETEST', bizType = null } = payload;
      const captchaModel = yield select(state => state.captcha);
      // const secret = captchaType === 'GEETEST' ? captcha_gt:

      const map = {
        geetest: 'GEETEST',
        recaptcha: 'reCAPTCHA',
        image: 'IMAGE',
      };
      try {
        const result = yield call(captchaValidate, {
          bizType: bizType || captcha_bizType,
          captchaType: map[captchaType || captchaModel.captchaType],
          // captchaType: captchaType || captchaModel.captchaType,
          response: typeof validate === 'object' ? JSON.stringify(validate) : validate,
          // response: JSON.stringify(validate),
          secret: challenge,
          //
        });
        yield put({
          type: 'update',
          payload: {
            captcha_gt: null,
            captcha_bizType: null,
          },
        });

        if (captchaType === 'image') {
          yield put({
            type: 'captcha/update',
            payload: {
              imageVerVisible: false,
            },
          });
        }

        return result;
      } catch (e) {
        if (captchaType === 'image') {
          yield put({
            type: 'captcha/getImage',
          });
        }
        throw e;
      }
    },
  },
});
