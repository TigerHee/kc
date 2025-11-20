/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { cryptoPwd, removeSpaceSE } from 'helper';
import * as OPservice from 'services/ucenter/getOption';
import * as RLservice from 'services/ucenter/login';
import { getUtm } from 'utils/getUtm';
import storage from 'utils/storage';

const resolveContryCode = (code) => {
  return (code || '').replace(/_.*$/g, '');
};

export default extend(base, {
  namespace: 'register',

  state: {
    // 注册
    r_account: '',
    r_password: '',
    r_invite_code: '',
    r_vcode: '',
    r_area_code: IS_INSIDE_WEB ? '86_CN' : undefined,
    r_agrement: false,
    lock_get_code: false,
    type: 'email',

    sec_bizType: 'REGISTER',
    referInfo: null,
    welfare_data: null, // 默认为null，取该数据注意数据类型的容错
    welfare_pulled: false,
    assetReserve: {}, // 储备金信息
  },

  subscriptions: {
    setUpRegister({ dispatch }) {
      // @moved 迁移至ucenter/register 业务
      // dispatch({
      //   type: 'security_new/sec_init',
      //   payload: {
      //     bizType: 'REGISTER',
      //   },
      // });
    },
  },

  effects: {
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

    /** @deprecated 已移到G-BIZ */
    // 提交注册
    *register({ payload }, { call, select }) {
      const { r_account, r_password, r_area_code, r_vcode, r_invite_code, type } = yield select(
        (state) => state.register,
      );

      const rType = payload.type || type;
      const { otherOpts } = payload;
      let option = {
        code: r_vcode,
        referralCode: r_invite_code,
        password: cryptoPwd(r_password),
        timeZone: new Date().getTimezoneOffset() * 60,
      };

      // 第三方邀请码注册
      if (otherOpts && otherOpts.c && otherOpts.r) {
        option.thirdPartReferralCode = otherOpts.r;
        option.thirdPartClient = otherOpts.c;
      }
      // 渠道标识
      const utm = getUtm();
      option = { ...option, ...utm };

      if (rType === 'mobile') {
        // 手机号注册
        option = {
          ...option,
          countryCode: resolveContryCode(r_area_code),
          phone: removeSpaceSE(r_account),
        };
      } else {
        option = {
          ...option,
          email: removeSpaceSE(r_account),
        };
      }
      const result = yield call(
        RLservice.signUp,
        rType === 'mobile' ? 'sign-up-phone' : 'sign-up-email',
        option,
      );
      // if (result && result.code === '200') {
      // yield put({
      //   type: 'update',
      //   payload: {
      //     r_account: null,
      //     r_password: null,
      //     r_area_code: null,
      //     r_vcode: null,
      //     r_invite_code: null,
      //   },
      // });
      // yield yield put({
      //   type: 'user/pullUser',
      // });
      // }

      return result;
    },

    // 获取验证码
    *getVcode({ payload }, { call, put, select }) {
      const { r_account, r_area_code, lock_get_code } = yield select((state) => state.register);
      const currency = yield select((state) => state.currency);
      storage.setItem('_rl_currency', currency.currency);
      if (lock_get_code) {
        // message.error('请求过于频繁，请稍后再试');
        return;
      }
      const { type } = payload;
      const keys = {
        email: ['email'],
        mobile: ['phone', 'countryCode'],
      };
      const tranStr = keys[type][0].toUpperCase();
      const registerType = type === 'mobile' ? 'register-short-message' : 'register-email';
      const options = {
        phone: removeSpaceSE(r_account),
        countryCode: resolveContryCode(r_area_code),
        email: removeSpaceSE(r_account),
      };
      const opt = keys[type].reduce((sum, cur) => {
        return { ...sum, [cur]: options[cur] };
      }, {});

      let result = null;
      try {
        result = yield call(RLservice.getRegisterVcode, registerType, opt);
        if (result && result.code === '200') {
          yield put({ type: 'app/setToast', payload: { message: result.msg, type: 'success' } });
        }
        yield put({
          type: 'checkTriedTime',
          payload: result,
        });
      } catch (e) {
        result = e;
        if (e.code === '40011') {
          yield put({
            type: 'captcha/captcha_init',
            payload: {
              bizType: `${tranStr}_REGISTER`,
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

    // 检测发送次数
    *checkTriedTime({ payload }, { put }) {
      const { maxRetryTimes, retryTimes } = payload;
      if (retryTimes + 1 > maxRetryTimes) {
        yield put({
          type: 'save',
          payload: {
            lock_get_code: false,
          },
        });
      }
    },

    // 验证码验证
    *validateCode({ payload }, { select, call }) {
      const { r_vcode, r_area_code, r_account } = yield select((state) => state.register);

      const checkType = payload.type === 'email' ? 'email' : 'sms';

      const address =
        payload.type === 'mobile'
          ? `${resolveContryCode(r_area_code)}-${removeSpaceSE(r_account)}`
          : removeSpaceSE(r_account);
      // const result = yield put({
      //   type: 'security_new/sec_verify',
      //   payload: {
      //     validationType: checkType,
      //     validationVal: r_vcode,
      //   },
      // });
      const result = yield call(
        RLservice.verifyRegister,
        address,
        r_vcode,
        checkType.toUpperCase(),
      );
      return result;
    },

    *getRefer({ payload }, { call, put }) {
      const { rcode } = payload;
      const result = yield call(RLservice.getRefer, rcode);
      yield put({
        type: 'save',
        payload: {
          referInfo: result.data,
          r_invite_code: rcode,
        },
      });
    },

    // 获取渠道福利
    *getWelfare({ payload }, { call, put }) {
      const { data } = yield call(OPservice.getSignupWelfare, payload);
      yield put({
        type: 'update',
        payload: {
          welfare_data: data,
          welfare_pulled: true,
        },
      });
    },

    // 获取渠道福利
    *getAssetReserve({ payload }, { call, put }) {
      const cache = storage.getItem('cache_assetReserve');
      // 持久化1天
      if (cache && +cache.expireTime > Date.now()) {
        yield put({ type: 'update', payload: { assetReserve: cache.data } });
      } else {
        const { data } = yield call(RLservice.getAssetReserve);
        if (data) {
          // 因为要持久化到本地，做一下数据简化
          const minifyData = {
            latestAuditDate: data.latestAuditDate,
            reserveAsset: data.reserveAsset?.map((i) => {
              return { currency: i.currency, reserveRate: i.reserveRate };
            }),
          };
          storage.setItem('cache_assetReserve', {
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            data: minifyData,
          });
          yield put({ type: 'update', payload: { assetReserve: minifyData } });
        }
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
});
