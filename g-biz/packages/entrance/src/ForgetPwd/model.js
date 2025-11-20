/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import polling from '@kc/gbiz-base/lib/polling';
import { CAPTCHA_CODE, MAIL_AUTHORIZE_EXPIRE_CODE, VALIDATE_ERROR } from '../common/constants';
import * as services from './service';
import {
  loopCrypto,
  resolveCountryCode,
  getMobileCode,
  getValidateResult,
  reportPasswordError,
} from '../common/tools';
import { NAMESPACE } from './constants';

const sendChannelMap = {
  MY_SMS: {
    resetFn: services.resetPhonePwd,
  },
  MY_VOICE: {
    resetFn: services.resetPhonePwd,
  },
  MY_EMAIL: {
    resetFn: services.resetEmailPwd,
  },
};

const initialValue = {
  isCodeRegx: false, // 验证码是否通过
  sendChannel: 'MY_SMS', // 验证码发送渠道，MY_SMS-短信，MY_VOICE-语音，MY_EMAIL-邮箱
  countryCodes: [], // 国家区号列表
  email: '', // 用户输入的邮箱
  phone: '', // 用户输入的手机号
  accountType: '', // 用户输入的账号类型 phone/email
  address: '', // 用户输入的邮箱或者完整手机号
  countryCode: '', // 用户选择的国家区号
  securityBizType: 'FORGOT_PASSWORD', // 风控业务类型
  bizType: 'FORGOT_PASSWORD_V2', // 发送验证码业务类型
  smsRetryAfterSeconds: {}, // 短信验证码倒计时
  emailRetryAfterSeconds: {}, // 邮箱验证码倒计时
  loadingSms: false,
  loadingEmail: false,
  isCaptchaOpen: false, // 是否开启人机校验
  needValidations: [], // 需要校验的类型
  sendVerifyCodePayload: null,
  displayEmail: '',
  riskTag: '',
  verifyCheckToken: '',
  verifyToken: '',
  isShowAuthorizePage: false,
};
export default extend(polling, {
  namespace: NAMESPACE,
  state: initialValue,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 获取需要校验的类型
    *checkRequireValidations({ payload, onSuccess }, { call, put, select }) {
      const { accountType, email, phone, countryCode: countryCodePre, toast } = payload;
      const { bizType } = yield select((state) => state[NAMESPACE]);
      const countryCode = getMobileCode(countryCodePre);
      const address =
        accountType === 'phone' ? `${resolveCountryCode(countryCode)}-${phone}` : email;
      try {
        const result = yield call(services.getRequiredValidations, {
          address,
          bizType,
        });
        const { data, success } = result;

        if (success) {
          const _payload = {};
          // 将发送的邮箱或者手机号存起来，便于检验页面显示信息
          _payload.email = email;
          _payload.phone = phone;
          _payload.accountType = accountType;
          _payload.address = address;
          _payload.countryCode = countryCode;
          _payload.needValidations = isArray(data) ? data : [];
          yield put({ type: 'update', payload: _payload });
          onSuccess?.();
        }
      } catch (err) {
        // 没有人机校验
        // 其他错误
        if (err?.response?.data?.msg) {
          toast.error(err.response.data.msg);
          return;
        }
        const { msg } = err;
        toast.error(msg || '');
      }
    },
    // 验证验证码
    *verifyCode({ payload }, { call, put, select }) {
      const { t, toast, validations } = payload;
      const {
        email,
        phone,
        address,
        countryCode: countryCodePre,
        bizType,
        securityBizType,
      } = yield select((state) => state[NAMESPACE]);
      const countryCode = getMobileCode(countryCodePre);

      try {
        const { code: dataCode, msg } = yield call(services.verifyValidations, {
          address,
          validations,
          bizType,
        });
        if (dataCode !== '200') {
          toast.error(msg);
          yield put({ type: 'update', payload: { isCodeRegx: false } });
          return;
        }
        // 验证成功后 校验风控
        yield put({
          type: 'getRiskCheck',
          payload: { account: address, bizType: securityBizType }, // 风控的bizType仍然使用原来的
        });
        // 更新codeRegx
        yield put({ type: 'update', payload: { email, phone, countryCode } });
      } catch (err) {
        let alreadyToast = false;
        // 其他错误
        if (err?.response?.data?.msg) {
          toast.error(err.response.data.msg);
          return;
        }
        // 业务处理
        const { data, code: dataCode } = err || {};
        if (dataCode && dataCode === VALIDATE_ERROR) {
          const { hasMaxLimit, errorToastKeyList } = getValidateResult(data || []);
          const errorCount = data?.length || 0;
          if (!hasMaxLimit && errorCount === 1) {
            toast.error(t('402de1b872464000ac97', { type: t(errorToastKeyList[0]) }));
            alreadyToast = true;
          } else if (!hasMaxLimit && errorCount >= 2) {
            // 登录场景，目前最多两种验证错误
            toast.error(
              t('ac466db4cd4f4000a02f', {
                type1: t(errorToastKeyList[0]),
                type2: t(errorToastKeyList[1]),
              }),
            );
            alreadyToast = true;
          }
        }
        yield put({ type: 'update', payload: { isCodeRegx: false } });
        const msg = isObject(err) ? JSON.stringify(err.msg) : err;
        !alreadyToast && toast.error(msg);
      }
    },
    // 发送验证码
    *sendVerifyCode({ payload, onSendCodeSuccess }, { call, put, select }) {
      const { bizType, address } = yield select((state) => state[NAMESPACE]);
      const { toast, sendChannel, t } = payload;
      let noDataMode = false;

      const _sendCodeType = sendChannel === 'MY_VOICE' ? 'MY_SMS' : sendChannel;
      // 每次发送验证码都需要根据传入的sendChannel来判断发送的验证码类型是手机还是邮箱，再去做对应的状态处理
      const _retryTypeKey =
        _sendCodeType === 'MY_SMS' ? 'smsRetryAfterSeconds' : 'emailRetryAfterSeconds';
      const _sendLoadingKey = _sendCodeType === 'MY_SMS' ? 'loadingSms' : 'loadingEmail';

      try {
        yield put({ type: 'update', payload: { [_sendLoadingKey]: true } });
        const result = yield call(services.sendVerifyCode, {
          address, // 这里的address跟sendChannel是没有关系的,发送什么验证码都传第一步输入的手机号/邮箱，接口会根据sendChannel来判断发送的类型
          bizType,
          sendChannel,
        });
        if (!result?.data) {
          noDataMode = true;
          result.data = { maxRetryTimes: 5, retryTimes: 0, retryAfterSeconds: 60 }; // 忘记密码场景，当没有注册的账号可能会返回空data，因此Mock发送状态
        }
        const {
          data: { maxRetryTimes, retryTimes, retryAfterSeconds },
          msg,
          success,
        } = result;
        // 发送验证码，如果达到最大次数，则给出一个提示
        if (result?.data && maxRetryTimes === retryTimes) {
          toast.warning(msg);
        }
        if (success) {
          const _payload = {
            sendChannel,
            [`${_retryTypeKey}`]: {
              time: retryAfterSeconds,
              deadline: Date.now() + retryAfterSeconds * 1000,
            },
          };
          // 将发送的邮箱或者手机号存起来，便于检验页面显示信息
          yield put({ type: 'update', payload: _payload });
          onSendCodeSuccess?.();
          msg &&
            result?.data &&
            maxRetryTimes !== retryTimes &&
            toast.info(noDataMode ? t('voice_send_success') : msg);
        }
      } catch (err) {
        // 其他错误
        if (err?.response?.data?.msg) {
          toast.error(err.response.data.msg);
          return;
        }
        // 业务错误
        const { code, msg } = err || {};
        if (code === CAPTCHA_CODE) {
          const _payload = {
            isCaptchaOpen: true,
            // 把发送验证码的参数存起来，等验证码校验成功后再发送
            sendVerifyCodePayload: { ...payload },
          };
          yield put({ type: 'update', payload: _payload });
        } else {
          toast.error(msg || '');
        }
      } finally {
        yield put({ type: 'update', payload: { [_sendLoadingKey]: false } });
      }
    },

    // 重置密码
    *resetPwd({ payload }, { call, select }) {
      console.log('resetPwd in');
      const { toast, password } = payload;
      const { email, phone, accountType, countryCode: countryCodePre } = yield select(
        (state) => state[NAMESPACE],
      );
      const countryCode = getMobileCode(countryCodePre);

      // 根据账号类型来发送
      const sendChannel = accountType === 'phone' ? 'MY_SMS' : 'MY_EMAIL';

      try {
        reportPasswordError(password, 'forgetPwd');
        const { resetFn } = sendChannelMap[sendChannel];
        const opts = {
          password: loopCrypto(password, 2),
        };
        if (['MY_SMS', 'MY_VOICE'].includes(sendChannel)) {
          opts.phone = phone;
          opts.countryCode = countryCode;
        } else {
          opts.email = email;
        }
        const { code: dataCode, msg } = yield call(resetFn, {
          ...opts,
        });
        if (dataCode !== '200') {
          toast.error(msg);
          return false;
        }
        // toast.info(msg);
        return true;
      } catch (err) {
        if (err?.response?.data?.msg) {
          toast.info(err.response.data.msg);
          return false;
        }
        const msg = isObject(err) ? JSON.stringify(err.msg) : err;
        toast.info(msg);
        return false;
      }
    },
    // 重置所有参数
    *resetInit(_, { put }) {
      yield put({
        type: 'update',
        payload: initialValue,
      });
    },

    *getCountryCodes(_, { call, put }) {
      const { data } = yield call(services.getCountryCodes);
      yield put({ type: 'update', payload: { countryCodes: data } });
    },

    *getRiskCheck({ payload }, { call, put }) {
      const { data, success } = yield call(services.riskCheck, payload);
      if (success) {
        const { email, riskTag, verifyCheckToken, verifyToken } = data;
        const isShowAuthorizePage = riskTag === 'verify';
        yield put({
          type: 'update',
          payload: {
            displayEmail: email,
            riskTag,
            verifyCheckToken,
            verifyToken,
            isShowAuthorizePage,
            isCodeRegx: !isShowAuthorizePage,
          },
        });
      }
    },

    *resendMail(_, { call, put, select }) {
      const { verifyToken, verifyCheckToken } = yield select((state) => state[NAMESPACE]);
      const res = yield call(services.resetMailVerifyEmail, { verifyToken, verifyCheckToken });
      yield put({
        type: 'update',
        payload: { ...res.data },
      });
      return res;
    },

    *triggerPolling(_, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'getMailVerifyResult', interval: 5 * 1000 },
      });
    },

    *getMailVerifyResult(_, { put, call, select }) {
      const { verifyToken, verifyCheckToken } = yield select((state) => state[NAMESPACE]);
      try {
        const { data } = yield call(services.getMailVerifyResult, {
          verifyToken,
          verifyCheckToken,
        });
        if (data?.status === 'success') {
          yield put({
            type: 'update',
            payload: { isCodeRegx: true, isShowAuthorizePage: false },
          });
        }
      } catch (e) {
        if (e?.code === MAIL_AUTHORIZE_EXPIRE_CODE) {
          yield put({ type: 'resetInit' }); // 过期后重置
        }
      }
    },
  },
});
