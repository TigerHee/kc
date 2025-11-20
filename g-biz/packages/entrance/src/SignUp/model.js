/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import isObject from 'lodash/isObject';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { CAPTCHA_CODE, UTM_RCODE_MAP } from '../common/constants';
import * as services from './service';

import { NAMESPACE, PHONE_BIZTYPE, SIGNUP_STEP } from './constants';

import {
  reportPasswordError,
  getAnonymousID,
  kcsensorsManualTrack,
  loopCrypto,
  removeSpaceSE,
  resolveCountryCode,
  sensorsLogin,
  transformObjWithMap,
  getUserNickname,
} from '../common/tools';

const initialValue = {
  // 注册环节上一个步骤
  prevStepList: [],
  // 注册当前步骤
  currentStep: SIGNUP_STEP.REGISTER_STEP_SET_ACCOUNT,
  userInfo: {},
  isCount: false, // 验证码发送成功（第一步进入第二步）
  loading: false,
  isCodeRegx: false, // 校验码是否校验通过
  // [`${PHONE_BIZTYPE}_countTime`]: {},
  // [`${EMAIL_BIZTYPE}_countTime`]: {},
  smsRetryAfterSeconds: null,
  emailRetryAfterSeconds: null,
  bizType: PHONE_BIZTYPE,
  countryCodes: [],
  sendChannel: 'SMS',
  emailSuffixes: [],
  userTermList: [], // 用户注册签署的协议列表
  registerFlagList: [], // 用户注册涉及的开关列表
  preRegisterData: {}, // 注册表单数据（将分散在几步的表单数据统一放在这里面）
  // 当前是手机注册，还是邮箱注册
  registerType: 'phone',
  email: '', // 手机注册需要绑定的邮箱
  phone: '', // 手机注册的号码
  abDefault: undefined,
  isCaptchaOpen: false,
  sendVerifyCodePayload: null,
  registerTip: '',
  thirdPartyBindSuccess: false, // 注册成功且三方账号绑定成功
  // 邀请人信息
  inviter: {
    loading: false,
    error: null,
    data: null,
  },
};

