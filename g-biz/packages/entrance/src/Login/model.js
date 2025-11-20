/**
 * Owner: iron@kupotech.com
 */
import polling from '@kc/gbiz-base/lib/polling';
import QueryPersistence, { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import storage from '@utils/storage';
import extend from 'dva-model-extend';
import isObject from 'lodash/isObject';
import md5 from 'md5';
import { getCsrf, setCsrf } from '@tools/csrf';
import {
  CAPTCHA_CODE,
  MAIL_AUTHORIZE_EXPIRE_CODE,
  MULTI_DEVICE_LIMIT,
  THIRD_PARTY_NO_BINDING,
  THIRD_PARTY_SIMPLE_REGISTER,
  TOKEN_INVALID_CODE,
  UTM_RCODE_MAP,
  VALIDATE_ERROR,
} from '../common/constants';
import {
  checkIsNeedMailAuthorize,
  reportPasswordError,
  getAnonymousID,
  getJWTPath,
  getValidateResult,
  kcsensorsManualTrack,
  parseQuery,
  sensorsLogin,
  transformObjWithMap,
  sentryReport,
  compose,
} from '../common/tools';
import {
  LOGIN_STEP,
  THIRD_PARTY_ACCOUNT_DIVERSION_STEP,
  ACCOUNT_KEY,
  ACCOUNT_LOGIN_TAB_KEY,
  LOGIN_BIZ_TYPE,
  THIRD_PARTY_LOGIN_TYPE,
  NAMESPACE,
  SUB_ACCOUNT_LOGIN_TAB_KEY,
  ACCOUNT_LOGIN_STEP,
} from './constants';
import * as services from './service';

const LoginTipCodes = ['280011', '280014', '500014']; // 500014 风控拦截code

/** 跳转jwt，后续的异步逻辑开关，保证只触发一次 */
let JUMP_JWT = false;

function loopCrypto(str, time) {
  const salt = '_kucoin_';
  const c = md5(`${salt}${str}${salt}`).toString();
  if (time <= 0) {
    return c;
  }
  return loopCrypto(c, time - 1);
}

function getUtm() {
  const utm = queryPersistence.getPersistenceQuery(QueryPersistence.UTM_GROUP);

  return transformObjWithMap(utm, UTM_RCODE_MAP);
}

let _loginType = ''; // 登录方式

const initialState = {
  // 登陆环节上一个步骤
  prevStepList: [],
  // 登陆当前步骤
  currentStep: LOGIN_STEP.SIGN_IN_STEP_INPUT_ACCOUNT,
  needValidations: [],
  smsRetryAfterSeconds: null,
  emailRetryAfterSeconds: null,
  accountDup: false,
  accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ONLY_ACCOUNT,
  type: 1,
  countryCode: '',
  email: '',
  phone: '',
  loadingSms: false,
  loadingEmail: false,
  sendChannel: 'MY_SMS', // 验证码发送渠道，MY_SMS-短信，MY_VOICE-语音，MY_EMAIL-邮箱 MY_前缀代码往自己邮箱或者手机发送验证码
  riskTag: '',
  verifyToken: '',
  verifyCheckToken: '',
  isShowMailAuthorizePage: false,
  loginErrorCode: null, // 登录错误码（用于外层埋点）
  loginErrorTip: null, // 登录错误提示
  emailSuffixes: [],
  multiDeviceLoginParams: {
    dialogVisible: false, // 是否显示多设备登录弹窗
    deviceInfoStr: '', // 已登录设备信息
    trustDevice: null, // 本次登录是否信任当前设备，如果为true/false则表示用户是否勾选信任设备，如果为null，则表示直接跳过了登录二次验证
  }, // 多设备登录相关参数
  // 三方注册绑定的流程步骤
  thirdPartyDiversionPrevStepList: [],
  thirdPartyDiversionStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP.HOME,
  // 三方账号登陆
  isThirdPartyLogin: false,
  // 三方绑定账号登陆
  isThirdPartyBindAccount: false,
  thirdPartyDecodeInfo: {}, // 当前三方登录的解密信息（包含一些邮箱，用户名）
  thirdPartyInfo: {}, // 当前三方登录的返回信息
  thirdPartyPlatform: '', // 当前三方登录的平台
  // 三方注册绑定 输入的账号信息
  // { email } 或者 { countryCode, phone }
  thirdPartyBindAccountInfo: {},
  // 三方场景的登录策略，1：三方注册 登录绑定，2:三方换绑登录
  loginDecision: undefined,
  loginSuccessData: [], // 登陆成功后调用回调的参数列表
  userUpdateTermList: [], // 用户待签署的协议列表
};

export default extend(polling, {
  namespace: NAMESPACE,
  state: {
    loginLoading: false,
    countryCodes: [],
    accountDup: false,
    initToken: undefined,
    loginToken: undefined, // 登录凭证
    status: undefined, // 二维码状态
    ...initialState,
    gfaBtnLoading: false,
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state) {
      return {
        ...state,
        ...initialState,
      };
    },
  },
  effects: {
    // 登陆流程执行下一步
    *nextStep({ payload }, { select, put }) {
      const { currentStep, prevStepList } = yield select((state) => state[NAMESPACE]);
      const { nextStep } = payload;
      yield put({
        type: 'update',
        payload: {
          currentStep: nextStep,
          prevStepList: [...prevStepList, currentStep],
        },
      });
    },
    // 回退到上一步
    *rebackStep(_, { select, put }) {
      const { prevStepList } = yield select((state) => state[NAMESPACE]);
      // 如果有能返回的，则向前一步返回
      if (prevStepList.length) {
        const currentStep = prevStepList.pop();
        yield put({
          type: 'update',
          payload: {
            currentStep,
            prevStepList: [...prevStepList],
          },
        });
      } else {
        // 否则重置为最开始状态
        yield put({
          type: 'reset',
        });
      }
    },
    *loginCallback({ payload, onSuccess, trackResultParams = {} }, { put }) {
      const {
        jwtToken,
        loginToken,
        needValidations,
        type = 1,
        countryCode = '',
        account = '',
        isPasskeyLogin = false,
        ...otherPayload
      } = payload || {};
      const isNeedMailAuthorize = checkIsNeedMailAuthorize(payload);
      const parsed = parseQuery();
      const { return_to } = parsed;
      if (jwtToken) {
        // 直接跳转jwt逻辑
        if (return_to) {
          if (!JUMP_JWT) {
            JUMP_JWT = true;
            window.location.href = getJWTPath('zendesk', jwtToken, return_to);
          }
          return;
        }
      }
      const nextNeedValidations = needValidations || [];

      yield put({
        type: 'update',
        payload: {
          type,
          countryCode,
          token: loginToken,
          loginLoading: false,
          needValidations: nextNeedValidations,
          ...otherPayload,
        },
      });
      // 如果没有邮箱风控 && 没有二步验证，直接登陆
      if (!isNeedMailAuthorize && !nextNeedValidations.length) {
        // passkey登录无需验证码二次验证，会进入这里的逻辑
        yield put({
          type: 'validate',
          payload: { validationType: 'EMPTY', account }, // 无需验证码
          isPasskeyLogin,
          onSuccess,
          trackResultParams,
        });
      } else {
        // 否则进入到下一步
        yield put({
          type: 'nextStep',
          payload: {
            // 如果有邮箱风控，优先进入到邮箱风控
            nextStep: isNeedMailAuthorize
              ? LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK
              : LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT,
          },
        });
      }
    },
    /**
     *
     * @deprecated 废弃，使用V2
     */
    *login(
      { isThirdPartyLogin = false, payload, onSuccess, onOpenCaptcha, trackResultParams = {} },
      { call, put },
    ) {
      yield put({
        type: 'update',
        payload: { loginLoading: true, loginErrorTip: null, loginErrorCode: null },
      });
      try {
        const { password, loginType } = payload;
        _loginType = loginType || '';
        // 密码加密
        const cryptoPassword = loopCrypto(password, 2);
        let params = { ...payload, password: cryptoPassword, loginType: undefined };
        // 是否为jwt登录
        const parsed = parseQuery();
        const { jwtLogin } = parsed;
        if (jwtLogin) params.jwtLogin = !!jwtLogin;
        // 是否携带utm参数
        const utm = getUtm();
        if (utm) params = { ...params, ...utm };
        const res = yield call(services.login, { ...params });

        kcsensorsManualTrack({
          kc_pageid: 'B1login',
          spm: ['B1login', ['submit', '1']],
        });
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(res.data || {});
        yield put({
          onSuccess,
          trackResultParams,
          type: 'loginCallback',
          payload: {
            finishUpgrade: res?.data?.finishUpgrade,
            countryCode: res?.data?.countryCode,
            email: res?.data?.email,
            jwtToken: res?.data?.jwtToken,
            loginSafeWord: res?.data?.loginSafeWord,
            loginToken: res?.data?.loginToken,
            needValidations: Array.isArray(res?.data?.needValidations)
              ? res.data.needValidations
              : [], // 鲁棒性处理,
            isThirdPartyLogin,
            phone: res?.data?.phone,
            riskTag: res?.data?.riskTag,
            type: res?.data?.type,
            verifyCheckToken: res?.data?.verifyCheckToken,
            verifyToken: res?.data?.verifyToken,
            isShowMailAuthorizePage: isNeedMailAuthorize,
          },
        });

        if (_loginType === ACCOUNT_LOGIN_TAB_KEY) {
          if (ACCOUNT_KEY?.[ACCOUNT_LOGIN_TAB_KEY]) {
            storage.setItem(
              ACCOUNT_KEY[ACCOUNT_LOGIN_TAB_KEY],
              window?.btoa?.(payload.phone || payload.account || '') || '',
            );
            storage.setItem(
              ACCOUNT_KEY.mobileCode,
              payload.mobileCode && payload.mobileCode !== '0' ? payload.mobileCode : '',
            );
          }
        } else if (ACCOUNT_KEY?.[SUB_ACCOUNT_LOGIN_TAB_KEY]) {
          storage.setItem(
            ACCOUNT_KEY[SUB_ACCOUNT_LOGIN_TAB_KEY],
            window?.btoa?.(payload.account || '') || '',
          );
        }
      } catch (e) {
        if (e.code && e.code === CAPTCHA_CODE && onOpenCaptcha) {
          onOpenCaptcha();
        } else {
          // 登录失败埋点
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType: 'NONE',
                businessType: 'v2Login', // 常规登录
                is_success: false,
                fail_reason: e.msg,
                fail_reason_code: e.code,
              },
            },
            'login_result',
          );
          yield put({ type: 'update', payload: { loginLoading: false } });
          if (LoginTipCodes.includes(e.code) && e.msg) {
            yield put({
              type: 'update',
              payload: {
                loginErrorCode: e.code,
                loginErrorTip: e.msg,
              },
            });
            return;
          }
          throw e;
        }
      }
    },
    /** 账号(包含子账号)密码登陆 */
    *loginV2(
      {
        payload,
        isThirdPartyBindAccount = false,
        onSuccess,
        onOpenCaptcha,
        trackResultParams = {},
      },
      { call, put },
    ) {
      yield put({
        type: 'update',
        payload: {
          loginLoading: true,
          loginErrorTip: null,
          loginErrorCode: null,
          isThirdPartyBindAccount,
        },
      });
      try {
        const { password, loginType } = payload;
        reportPasswordError(password, 'login');
        _loginType = loginType || '';
        // 密码加密
        const cryptoPassword = loopCrypto(password, 2);
        let params = { ...payload, password: cryptoPassword, loginType: undefined };
        // 是否为jwt登录
        const parsed = parseQuery();
        const { jwtLogin } = parsed;
        if (jwtLogin) params.jwtLogin = !!jwtLogin;
        // 是否携带utm参数
        const utm = getUtm();
        if (utm) params = { ...params, ...utm };
        const res = yield call(services.loginV2, { ...params });

        kcsensorsManualTrack({
          kc_pageid: 'B1login',
          spm: ['B1login', ['submit', '1']],
        });
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(res.data || {});
        yield put({
          onSuccess,
          trackResultParams,
          type: 'loginCallback',
          payload: {
            finishUpgrade: res?.data?.finishUpgrade,
            countryCode: res?.data?.countryCode,
            email: res?.data?.email,
            jwtToken: res?.data?.jwtToken,
            loginSafeWord: res?.data?.loginSafeWord,
            loginToken: res?.data?.loginToken,
            needValidations: Array.isArray(res?.data?.needValidations)
              ? res.data.needValidations
              : [], // 鲁棒性处理
            phone: res?.data?.phone,
            riskTag: res?.data?.riskTag,
            // 账密登陆一定不能是三方账号、扫码登陆
            isThirdPartyLogin: false,
            scanLoginShow: false,
            isPasskeyLogin: false,
            type: res?.data?.type,
            verifyCheckToken: res?.data?.verifyCheckToken,
            verifyToken: res?.data?.verifyToken,
            isShowMailAuthorizePage: isNeedMailAuthorize,
          },
        });

        if (_loginType === ACCOUNT_LOGIN_TAB_KEY) {
          if (ACCOUNT_KEY?.[ACCOUNT_LOGIN_TAB_KEY]) {
            storage.setItem(
              ACCOUNT_KEY[ACCOUNT_LOGIN_TAB_KEY],
              window?.btoa?.(payload.phone || payload.account || '') || '',
            );
            storage.setItem(
              ACCOUNT_KEY.mobileCode,
              payload.mobileCode && payload.mobileCode !== '0' ? payload.mobileCode : '',
            );
          }
        } else if (ACCOUNT_KEY?.[SUB_ACCOUNT_LOGIN_TAB_KEY]) {
          storage.setItem(
            ACCOUNT_KEY[SUB_ACCOUNT_LOGIN_TAB_KEY],
            window?.btoa?.(payload.account || '') || '',
          );
        }
      } catch (e) {
        if (e.code && e.code === CAPTCHA_CODE && onOpenCaptcha) {
          onOpenCaptcha();
        } else {
          // 登录失败埋点
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType: 'NONE',
                businessType: 'v2Login', // 常规登录
                is_success: false,
                fail_reason: e.msg,
                fail_reason_code: e.code,
              },
            },
            'login_result',
          );
          yield put({ type: 'update', payload: { loginLoading: false } });
          if (LoginTipCodes.includes(e.code) && e.msg) {
            yield put({
              type: 'update',
              payload: {
                loginErrorCode: e.code,
                loginErrorTip: e.msg,
              },
            });
            return;
          }
          throw e;
        }
      }
    },
    // 获取登陆后用户待签协议
    *getUserUpdateTerm(
      { payload: { loginSuccessData, hasUpdateTermCallback, noUpdateTermCallback } },
      { put, call },
    ) {
      try {
        yield put({
          type: 'update',
          payload: {
            userUpdateTermList: [],
            loginSuccessData,
          },
        });
        const { data } = yield call(services.queryWaitedSignTerms);
        if (data && data.length) {
          // 主要是如果没有 csrf, 在协议签署过程中拒绝签署调用 logout 接口强依赖 csrf
          if (!getCsrf()) {
            const res = yield call(services.getUserInfo);
            if (res?.data?.csrf) {
              setCsrf(res?.data?.csrf);
            }
          }
          // 只有确保有 csrf, 才能执行签署协议逻辑
          if (getCsrf()) {
            yield put({
              type: 'update',
              payload: {
                userUpdateTermList: data,
              },
            });
            hasUpdateTermCallback?.();
            return;
          }
          sentryReport({
            level: 'warning',
            message: `user need update term but csrf empty`,
            tags: {
              errorType: 'update_term_csrf_empty',
            },
          });
        }
        noUpdateTermCallback?.();
      } catch (err) {
        // 签署接口静默失败，不能影响登陆流程
        console.log('query waited sign term error...', err);
        sentryReport({
          level: 'warning',
          message: `get user update term error: ${err?.message}`,
          tags: {
            errorType: 'get_user_update_term_error',
          },
        });
        // 查询协议接口静默失败，不能影响登陆流程
        noUpdateTermCallback?.();
      }
    },
    *signTerm({ payload }, { call }) {
      try {
        const { userTermSubRequests } = payload;
        yield call(services.signTermUsingPost, { userTermSubRequests });
      } catch (err) {
        // 签署接口静默失败，不能影响登陆流程
        console.log('signTerm error...', err);
        sentryReport({
          level: 'warning',
          message: `sign user update term error: ${err?.message}`,
          tags: {
            errorType: 'sign_user_update_term_error',
          },
        });
      }
    },
    // 不签署协议，退出登陆
    *logout({ payload: { to } }, { call }) {
      try {
        const { code } = yield call(services.logout);
        if (code === '200') {
          if (to) {
            window.location.href = to;
          } else {
            window.location.reload();
          }
        }
      } catch (e) {
        // 退出登陆失败
        console.log('logout err..', e);
        sentryReport({
          level: 'warning',
          message: `user logout error ${e?.message}`,
          tags: {
            errorType: 'user_logout_error',
          },
        });
      }
    },
    *passkeyLogin(
      { payload, passkeyLoginRes, onSuccess, onOpenCaptcha, trackResultParams = {} },
      { put },
    ) {
      yield put({
        type: 'update',
        payload: { loginLoading: true, loginErrorTip: null, loginErrorCode: null },
      });
      try {
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(passkeyLoginRes.data || {});
        const { loginType } = payload;
        _loginType = loginType || '';

        yield put({
          onSuccess,
          trackResultParams,
          type: 'loginCallback',
          payload: {
            finishUpgrade: passkeyLoginRes?.data?.finishUpgrade,
            countryCode: passkeyLoginRes?.data?.countryCode,
            email: passkeyLoginRes?.data?.email,
            jwtToken: passkeyLoginRes?.data?.jwtToken,
            loginSafeWord: passkeyLoginRes?.data?.loginSafeWord,
            loginToken: passkeyLoginRes?.data?.loginToken,
            needValidations: Array.isArray(passkeyLoginRes?.data?.needValidations)
              ? passkeyLoginRes.data.needValidations
              : [], // 鲁棒性处理
            phone: passkeyLoginRes?.data?.phone,
            riskTag: passkeyLoginRes?.data?.riskTag,
            type: passkeyLoginRes?.data?.type,
            verifyCheckToken: passkeyLoginRes?.data?.verifyCheckToken,
            verifyToken: passkeyLoginRes?.data?.verifyToken,
            isShowMailAuthorizePage: isNeedMailAuthorize,
            account: payload?.account,
            isPasskeyLogin: true,
            // passkey登录不涉及三方绑定、扫码登陆
            isThirdPartyLogin: false,
            isThirdPartyBindAccount: false,
            scanLoginShow: false,
          },
        });
        console.log('_loginType', _loginType);
        if (_loginType === ACCOUNT_LOGIN_TAB_KEY) {
          if (ACCOUNT_KEY?.[ACCOUNT_LOGIN_TAB_KEY]) {
            storage.setItem(
              ACCOUNT_KEY[ACCOUNT_LOGIN_TAB_KEY],
              window?.btoa?.(payload.phone || payload.account || '') || '',
            );
            storage.setItem(
              ACCOUNT_KEY.mobileCode,
              payload.mobileCode && payload.mobileCode !== '0' ? payload.mobileCode : '',
            );
          }
        } else if (ACCOUNT_KEY?.[SUB_ACCOUNT_LOGIN_TAB_KEY]) {
          storage.setItem(
            ACCOUNT_KEY[SUB_ACCOUNT_LOGIN_TAB_KEY],
            window?.btoa?.(payload.account || '') || '',
          );
        }
      } catch (e) {
        if (e.code && e.code === CAPTCHA_CODE && onOpenCaptcha) {
          onOpenCaptcha();
        } else {
          // passkey登录失败埋点通过服务端埋了
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType: 'NONE',
                businessType: payload?.account ? 'accountPasskeyLogin' : 'passkeyLogin', // passkey 登录
                is_success: false,
                fail_reason: e.msg,
                fail_reason_code: e.code,
              },
            },
            'login_result',
          );
          yield put({ type: 'update', payload: { loginLoading: false } });
          if (LoginTipCodes.includes(e.code) && e.msg) {
            yield put({
              type: 'update',
              payload: {
                loginErrorCode: e.code,
                loginErrorTip: e.msg,
              },
            });
            return;
          }
          throw e;
        }
      }
    },
    /** 二步验证 */
    *validate(
      { payload, isPasskeyLogin, onSuccess, trackResultParams = {}, onBack },
      { call, select, put },
    ) {
      yield put({ type: 'update', payload: { gfaBtnLoading: true } });

      const { t, toast, account, validationType, validations, ...rest } = payload || {};

      const {
        token,
        finishUpgrade,
        isThirdPartyLogin,
        thirdPartyPlatform,
        thirdPartyDiversionStep,
        isThirdPartyBindAccount,
        loginDecision,
      } = yield select((state) => state[NAMESPACE]);
      let preSpmId = [];
      if (isThirdPartyLogin) {
        preSpmId = ['thirdAccount', thirdPartyPlatform];
      } else if (isThirdPartyBindAccount) {
        if (thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN) {
          // 登陆绑定
          preSpmId = ['loginExistingKCAccount', 'nextButton'];
        } else if (
          thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT
        ) {
          preSpmId = ['bindExistingKCAccountInputPassword', 'nextButton'];
        }
      }
      try {
        // 格式化验证码参数;
        // let formatValidations = {};
        let formatValidationsForGateway = {}; // 网关需要的格式
        if (validationType !== 'EMPTY') {
          formatValidationsForGateway = Object.keys(validations || {}).reduce((sum, cur) => {
            return { ...sum, [`${cur.toUpperCase()}`]: validations[cur] };
          }, {});
        } else {
          formatValidationsForGateway = { EMPTY: '' };
        }

        const validateParam = {
          ...rest,
          token,
          validations: JSON.stringify(formatValidationsForGateway), // 网关和后端共用新字段
          anonymousId: getAnonymousID(),
        };

        // 三方绑定 登陆场景
        if (loginDecision && isThirdPartyBindAccount) {
          validateParam.loginDecision = loginDecision;
        }

        const { data, success, msg: errorMsg, code: errorCode } = yield call(
          services.validateV2,
          validateParam,
        );
        if (success && data) {
          const _type = _loginType || ACCOUNT_LOGIN_TAB_KEY;
          storage.setItem('kucoinv2_login_key', _type);
          // 登录成功，调用login，上报uid
          sensorsLogin(String(data.uid), String(data.honorLevel));
          // 登录成功埋点 手机号/邮箱/子账号/passkey 以及三方登陆正常登陆case 登陆成功 最终都会执行这里
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType,
                businessType: isPasskeyLogin
                  ? 'passkey'
                  : isThirdPartyLogin
                  ? 'thirdPartyLogin'
                  : 'v2Login',
                is_success: true,
                is_login: true, // 客户端设置is_login可能在这个之前，故这里默认login true
              },
            },
            'login_result',
          );
          kcsensorsManualTrack({
            spm: ['signinVerify', 'result'],
            data: preSpmId.length
              ? {
                  pre_spm_id: compose(preSpmId),
                  status: 'success',
                }
              : {
                  status: 'success',
                },
          });
          yield call(onSuccess, { ...data, finishUpgrade });
        } else {
          // 登录失败埋点
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType,
                businessType: isPasskeyLogin
                  ? 'passkey'
                  : isThirdPartyLogin
                  ? 'thirdPartyLogin'
                  : 'v2Login',
                is_success: false,
                fail_reason: errorMsg,
                fail_reason_code: errorCode,
              },
            },
            'login_result',
          );
          kcsensorsManualTrack({
            spm: ['signinVerify', 'result'],
            data: preSpmId.length
              ? {
                  pre_spm_id: compose(preSpmId),
                  status: 'fail',
                }
              : {
                  status: 'fail',
                },
          });
        }
      } catch (e) {
        kcsensorsManualTrack({
          spm: ['signinVerify', 'result'],
          data: preSpmId.length
            ? {
                pre_spm_id: compose(preSpmId),
                status: 'fail',
              }
            : {
                status: 'fail',
              },
        });
        const back = () => {
          // 如果有onBack回调，则执行回调
          if (onBack) {
            onBack();
          } else {
            // 如果没有onBack回调，则重置登录状态
            put({ type: 'reset' });
          }
        };
        let alreadyToast = false;
        // 其他错误
        if (e?.response?.data?.msg) {
          toast && toast.error(e.response.data.msg);
          back?.();
          return;
        }

        // 业务失败的处理
        const { code, msg, data } = e || {};
        // 通过validationResultResponses判断多个验证码是否通过
        if (code === VALIDATE_ERROR) {
          const { errorToastKeyList, hasMaxLimit } = getValidateResult(
            data?.validationResultResponses || [],
          );
          if (hasMaxLimit) {
            toast.error(msg || '');
            alreadyToast = true;
          }
          const errorCount = data?.validationResultResponses?.length || 0;
          if (!hasMaxLimit && errorCount === 1) {
            toast && toast.error(t('402de1b872464000ac97', { type: t(errorToastKeyList[0]) })); // 不再使用err.msg提示错误,使用自定义提示
            alreadyToast = true;
          } else if (!hasMaxLimit && errorCount >= 2) {
            // 登录场景，目前最多两种验证错误
            alreadyToast = true;
            toast &&
              toast.error(
                // 不再使用err.msg提示错误,使用自定义提示
                t('ac466db4cd4f4000a02f', {
                  type1: t(errorToastKeyList[0]),
                  type2: t(errorToastKeyList[1]),
                }),
              );
          }
        }
        // 当需要弹多设备登录窗让用户确认踢出时，不埋登录失败的埋点，也不弹错误信息
        if (code === MULTI_DEVICE_LIMIT) {
          alreadyToast = true; // 不再弹错误信息
          yield put({
            type: 'update',
            payload: {
              multiDeviceLoginParams: {
                dialogVisible: true,
                deviceInfo: msg,
                trustDevice:
                  typeof payload?.trustDevice === 'boolean' ? payload?.trustDevice : null,
              },
            },
          });
        }
        // 登录失败埋点
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              ...trackResultParams,
              validationType,
              businessType: isPasskeyLogin
                ? 'passkey'
                : isThirdPartyLogin
                ? 'thirdPartyLogin'
                : 'v2Login',
              is_success: false,
              fail_reason: e && e.msg,
              fail_reason_code: e && e.code,
            },
          },
          'login_result',
        );

        // TOKEN失效
        if (e.code && e.code === TOKEN_INVALID_CODE) {
          yield put({ type: 'update', payload: { needValidations: [] } });
          back?.();
        }
        !alreadyToast && toast && toast.error(msg || '');
      } finally {
        yield put({ type: 'update', payload: { gfaBtnLoading: false } });
      }
    },

    // 发送验证码
    *sendVerifyCode({ payload, onSendCodeSuccess, onSendError }, { call, put, select }) {
      const { toast, sendChannel } = payload;

      const { token, isThirdPartyLogin, scanLoginShow } = yield select((state) => state[NAMESPACE]);

      // 每次发送验证码都需要根据传入的sendChannel来判断发送的类型是手机还是邮箱，再去做对应的状态处理
      const _sendChannel = sendChannel === 'MY_VOICE' ? 'MY_SMS' : sendChannel;
      const _sendType = _sendChannel === 'MY_SMS' ? 'phone' : 'email';
      const _retryTypeKey =
        _sendType === 'phone' ? 'smsRetryAfterSeconds' : 'emailRetryAfterSeconds';
      const _sendLoadingKey = _sendType === 'phone' ? 'loadingSms' : 'loadingEmail';

      try {
        yield put({ type: 'update', payload: { [_sendLoadingKey]: true } });
        const result = yield call(services.sendVerifyCode, {
          token,
          // 如果是三方登陆或者扫码登陆，发送验证码 bizType 用 login
          bizType: isThirdPartyLogin || scanLoginShow ? THIRD_PARTY_LOGIN_TYPE : LOGIN_BIZ_TYPE,
          sendChannel,
        });
        const {
          data: { maxRetryTimes, retryTimes, retryAfterSeconds } = {},
          msg,
          success,
        } = result;
        // 发送验证码，如果达到最大次数，则给出一个提示
        if (maxRetryTimes === retryTimes) {
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
          // 更新验证码发送状态
          yield put({ type: 'update', payload: _payload });
          onSendCodeSuccess?.();
          msg && maxRetryTimes !== retryTimes && toast.info(msg);
        }
      } catch (err) {
        // 其他错误
        if (err?.response?.data?.msg) {
          toast.error(err.response.data.msg);
          return;
        }
        if (err?.code && err.code === CAPTCHA_CODE) {
          const _payload = {
            isCaptchaOpen: true,
            // 把发送验证码的参数存起来，等验证码校验成功后再发送
            sendVerifyCodePayload: { ...payload, onSendCodeSuccess, onSendError },
          };
          yield put({ type: 'update', payload: _payload });
        } else {
          const msg = isObject(err) ? JSON.stringify(err.msg) : err;
          toast.error(msg);
        }
        onSendError?.(err);
      } finally {
        yield put({ type: 'update', payload: { [_sendLoadingKey]: false } });
      }
    },

    *getCountryCodes(_, { call, put }) {
      const { data } = yield call(services.getCountryCodes);
      yield put({
        type: 'update',
        payload: {
          countryCodes: data || [],
        },
      });
    },
    *validateAccount({ payload: { account } }, { call, put }) {
      try {
        const { data } = yield call(services.validateAccount, { account });
        yield put({
          type: 'update',
          payload: {
            accountDup: !data,
          },
        });
      } catch (e) {
        if (e.code && e.code === '4001') {
          yield put({
            type: 'update',
            payload: {
              accountDup: false,
            },
          });
        }
      }
    },
    // 初始化获取token
    *getToken(_, { put, call }) {
      const utm = getUtm();
      const parsed = parseQuery();
      const { jwtLogin } = parsed;
      let params = {};
      if (jwtLogin) {
        params.jwtLogin = !!jwtLogin;
      }
      if (utm) {
        params = {
          ...params,
          ...utm,
        };
      }
      const { data } = yield call(services.getToken, params);
      yield put({
        type: 'update',
        payload: {
          initToken: data.token,
        },
      });
    },
    // 扫码登录状态轮询
    *getStatus(_, { put, call, select }) {
      const { initToken, scanLoginShow } = yield select((state) => state[NAMESPACE]);
      if (!scanLoginShow || !initToken) {
        return;
      }
      const { data } = yield call(services.checkLoginStatus, { qrToken: initToken });
      const { jwtToken, needValidations, loginToken } = data || {};
      const isNeedMailAuthorize = checkIsNeedMailAuthorize(data || {});
      if (jwtToken) {
        // 直接跳转jwt逻辑
        const parsed = parseQuery();
        const { return_to } = parsed;
        if (return_to) {
          if (!JUMP_JWT) {
            JUMP_JWT = true;
            window.location.href = getJWTPath('zendesk', jwtToken, return_to);
          }
          return;
        }
      }
      // 下发的验证方式
      const validations = Array.isArray(needValidations) ? needValidations : []; // 鲁棒性处理
      yield put({
        type: 'update',
        payload: {
          ...data,
          token: loginToken,
          needValidations: validations,
          isShowMailAuthorizePage: isNeedMailAuthorize,
        },
      });
      // 如果有风控验证
      if (isNeedMailAuthorize || validations.length) {
        // 进入到下一步
        yield put({
          type: 'nextStep',
          payload: {
            // 如果有邮箱风控，优先进入到邮箱风控
            nextStep: isNeedMailAuthorize
              ? LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK
              : LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT,
          },
        });
      }
    },
    // 重置扫码登录状态
    *resetScan(__, { put }) {
      yield put({
        type: 'update',
        payload: {
          initToken: undefined,
          status: undefined,
          loginToken: undefined,
        },
      });
    },
    // 扫码登录验证
    *validateToken({ trackResultParams = {} }, { call, select, put }) {
      const { loginToken } = yield select((state) => state[NAMESPACE]);
      try {
        yield call(services.validationLogin, {
          token: loginToken,
          bizType: LOGIN_BIZ_TYPE,
          validations: JSON.stringify({ 'QR_CODE': '' }), // 新的登录验证接口，用新的传参格式
        });
        // 扫码 登陆成功埋点
        kcsensorsManualTrack(
          {
            checkID: false,
            data: { ...trackResultParams, businessType: 'scan_code', is_success: true },
          },
          'login_result',
        );
        return true;
      } catch (e) {
        if (e?.code === MULTI_DEVICE_LIMIT) {
          yield put({
            type: 'update',
            payload: {
              multiDeviceLoginParams: {
                dialogVisible: true,
                deviceInfo: e.msg,
                trustDevice: null, // 不传
              },
            },
          });
        } else {
          // 扫码 登陆失败埋点
          kcsensorsManualTrack(
            {
              checkID: false,
              data: { ...trackResultParams, businessType: 'scan_code', is_success: false },
            },
            'login_result',
          );
          throw e;
        }
        return false;
      }
    },
    // 邮箱风控验证 重发邮件
    *resendMail(__, { call, put, select }) {
      const { verifyToken, verifyCheckToken } = yield select((state) => state[NAMESPACE]);
      const res = yield call(services.resendMail, { verifyToken, verifyCheckToken });
      yield put({
        type: 'update',
        payload: res.data,
      });
      return res;
    },
    *triggerPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'getMailVerifyResult', interval: 5 * 1000 },
      });
    },
    // 邮箱风控验证结果
    *getMailVerifyResult(
      { payload: { onSuccess, trackResultParams = {} } },
      { put, call, select },
    ) {
      const { verifyToken, verifyCheckToken } = yield select((state) => state[NAMESPACE]);
      if (!verifyToken) return;
      try {
        const { data } = yield call(services.getMailVerifyResult, {
          verifyToken,
          verifyCheckToken,
        });
        if (data?.status === 'success') {
          yield put({
            onSuccess,
            trackResultParams,
            type: 'loginCallback',
            payload: {
              ...(data?.loginInfo || {}),
              isShowMailAuthorizePage: !data?.loginInfo?.needValidations?.length,
            },
          });
        }
      } catch (e) {
        // 邮箱验证失效 或者 token 失效
        if (e?.code === MAIL_AUTHORIZE_EXPIRE_CODE || e?.code === TOKEN_INVALID_CODE) {
          yield put({ type: 'reset' });
        }
      }
    },

    // 获取邮箱后缀
    *getEmailSuffixes(_, { call, put }) {
      const { data } = yield call(services.getEmailSuffixes);
      yield put({
        type: 'update',
        payload: {
          emailSuffixes: data || [],
        },
      });
    },
    // 确认登录并踢出其他Web设备
    *loginKickOut({ payload, trackResultParams = {} }, { call, select }) {
      try {
        const { isThirdPartyBindAccount, loginDecision } = yield select(
          (state) => state[NAMESPACE],
        );
        const validateParam = {
          ...payload,
        };
        if (loginDecision && isThirdPartyBindAccount) {
          validateParam.loginDecision = loginDecision;
        }
        const { data } = yield call(services.loginKickOut, validateParam);
        if (data) {
          const { finishUpgrade } = yield select((state) => state[NAMESPACE]);
          // 命中多设备登陆 踢出其他设备登陆成功登录成功埋点
          kcsensorsManualTrack(
            {
              checkID: false,
              data: { ...trackResultParams, businessType: 'kick_out', is_success: true },
            },
            'login_result',
          );
          return { success: true, data: { ...data, finishUpgrade } };
        }
        // 命中多设备登陆 踢出其他设备登陆失败埋点
        kcsensorsManualTrack(
          {
            checkID: false,
            data: { ...trackResultParams, businessType: 'kick_out', is_success: false },
          },
          'login_result',
        );
        return { success: false, msg: 'Network Error' };
      } catch (e) {
        // 登录失败埋点
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              ...trackResultParams,
              businessType: 'kick_out',
              is_success: false,
              fail_reason: e?.msg,
              fail_reason_code: e?.code,
            },
          },
          'login_result',
        );
        return { success: false, msg: e?.msg || 'Network Error' };
      }
    },
    // 查询用户是否已存在
    *checkAccount({ payload }, { call, put }) {
      // 将用户输入的账号保存，后续绑定三方账号时使用
      yield put({
        type: 'update',
        payload: {
          // 重置三方登陆渠道
          loginDecision: undefined,
          thirdPartyBindAccountInfo: payload,
        },
      });
      const { data } = yield call(services.checkAccount, payload);
      return data;
    },
    // 查询当前三方登录信息的基础信息，如邮箱、用户名
    *getThirdPartyBaseInfo({ payload }, { call, put }) {
      const { data } = yield call(services.getThirdPartyBaseInfo, payload);
      yield put({ type: 'update', payload: { thirdPartyDecodeInfo: data || {} } });
    },
    // 发起三方登录
    *thirdPartyLoginSubmit({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'update',
        payload: {
          loginLoading: true,
          loginErrorTip: null,
          loginErrorCode: null,
          // 只要重新发起三方登陆，则将状态重置
          thirdPartyDecodeInfo: {},
          isThirdPartyLogin: false,
          isThirdPartyBindAccount: false,
          thirdPartyBindAccountInfo: {},
          loginDecision: undefined,
          // 三方登录提交前先将数据记录下来，便于在账号绑定流程中使用
          thirdPartyInfo: payload?.extInfo || {},
          thirdPartyPlatform: payload?.extPlatform,
        },
      });
      try {
        const utm = getUtm();
        const params = {
          ...payload,
          ...utm,
        };
        const res = yield call(services.thirdPartyLoginSubmit, params);
        // 是否进入风控，需邮箱授权
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(res.data || {});
        if (res?.data?.needValidations?.length) {
          kcsensorsManualTrack(
            { checkID: false, data: { accountType: payload?.extPlatform, '2faStart': 'success' } },
            'thirdAccountLogin',
          );
        }
        // 缓存一些状态
        yield put({
          onSuccess,
          type: 'loginCallback',
          payload: {
            finishUpgrade: res?.data?.finishUpgrade,
            countryCode: res?.data?.countryCode,
            email: res?.data?.email,
            jwtToken: res?.data?.jwtToken,
            loginSafeWord: res?.data?.loginSafeWord,
            loginToken: res?.data?.loginToken,
            needValidations: Array.isArray(res?.data?.needValidations)
              ? res.data.needValidations
              : [], // 鲁棒性处理,
            isThirdPartyLogin: true,
            phone: res?.data?.phone,
            riskTag: res?.data?.riskTag,
            type: res?.data?.type,
            verifyCheckToken: res?.data?.verifyCheckToken,
            verifyToken: res?.data?.verifyToken,
            isShowMailAuthorizePage: isNeedMailAuthorize,
          },
        });
      } catch (e) {
        if (e?.code === THIRD_PARTY_SIMPLE_REGISTER || e?.code === THIRD_PARTY_NO_BINDING) {
          // 如果是极简注册或者三方注册分流，都需要请求三方登陆的基本信息
          // 要保证进入极简注册或者三方注册分流的时候，能获取的三方信息
          if (payload?.extInfo && payload?.extPlatform) {
            yield put({
              type: 'getThirdPartyBaseInfo',
              payload: {
                extInfo: payload?.extInfo,
                extPlatform: payload?.extPlatform,
              },
            });
          }
        }
        yield put({
          type: 'update',
          payload: {
            loginLoading: false,
          },
        });
        // 三方极简注册
        if (e?.code === THIRD_PARTY_SIMPLE_REGISTER) {
          yield put({
            type: 'nextStep',
            payload: {
              nextStep: LOGIN_STEP.SIGN_IN_STEP_THIRD_PARTY_SIMPLE,
            },
          });
        } else if (e?.code === THIRD_PARTY_NO_BINDING) {
          // 三方注册账号分流
          kcsensorsManualTrack(
            {
              checkID: false,
              data: { accountType: payload?.extPlatform, whichProcess1: 'toBond' },
            },
            'thirdAccountLogin',
          );
          yield put({
            type: 'nextStep',
            payload: {
              nextStep: LOGIN_STEP.SIGN_IN_STEP_BIND_THIRD_PARTY,
            },
          });
        } else {
          // 不可绑定，三方登陆失败
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                accountType: payload?.extPlatform,
                whichProcess1: 'noBond',
                failReason: e?.code,
              },
            },
            'thirdAccountLogin',
          );
          if (LoginTipCodes.includes(e.code) && e.msg) {
            yield put({ type: 'update', payload: { loginErrorTip: e.msg } });
            return;
          }
          throw e;
        }
      }
    },
    // 三方绑定 下一步
    *thirdPartyNextStep({ payload }, { select, put }) {
      const { thirdPartyDiversionStep, thirdPartyDiversionPrevStepList } = yield select(
        (state) => state[NAMESPACE],
      );
      const { nextStep } = payload;
      yield put({
        type: 'update',
        payload: {
          thirdPartyDiversionStep: nextStep,
          thirdPartyDiversionPrevStepList: [
            ...thirdPartyDiversionPrevStepList,
            thirdPartyDiversionStep,
          ],
        },
      });
    },
    // 三方绑定 回退
    *thirdPartyRebackStep({ onBack }, { select, put }) {
      const { thirdPartyDiversionPrevStepList } = yield select((state) => state[NAMESPACE]);
      // 如果有能返回的，则向前一步返回
      if (thirdPartyDiversionPrevStepList.length) {
        const currentStep = thirdPartyDiversionPrevStepList.pop();
        yield put({
          type: 'update',
          payload: {
            thirdPartyDiversionStep: currentStep,
            thirdPartyDiversionPrevStepList: [...thirdPartyDiversionPrevStepList],
          },
        });
      } else {
        // 否则调用外部传入的回退
        onBack?.();
      }
    },
  },
});
