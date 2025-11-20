/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import { searchToJson } from 'helper';
import { getBackgroundUrl } from 'services/ucenter/getOption';
import * as RLservice from 'services/ucenter/login';
import { addLangToPath } from 'tools/i18n';
import { getBgUrl } from 'utils/loginUtils';
import storage from 'utils/storage';
import captcha from './captcha';

const wait = (delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

const tranType = (loginType = 'email') => {
  const map = {
    mobile: 'phone',
    email: 'email',
  };
  return `${map[loginType].toUpperCase()}_LOGIN`;
};

export default extend(captcha, {
  namespace: 'login',

  state: {
    // 登录
    l_account: '',
    l_password: '',
    l_vcode: '',
    l_area_code: '',
    lock_get_code: false,
    l_token: '',

    safeWords: '',
    signUpBG_pc: '',
    signUpBG_h5: '',
    loginBG_pc: '',
    loginBG_h5: '',
  },

  subscriptions: {
    setupLogin({ dispatch }) {
      // eslint-disable-line
      const curLoginOpts = storage.getItem('curLoginOpts');
      if (!curLoginOpts) {
        return;
      }
      dispatch({
        type: 'save',
        payload: {
          l_account: curLoginOpts[curLoginOpts.type === 'mobile' ? 'phone' : 'email'],
          l_area_code: curLoginOpts.countryCode || (IS_INSIDE_WEB ? '86_CN' : ''),
          captcha_bizType: curLoginOpts.bizType,
        },
      });
    },
  },

  effects: {
    // 如果用户已经登录，那么进入当前的路由就跳转到首页去
    *checkLocation(action, { select }) {
      const { user } = yield select((state) => state.user);
      console.log('checkLocation');
      if (user) {
        window.location.href = addLangToPath('/');
      }
    },

    *setFormItem({ payload }, { put }) {
      const { val, name, type } = payload;
      const prefix = type === 'register' ? 'r' : 'l';
      yield put({
        type: 'save',
        payload: {
          [`${prefix}_${name}`]: val,
        },
      });
    },
    *pullUserInfo(action, { put, select, fork }) {
      const currency = yield select((state) => state.currency);
      yield fork(put, {
        type: 'user/pullUser',
        payload: {
          currency: currency.currency,
        },
      });
    },

    *sec_get_code(action, { call, select, put }) {
      const { l_token, loginType } = yield select((state) => state.login);

      let result = null;

      try {
        result = yield call(RLservice.getLoginSMSValidationCode, l_token);
        console.log(result);
        if (result && result.code === '200') {
          yield put({ type: 'app/setToast', payload: { message: result.msg, type: 'success' } });
        }
      } catch (e) {
        result = e;
        if (e.code === '40011') {
          yield put({
            type: 'captcha/captcha_init',
            payload: {
              bizType: tranType(loginType),
            },
          });
        } else {
          yield put({
            type: 'app/setToast',
            payload: { message: e.msg || 'ERROR', type: 'error' },
          });
        }
      }

      return result;
    },
    *checkIfBackToSome() {
      // const { search, hash } = window.location;
      const query = searchToJson();
      if (query.back && window._CHECK_BACK_URL_IS_SAFE_(query.back)) {
        window.location.href = query.back;
        yield wait(1500);
      }
    },
    *getBackgroundUrl({ payload }, { call, put }) {
      try {
        const reuslt = yield call(getBackgroundUrl, payload);
        const { success, data } = reuslt;
        if (success) {
          const {
            signUpBG_pc,
            signUpBG_pc_default,
            signUpBG_h5,
            signUpBG_h5_default,
            loginBG_pc,
            loginBG_pc_default,
            loginBG_h5,
            loginBG_h5_default,
          } = getBgUrl(data);
          yield put({
            type: 'save',
            payload: {
              signUpBG_pc: signUpBG_pc || signUpBG_pc_default,
              signUpBG_h5: signUpBG_h5 || signUpBG_h5_default,
              loginBG_pc: loginBG_pc || loginBG_pc_default,
              loginBG_h5: loginBG_h5 || loginBG_h5_default,
            },
          });
        }
      } catch (e) {
        console.log(e.msg || 'ERROR');
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
});