export default extend({
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
    // 注册流程执行下一步
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
    *rebackStep({ onBack }, { select, put }) {
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
        // 调用传入的 onBack
        onBack?.();
      }
    },
    // 获取用户信息
    *getUserInfo({ payload }, { call, put }) {
      const { data } = yield call(services.getUserInfo, payload);
      yield put({ type: 'update', payload: { userInfo: data } });
      return data;
    },
    // 新版本 发送短信验证码
    *sendSMSVerifyCode({ payload }, { call, put, select }) {
      const { toast, sendChannel, fromAccount = false, t, sendCodeSuccessCb, ...others } = payload;
      const { preRegisterData } = yield select((state) => state[NAMESPACE]);
      const { phone, countryCode } = preRegisterData || {};
      // 重置和验证码相关的状态
      yield put({
        type: 'update',
        payload: {
          loading: true,
          registerTip: null,
          isCount: false,
          isCodeRegx: false,
          smsRetryAfterSeconds: null,
        },
      });

      try {
        kcsensorsManualTrack({ spm: ['signupSendSMSVerifyCode', '1'] });
        const result = yield call(services.sendPhoneVerifyCode, {
          sendChannel,
          countryCode,
          phone: removeSpaceSE(phone),
          ...others,
        });
        const { data: { maxRetryTimes, retryTimes, retryAfterSeconds } = {}, msg, code } = result;
        const isMaxRetryTimes = maxRetryTimes === retryTimes;
        kcsensorsManualTrack(
          {
            spm: ['SMSSecurityVerify', 'sendButton'],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'send',
              clickStatus: code,
            },
          },
          'page_click',
        );

        if (code === '200') {
          kcsensorsManualTrack({ spm: ['signupSendSMSVerifyCode', '2'] });
          yield put({
            type: 'update',
            payload: {
              sendChannel,
              isCount: true,
              smsRetryAfterSeconds: {
                time: retryAfterSeconds,
                deadline: new Date().getTime() + retryAfterSeconds * 1000,
              },
            },
          });
          // 发送验证码，如果没有达到最大次数，弹出当前这个正常提示
          if (!isMaxRetryTimes) {
            toast.success(msg);
          }
          // 如果有发送验证码成功后的回调
          if (sendCodeSuccessCb) {
            sendCodeSuccessCb();
          }
        }
        // 发送验证码，如果达到最大次数，则给出警告提示
        if (isMaxRetryTimes) {
          toast.warning(msg);
        }
      } catch (err) {
        if (err.code && err.code === CAPTCHA_CODE) {
          yield put({
            type: 'update',
            payload: { isCaptchaOpen: true, sendVerifyCodePayload: { ...payload } },
          });
        } else {
          const msg = isObject(err)
            ? typeof err.msg === 'string'
              ? err.msg
              : JSON.stringify(err.msg)
            : err;
          if (msg) {
            // 发送验证码报错，输入账号页面只展示输入框下方提示内容，不再弹出 toast
            if (!fromAccount) {
              toast.error(msg);
            }
            yield put({
              type: 'update',
              payload: { registerTip: msg },
            });
          }
        }
      } finally {
        yield put({ type: 'update', payload: { loading: false } });
      }
    },

    // 新版本 发送邮箱验证码
    *sendEmailVerifyCode({ payload }, { call, put, select }) {
      const { toast, sendChannel, t, fromAccount = false, sendCodeSuccessCb, ...others } = payload;
      const { preRegisterData } = yield select((state) => state[NAMESPACE]);
      const { email } = preRegisterData || {};
      const trackValidationType =
        others.validationBiz === 'REGISTER_EMAIL' ? 'signupBindEmailverify' : 'emailSecurityVerify';
      // 重置和验证码相关的状态
      yield put({
        type: 'update',
        payload: {
          loading: true,
          registerTip: null,
          isCount: false,
          isCodeRegx: false,
          emailRetryAfterSeconds: null,
        },
      });
      try {
        kcsensorsManualTrack({ spm: ['signupSendEmailVerifyCode', '1'] });
        const result = yield call(services.sendEmailVerifyCode, {
          sendChannel,
          email: removeSpaceSE(email),
          ...others,
        });
        const { data: { maxRetryTimes, retryTimes, retryAfterSeconds } = {}, msg, code } = result;
        const isMaxRetryTimes = maxRetryTimes === retryTimes;
        kcsensorsManualTrack(
          {
            spm: [trackValidationType, 'sendButton'],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'send',
              clickStatus: code,
            },
          },
          'page_click',
        );
        if (code === '200') {
          kcsensorsManualTrack({ spm: ['signupSendEmailVerifyCode', '2'] });
          yield put({
            type: 'update',
            payload: {
              sendChannel,
              isCount: true,
              emailRetryAfterSeconds: {
                time: retryAfterSeconds,
                deadline: new Date().getTime() + retryAfterSeconds * 1000,
              },
            },
          });
          // 发送验证码，如果达到最大次数，则弹出下面的警告提示，不弹出当前这个正常提示
          if (!isMaxRetryTimes) {
            toast.success(msg);
          }
          // 如果有发送验证码成功后的回调
          if (sendCodeSuccessCb) {
            sendCodeSuccessCb();
          }
        }
        // 发送验证码，如果达到最大次数，则给出一个提示
        if (isMaxRetryTimes) {
          toast.warning(msg);
        }
      } catch (err) {
        if (err.code && err.code === CAPTCHA_CODE) {
          yield put({
            type: 'update',
            payload: { isCaptchaOpen: true, sendVerifyCodePayload: { ...payload } },
          });
        } else {
          const msg = isObject(err)
            ? typeof err.msg === 'string'
              ? err.msg
              : JSON.stringify(err.msg)
            : err;
          if (msg) {
            // 发送验证码报错，输入账号页面只展示输入框下方提示内容，不再弹出 toast
            if (!fromAccount) {
              toast.error(msg);
            }
            yield put({
              type: 'update',
              payload: { registerTip: msg },
            });
          }
        }
      } finally {
        yield put({ type: 'update', payload: { loading: false } });
      }
    },

    // 校验验证码发起注册flow
    *signUpFlow({ payload, trackResultParams = {} }, { put, take, select }) {
      yield put({ type: 'verifyCode', payload });
      yield take('verifyCode/@@end');
      const { isCodeRegx } = yield select((state) => state[NAMESPACE]);
      if (isCodeRegx) {
        return yield put({ type: 'signUp', payload, trackResultParams });
      }
      return false;
    },

    // 验证验证码
    *verifyCode({ payload }, { call, put, select }) {
      yield put({ type: 'update', payload: { isCodeRegx: false } });
      const { sendChannel } = yield select((state) => state[NAMESPACE]);
      const {
        code,
        validationType,
        toast,
        countryCode,
        phone,
        email,
        validationBiz,
        verifyCodeSuccessCb,
      } = payload;
      const checkType = validationType === 'PHONE' ? sendChannel || 'SMS' : 'EMAIL';
      const address =
        validationType === 'PHONE'
          ? `${resolveCountryCode(countryCode)}-${removeSpaceSE(phone)}`
          : removeSpaceSE(email);
      const trackValidationType =
        validationType === 'PHONE'
          ? 'SMSSecurityVerify'
          : validationBiz === 'REGISTER_EMAIL'
          ? 'signupBindEmailverify'
          : 'emailSecurityVerify';
      try {
        const { code: dataCode, msg } = yield call(services.verifyCode, {
          address,
          code: removeSpaceSE(code),
          validationType: checkType,
          validationBiz,
        });
        kcsensorsManualTrack(
          {
            spm: [
              trackValidationType,
              validationBiz === 'REGISTER_EMAIL' ? 'confirmResult' : 'submitResult',
            ],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'submit',
              clickStatus: dataCode !== '200' ? 'VerificationError' : 'success',
            },
          },
          'page_click',
        );
        if (dataCode !== '200') {
          toast.error(msg);
          yield put({ type: 'update', payload: { isCodeRegx: false } });
          return;
        }
        // 更新codeRegx isCount
        yield put({ type: 'update', payload: { isCodeRegx: true, isCount: false } });
        // 如果有校验验证码成功回调，则执行
        if (verifyCodeSuccessCb) {
          verifyCodeSuccessCb();
        }
      } catch (err) {
        kcsensorsManualTrack(
          {
            spm: [
              trackValidationType,
              validationBiz === 'REGISTER_EMAIL' ? 'confirmResult' : 'submitResult',
            ],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'submit',
              clickStatus: 'VerificationError',
            },
          },
          'page_click',
        );
        yield put({ type: 'update', payload: { isCodeRegx: false } });
        const msg = isObject(err)
          ? typeof err.msg === 'string'
            ? err.msg
            : JSON.stringify(err.msg)
          : err;
        toast.error(msg);
      }
    },

    // 发起注册
    *signUp({ payload, trackResultParams = {} }, { call, put, select }) {
      const {
        needEmail,
        email,
        code,
        validationType,
        phone,
        countryCode,
        password,
        toast,
        t,
        isKumex,
        referralCode,
      } = payload;
      try {
        // 取出用户注册签署的协议
        const userTermList = yield select((s) => s[NAMESPACE]?.userTermList);
        const registerFlagList = yield select((s) => s[NAMESPACE]?.registerFlagList);
        // 从localstorage里面取rcode, utm_source, utm_campaign, utm_medium
        const persistenceQuery = queryPersistence.getPersistenceQuery();

        const utmAndRcodeOption = transformObjWithMap(persistenceQuery, UTM_RCODE_MAP);

        reportPasswordError(password, 'signup');
        let option = {
          code,
          password: loopCrypto(password, 2),
          timeZone: new Date().getTimezoneOffset() * 60,
          // 注册勾选的协议
          userTermSubRequests: JSON.stringify(userTermList || []),
          registerFlagRequests: (registerFlagList || []).join(','),
          ...utmAndRcodeOption,
          anonymousId: getAnonymousID(),
        };

        if (isKumex) {
          option.thirdPartReferralCode = 'kumex';
        }

        let signUpFn;

        if (needEmail) {
          kcsensorsManualTrack({ spm: ['phoneNeedEmailSignup', '1'] }, 'page_click');
          option = {
            referralCode: removeSpaceSE(referralCode),
            ...option,
            countryCode: resolveCountryCode(countryCode),
            phone: removeSpaceSE(phone),
            email: removeSpaceSE(email),
          };
          signUpFn = services.signUpPhoneEmail;
        } else if (validationType === 'PHONE') {
          kcsensorsManualTrack({ spm: ['onlyPhoneSignup', '1'] }, 'page_click');
          option = {
            referralCode: removeSpaceSE(referralCode),
            ...option,
            countryCode: resolveCountryCode(countryCode),
            phone: removeSpaceSE(phone),
          };
          signUpFn = services.signUpPhone;
        } else {
          kcsensorsManualTrack({ spm: ['onlyEmailSignup', '1'] }, 'page_click');
          option = {
            referralCode: removeSpaceSE(referralCode),
            ...option,
            email: removeSpaceSE(email),
          };
          signUpFn = services.signUpEmail;
        }

        const { data, code: dataCode, msg } = yield call(signUpFn, option);
        if (dataCode !== '200') {
          // 注册失败埋点
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType, // 二步验证类型
                businessType: 'signUp', // 普通注册
                is_success: false,
                fail_reason: msg,
                fail_reason_code: dataCode,
              },
            },
            'register_result',
          );
          toast.error(msg);
          return false;
        }
        // 注册成功后，会自动登录，故这里需要调用sdk的login方法
        sensorsLogin(String(data && data.uid), String(data && data.honorLevel));
        // 注册成功埋点
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              ...trackResultParams,
              validationType, // 二步验证类型
              businessType: 'signUp', // 普通注册
              is_success: true,
            },
          },
          'register_result',
        );
        // 注册成功后，会自动登录，故这里需要上报一次login_result 事件
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              source: trackResultParams.source,
              is_success: true,
              is_first_time: true,
              validationType, // 二步验证类型
              businessType: 'signUp', // 注册后登录
            },
          },
          'login_result',
        );
        toast.info(t('sign_success'));
        // 成功之后，重置为初始值
        // yield put({ type: 'resetInit' });
        return data;
      } catch (err) {
        const msg = isObject(err)
          ? typeof err.msg === 'string'
            ? err.msg
            : JSON.stringify(err.msg)
          : err;
        toast.error(msg);
        // 注册失败-埋点
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              ...trackResultParams,
              validationType, // 二步验证类型
              businessType: 'signUp', // 普通注册
              is_success: false,
              fail_reason: msg,
              fail_reason_code: isObject(err) ? JSON.stringify(err.code) || '' : '',
            },
          },
          'register_result',
        );
        return false;
      }
    },

    // 获取区号
    *getCountryCodes(_, { call, put }) {
      const { data } = yield call(services.getCountryCodes);
      yield put({
        type: 'update',
        payload: {
          countryCodes: data,
        },
      });
    },

    // 重置所有参数
    *resetInit(_, { put }) {
      yield put({
        type: 'update',
        payload: initialValue,
      });
    },

    // 邮箱召回
    *postEmailRecall({ payload }, { call }) {
      try {
        yield call(services.postEmailRecall, payload);
      } catch (e) {
        const { msg } = e || {};
        console.error('msg', msg);
      }
    },

    // 手机召回
    *postPhoneRecall({ payload }, { call }) {
      try {
        yield call(services.postPhoneRecall, payload);
      } catch (e) {
        const { msg } = e || {};
        console.error('msg', msg);
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
    // 绑定三方账号
    *bindThirdParty({ payload = {} }, { call, select }) {
      // 从localstorage里面取rcode, utm_source, utm_campaign, utm_medium
      const persistenceQuery = queryPersistence.getPersistenceQuery();
      const utmAndRcodeOption = transformObjWithMap(persistenceQuery, UTM_RCODE_MAP);
      // 取出用户注册签署的协议
      const userTermList = yield select((s) => s[NAMESPACE]?.userTermList);
      const registerFlagList = yield select((s) => s[NAMESPACE]?.registerFlagList);

      // 取入注册第一步输入的账号信息
      const preRegisterData = yield select((s) => s[NAMESPACE]?.preRegisterData);
      const { phone, email, referralCode, countryCode } = preRegisterData || {};

      // 取入前面三方登录成功后的缓存信息
      const thirdPartyPlatform = yield select((s) => s.$entrance_signIn?.thirdPartyPlatform);
      const thirdPartyInfo = yield select((s) => s.$entrance_signIn?.thirdPartyInfo);

      // 取入6位验证码和验证类型
      const { code, validationType } = payload;
      const sendChannel = yield select((s) => s[NAMESPACE]?.sendChannel);
      const checkType = validationType === 'PHONE' ? sendChannel || 'SMS' : 'EMAIL';

      // 自动免密注册并绑定三方账号
      yield call(services.bindThirdParty, {
        anonymousId: getAnonymousID(),
        countryCode: phone ? countryCode : undefined,
        phone,
        email,
        referralCode,
        extPlatform: thirdPartyPlatform,
        extInfo: thirdPartyInfo,
        code,
        validationType: checkType,
        userTermSubRequests: JSON.stringify(userTermList || []),
        registerFlagRequests: (registerFlagList || []).join(','),
        ...utmAndRcodeOption,
      });
    },
    *pullInviterInfo({ payload }, { call, put }) {
      const { rcode } = payload;
      yield put({
        type: 'update',
        payload: {
          inviter: {
            loading: true,
            error: null,
            data: null,
          },
        },
      });
      try {
        const { success, data = {} } = yield call(services.getUserByRCode, { rcode });
        const { inviterCategory, rcodeType } = data;
        const isToBPartner = inviterCategory === 'TobReferral' && rcodeType === 'TOB';
        const isBroker = inviterCategory === 'BrokerReferral' && rcodeType === 'BROKER';
        if (success && (isToBPartner || isBroker)) {
          // toB 合伙人和经纪商才需要展示定制页
          const {
            inviterUid,
            cashbackRatio = 0,
            cashbackRatioText = '',
            // 合伙人邀请者配置的活动福利
            campaigns = [],
            message,
            avatar,
            nickname,
            email,
            phone,
          } = data;
          yield put({
            type: 'update',
            payload: {
              inviter: {
                loading: false,
                data: {
                  rcode,
                  rcodeType,
                  uid: inviterUid,
                  campaigns,
                  cashbackRatio,
                  cashbackRatioText,
                  message,
                  // 显示的昵称，逻辑 follow 用户中心
                  nickname: getUserNickname({
                    nickname,
                    email,
                    phone,
                  }),
                  email,
                  phone,
                  avatar,
                },
                error: null,
              },
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              inviter: {
                loading: false,
                error: null,
                data: null,
              },
            },
          });
        }
      } catch (err) {
        yield put({
          type: 'update',
          payload: {
            inviter: {
              loading: false,
              error: err,
              data: null,
            },
          },
        });
        console.error(err);
      }
    },
    *clearInviterInfo(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          inviter: {
            loading: false,
            error: null,
            data: null,
          },
        },
      });
    },
  },
});
