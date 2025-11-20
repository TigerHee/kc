/**
 * Owner: sean.shi@kupotech.com
 */
import { create } from 'zustand';
import { createStoreProvider } from 'tools';
import isObject from 'lodash-es/isObject';
import { kcsensorsManualTrack } from 'tools/sensors';
import QueryPersistence, { queryPersistence } from 'tools/base/QueryPersistence';
import { CAPTCHA_CODE, UTM_RCODE_MAP } from '../common/constants';

import { PHONE_BIZTYPE, SIGNUP_STEP } from './constants';
import {
  Options,
  getUserInfoUsingGet,
  sendRegisterMessageUsingGet,
  sendRegisterEmailUsingPost,
  validateSignUpCodeUsingPost,
  signUpByPhoneNumberAndEmailUsingPost,
  signUpByPhoneNumberUsingPost,
  signUpByEmailUsingPost,
  getCountryCodeListUsingGet,
  signUpByExternalUsingPost,
  SignUpByEmailUsingPostData,
  SignUpByPhoneNumberAndEmailUsingPostData,
  SignUpByPhoneNumberUsingPostData,
  GetCountryCodeListUsingGetResponse,
  SendRegisterEmailUsingPostData,
  UserResponse,
  SendRegisterMessageUsingGetData,
} from '../api/ucenter';
import {
  getMailSuffixesUsingGet,
  recalledByPhoneNumberUsingPost,
  recalledByEmailUsingPost,
  GetMailSuffixesUsingGetResponse,
  RecalledByEmailUsingPostData,
  RecalledByPhoneNumberUsingPostData,
} from '../api/market-operation';
import { getUserByRcodeUsingGet, GetUserByRcodeUsingGetResponse } from '../api/growth-ucenter';

import {
  reportPasswordError,
  getAnonymousID,
  loopCrypto,
  removeSpaceSE,
  resolveCountryCode,
  sensorsLogin,
  getUserNickname,
} from '../common/tools';
import { TThirdPartyPlatformInfo } from '../Login/model';

export type TUserResponse = UserResponse & { csrf?: string; finishUpgrade?: boolean };

type TFunction = (key: string, variables?: Record<string, any>) => string;

interface RetryAfterSeconds {
  time: number;
  deadline: number;
}

export interface InviterState {
  loading: boolean;
  error: any;
  data:
    | (Pick<
        Required<GetUserByRcodeUsingGetResponse>['data'],
        | 'campaigns'
        | 'cashbackRatio'
        | 'cashbackRatioText'
        | 'message'
        | 'nickname'
        | 'email'
        | 'phone'
        | 'avatar'
        | 'rcode'
        | 'rcodeType'
      > & {
        uid?: Required<GetUserByRcodeUsingGetResponse>['data']['inviterUid'];
      })
    | null;
}

interface IToast {
  error: (val: string) => void;
  warning: (val: string) => void;
  info: (val: string) => void;
  success: (val: string) => void;
}

type SendVerifyCodePayload = Partial<
  SendRegisterEmailUsingPostData['query'] | SendRegisterMessageUsingGetData['query']
> & {
  toast?: IToast;
  sendChannel?: string;
  fromAccount?: boolean;
  sendCodeSuccessCb?: () => void;
  t: TFunction;
  validationBiz?: 'REGISTER_SMS' | 'REGISTER' | 'REGISTER_EMAIL';
};

type VerifyCodePayload = (
  | {
      validationType: 'PHONE';
      countryCode: string;
    }
  | {
      validationType: 'EMAIL';
      countryCode?: string;
    }
) & {
  code?: string;
  toast?: IToast;
  phone?: string;
  email?: string;
  validationBiz: string;
  verifyCodeSuccessCb: () => void;
};

interface TrackResultParams {
  pagecate?: 'registerV2';
  hasReferralCode?: boolean;
  source?: string;
  is_futures_referral?: boolean;
  validationType?: 'PHONE' | 'EMAIL'; // 二步验证类型
  businessType?: 'signUp'; // 普通注册
  is_success?: boolean;
  fail_reason?: string;
  fail_reason_code?: string;
}

type SignUpPayload = {
  password: string;
  validationType: 'PHONE' | 'EMAIL';
  countryCode: string;
  referralCode: string;
  toast: IToast;
  t: TFunction;
  isKumex?: boolean;
  email?: string;
  phone?: string;
  needEmail?: string;
};

export interface SignupState {
  // 注册环节上一个步骤
  prevStepList: SIGNUP_STEP[];
  // 注册当前步骤
  currentStep: SIGNUP_STEP;
  userInfo: TUserResponse;
  isCount: boolean; // 验证码发送成功（第一步进入第二步）
  loading: boolean;
  verifyCodeLoading: boolean;
  isCodeRegx: boolean; // 校验码是否校验通过
  smsRetryAfterSeconds: RetryAfterSeconds | null;
  emailRetryAfterSeconds: RetryAfterSeconds | null;
  bizType: string;
  countryCodes: Required<GetCountryCodeListUsingGetResponse>['data'];
  sendChannel: string;
  emailSuffixes: Required<GetMailSuffixesUsingGetResponse>['data'];
  userTermList: { termId: string }[]; // 用户注册签署的协议列表
  registerFlagList: string[]; // 用户注册涉及的开关列表
  preRegisterData: {
    email?: string;
    phone?: string;
    countryCode?: string;
    referralCode?: string;
  }; // 注册表单数据（将分散在几步的表单数据统一放在这里面）
  // 当前是手机注册，还是邮箱注册
  registerType: string;
  email: string; // 手机注册需要绑定的邮箱
  phone: string; // 手机注册的号码
  isCaptchaOpen: boolean;
  sendVerifyCodePayload: SendVerifyCodePayload | null;
  registerTip: string;
  thirdPartyBindSuccess: boolean; // 注册成功且三方账号绑定成功
  // 邀请人信息
  inviter: InviterState;
}

export interface SignupActions {
  update: (payload: Partial<SignupState>) => void;
  nextStep: (nextStep: SIGNUP_STEP) => void;
  rebackStep: (onBack?: () => void) => void;
  getUserInfo: () => Promise<TUserResponse | undefined>;
  sendSMSVerifyCode: (payload: SendVerifyCodePayload) => Promise<void>;
  sendEmailVerifyCode: (payload: SendVerifyCodePayload) => Promise<void>;
  verifyCode: (payload: VerifyCodePayload) => Promise<void>;
  signUp: (payload: SignUpPayload, trackResultParams?: TrackResultParams) => Promise<any>;
  getCountryCodes: () => Promise<void>;
  resetInit: () => void;
  postEmailRecall: (payload: Required<RecalledByEmailUsingPostData>['query']) => Promise<void>;
  postPhoneRecall: (payload: Required<RecalledByPhoneNumberUsingPostData>['query']) => Promise<void>;
  getEmailSuffixes: () => Promise<void>;
  bindThirdParty: (
    payload: {
      code: string;
      validationType: 'PHONE' | 'EMAIL';
    } & Required<TThirdPartyPlatformInfo>
  ) => Promise<void>;
  pullInviterInfo: (payload: {
    rcode: string;
    updateInviteInfo?: (inviter?: InviterState['data'] | null) => void;
  }) => Promise<void>;
  clearInviterInfo: (payload?: { updateInviteInfo?: (inviter?: InviterState['data'] | null) => void }) => void;
}

const defaultState: SignupState = {
  // 注册环节上一个步骤
  prevStepList: [],
  // 注册当前步骤
  currentStep: SIGNUP_STEP.REGISTER_STEP_SET_ACCOUNT,
  userInfo: {},
  isCount: false, // 验证码发送成功（第一步进入第二步）
  verifyCodeLoading: false,
  loading: false,
  isCodeRegx: false, // 校验码是否校验通过
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

export const createSignupStore = (initState: Partial<SignupState>) => {
  return create<SignupState & SignupActions>((set, get) => ({
    ...defaultState,
    ...initState,

    update: payload => set(state => ({ ...state, ...payload })),

    // 注册流程执行下一步
    nextStep: nextStep => {
      const { prevStepList, currentStep } = get();
      set(() => ({
        currentStep: nextStep,
        prevStepList: [...prevStepList, currentStep],
      }));
    },

    // 回退到上一步
    rebackStep: onBack => {
      const { prevStepList } = get();
      // 如果有能返回的，则向前一步返回
      if (prevStepList.length > 0) {
        const lastStep = prevStepList[prevStepList.length - 1];
        set(() => ({
          currentStep: lastStep,
          prevStepList: prevStepList.slice(0, -1),
        }));
      } else {
        // 调用传入的 onBack
        onBack?.();
      }
    },

    // 获取用户信息
    getUserInfo: async () => {
      const { data } = await getUserInfoUsingGet();
      get().update({ userInfo: data });
      return data;
    },

    // 新版本 发送短信验证码
    sendSMSVerifyCode: async payload => {
      const { toast, sendChannel, fromAccount = false, t, sendCodeSuccessCb, ...others } = payload;
      const { preRegisterData } = get();
      const { phone, countryCode = '' } = preRegisterData || {};

      // 重置和验证码相关的状态
      get().update({
        loading: true,
        registerTip: undefined,
        isCount: false,
        isCodeRegx: false,
        smsRetryAfterSeconds: null,
      });

      try {
        kcsensorsManualTrack({ spm: ['signupSendSMSVerifyCode', '1'] });
        const result = await sendRegisterMessageUsingGet({
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
          'page_click'
        );

        if (code === '200') {
          kcsensorsManualTrack({ spm: ['signupSendSMSVerifyCode', '2'] });
          get().update({
            sendChannel,
            isCount: true,
            smsRetryAfterSeconds: {
              time: retryAfterSeconds || 0,
              deadline: new Date().getTime() + (retryAfterSeconds || 0) * 1000,
            },
          });
          // 发送验证码，如果没有达到最大次数，弹出当前这个正常提示
          if (!isMaxRetryTimes) {
            msg && toast?.success?.(msg);
          }
          // 如果有发送验证码成功后的回调
          if (sendCodeSuccessCb) {
            sendCodeSuccessCb();
          }
        }
        // 发送验证码，如果达到最大次数，则给出警告提示
        if (isMaxRetryTimes) {
          msg && toast?.warning?.(msg);
        }
      } catch (err: any) {
        if (err.code && err.code === CAPTCHA_CODE) {
          get().update({
            isCaptchaOpen: true,
            sendVerifyCodePayload: { ...payload },
          });
        } else {
          const msg = isObject(err)
            ? typeof (err as any).msg === 'string'
              ? (err as any).msg
              : JSON.stringify((err as any).msg)
            : err;
          if (msg) {
            // 发送验证码报错，输入账号页面只展示输入框下方提示内容，不再弹出 toast
            if (!fromAccount) {
              msg && toast?.error?.(msg);
            }
            get().update({ registerTip: msg });
          }
        }
      } finally {
        get().update({ loading: false });
      }
    },

    // 新版本 发送邮箱验证码
    sendEmailVerifyCode: async payload => {
      const { toast, sendChannel, t, fromAccount = false, sendCodeSuccessCb, ...others } = payload;
      const { preRegisterData } = get();
      const { email } = preRegisterData || {};
      const trackValidationType =
        others.validationBiz === 'REGISTER_EMAIL' ? 'signupBindEmailverify' : 'emailSecurityVerify';

      // 重置和验证码相关的状态
      get().update({
        loading: true,
        registerTip: undefined,
        isCount: false,
        isCodeRegx: false,
        emailRetryAfterSeconds: null,
      });

      try {
        kcsensorsManualTrack({ spm: ['signupSendEmailVerifyCode', '1'] });
        const result = await sendRegisterEmailUsingPost(
          {
            email: removeSpaceSE(email),
            ...others,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
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
          'page_click'
        );
        if (code === '200') {
          kcsensorsManualTrack({ spm: ['signupSendEmailVerifyCode', '2'] });
          get().update({
            sendChannel,
            isCount: true,
            emailRetryAfterSeconds: {
              time: retryAfterSeconds || 0,
              deadline: new Date().getTime() + (retryAfterSeconds || 0) * 1000,
            },
          });
          // 发送验证码，如果达到最大次数，则弹出下面的警告提示，不弹出当前这个正常提示
          if (!isMaxRetryTimes) {
            msg && toast?.success?.(msg);
          }
          // 如果有发送验证码成功后的回调
          if (sendCodeSuccessCb) {
            sendCodeSuccessCb();
          }
        }
        // 发送验证码，如果达到最大次数，则给出一个提示
        if (isMaxRetryTimes) {
          msg && toast?.warning?.(msg);
        }
      } catch (err: any) {
        if (err.code && err.code === CAPTCHA_CODE) {
          get().update({
            isCaptchaOpen: true,
            sendVerifyCodePayload: { ...payload },
          });
        } else {
          const msg = isObject(err)
            ? typeof (err as any).msg === 'string'
              ? (err as any).msg
              : JSON.stringify((err as any).msg)
            : err;
          if (msg) {
            // 发送验证码报错，输入账号页面只展示输入框下方提示内容，不再弹出 toast
            if (!fromAccount) {
              msg && toast?.error?.(msg);
            }
            get().update({ registerTip: msg });
          }
        }
      } finally {
        get().update({ loading: false });
      }
    },
    // 验证验证码
    // 如果 validationType 为 PHONE，则 code 一定存在，可以用 TypeScript 的联合类型来表达
    verifyCode: async payload => {
      get().update({ isCodeRegx: false, verifyCodeLoading: true });
      const { sendChannel } = get();
      const { code, validationType, toast, countryCode, phone, email, validationBiz, verifyCodeSuccessCb } = payload;
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
        const { code: dataCode, msg } = await validateSignUpCodeUsingPost(
          {
            address,
            code: removeSpaceSE(code),
            validationType: checkType,
            validationBiz,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        kcsensorsManualTrack(
          {
            spm: [trackValidationType, validationBiz === 'REGISTER_EMAIL' ? 'confirmResult' : 'submitResult'],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'submit',
              clickStatus: dataCode !== '200' ? 'VerificationError' : 'success',
            },
          },
          'page_click'
        );
        if (dataCode !== '200') {
          msg && toast?.error?.(msg);
          get().update({ isCodeRegx: false });
          return;
        }
        // 更新codeRegx isCount
        get().update({ isCodeRegx: true, isCount: false, verifyCodeLoading: false });
        // 如果有校验验证码成功回调，则执行
        if (verifyCodeSuccessCb) {
          verifyCodeSuccessCb();
        }
      } catch (err: any) {
        kcsensorsManualTrack(
          {
            spm: [trackValidationType, validationBiz === 'REGISTER_EMAIL' ? 'confirmResult' : 'submitResult'],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'submit',
              clickStatus: 'VerificationError',
            },
          },
          'page_click'
        );
        get().update({ isCodeRegx: false, verifyCodeLoading: false });
        const msg = isObject(err)
          ? typeof (err as any).msg === 'string'
            ? (err as any).msg
            : JSON.stringify((err as any).msg)
          : err;
        msg && toast?.error?.(msg);
      }
    },

    // 发起注册
    signUp: async (payload, trackResultParams = {}) => {
      const { needEmail, email, validationType, phone, countryCode, password, toast, t, isKumex, referralCode } =
        payload;
      try {
        // 取出用户注册签署的协议
        const { userTermList, registerFlagList } = get();
        // 从localstorage里面取rcode, utm_source, utm_campaign, utm_medium
        const persistenceQuery = queryPersistence.getPersistenceQuery();

        const utmAndRcodeOption = QueryPersistence.transformObjWithMap(persistenceQuery, UTM_RCODE_MAP);

        reportPasswordError(password, 'signup');
        let option:
          | Required<SignUpByEmailUsingPostData>['query']
          | Required<SignUpByPhoneNumberAndEmailUsingPostData>['body']
          | Required<SignUpByPhoneNumberUsingPostData>['query'] = {
          password: loopCrypto(password, 2),
          timeZone: (new Date().getTimezoneOffset() * 60).toString(),
          // 注册勾选的协议
          userTermSubRequests: JSON.stringify(userTermList || []),
          registerFlagRequests: (registerFlagList || []).join(','),
          ...utmAndRcodeOption,
          anonymousId: getAnonymousID(),
        };

        if (isKumex) {
          option.thirdPartReferralCode = 'kumex';
        }

        let signUpFn:
          | typeof signUpByEmailUsingPost
          | typeof signUpByPhoneNumberAndEmailUsingPost
          | typeof signUpByPhoneNumberUsingPost;

        const requestOption: Options<any> = {};
        if (needEmail) {
          kcsensorsManualTrack({ spm: ['phoneNeedEmailSignup', '1'] }, 'page_click');
          option = {
            referralCode: removeSpaceSE(referralCode),
            ...option,
            countryCode: resolveCountryCode(countryCode),
            phone: removeSpaceSE(phone),
            email: removeSpaceSE(email),
          } as Required<SignUpByPhoneNumberAndEmailUsingPostData>['body'];
          signUpFn = signUpByPhoneNumberAndEmailUsingPost;
        } else if (validationType === 'PHONE') {
          kcsensorsManualTrack({ spm: ['onlyPhoneSignup', '1'] }, 'page_click');
          option = {
            referralCode: removeSpaceSE(referralCode),
            ...option,
            countryCode: resolveCountryCode(countryCode),
            phone: removeSpaceSE(phone),
          } as Required<SignUpByPhoneNumberUsingPostData>['query'];
          signUpFn = signUpByPhoneNumberUsingPost;
          requestOption.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
          };
        } else {
          kcsensorsManualTrack({ spm: ['onlyEmailSignup', '1'] }, 'page_click');
          option = {
            referralCode: removeSpaceSE(referralCode),
            ...option,
            email: removeSpaceSE(email),
          } as Required<SignUpByEmailUsingPostData>['query'];
          signUpFn = signUpByEmailUsingPost;
          requestOption.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
          };
        }

        const { data, code: dataCode, msg } = await signUpFn(option, requestOption);
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
            'register_result'
          );
          msg && toast?.error?.(msg);
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
          'register_result'
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
          'login_result'
        );
        toast.info(t('sign_success'));
        return data;
      } catch (err: any) {
        const msg = isObject(err)
          ? typeof (err as any).msg === 'string'
            ? (err as any).msg
            : JSON.stringify((err as any).msg)
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
              fail_reason_code: isObject(err) ? JSON.stringify((err as any).code) || '' : '',
            },
          },
          'register_result'
        );
        return false;
      }
    },

    // 获取区号
    getCountryCodes: async () => {
      const { data } = await getCountryCodeListUsingGet();
      get().update({
        countryCodes: data,
      });
    },

    // 重置所有参数
    resetInit: () => {
      set({ ...defaultState, ...initState });
    },

    // 邮箱召回
    postEmailRecall: async payload => {
      try {
        await recalledByEmailUsingPost(payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } catch (e: any) {
        const { msg } = e || {};
        console.error('msg', msg);
      }
    },

    // 手机召回
    postPhoneRecall: async payload => {
      try {
        await recalledByPhoneNumberUsingPost(payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } catch (e: any) {
        const { msg } = e || {};
        console.error('msg', msg);
      }
    },

    // 获取邮箱后缀
    getEmailSuffixes: async () => {
      const { data } = await getMailSuffixesUsingGet();
      get().update({
        emailSuffixes: data || [],
      });
    },

    // 绑定三方账号
    bindThirdParty: async payload => {
      // 从localstorage里面取rcode, utm_source, utm_campaign, utm_medium
      const persistenceQuery = queryPersistence.getPersistenceQuery();
      const utmAndRcodeOption = QueryPersistence.transformObjWithMap(persistenceQuery, UTM_RCODE_MAP);
      // 取出用户注册签署的协议
      const { userTermList, registerFlagList, preRegisterData, sendChannel } = get();

      // 取入注册第一步输入的账号信息
      const { phone, email, referralCode, countryCode } = preRegisterData || {};

      // 取入6位验证码和验证类型
      const { code, validationType, extPlatform, extInfo } = payload;
      const checkType = validationType === 'PHONE' ? sendChannel || 'SMS' : 'EMAIL';

      // 自动免密注册并绑定三方账号
      await signUpByExternalUsingPost({
        anonymousId: getAnonymousID(),
        countryCode: phone ? countryCode : undefined,
        phone,
        email,
        referralCode,
        extPlatform,
        extInfo,
        code,
        validationType: checkType,
        userTermSubRequests: JSON.stringify(userTermList || []),
        registerFlagRequests: (registerFlagList || []).join(','),
        ...utmAndRcodeOption,
      });
    },

    pullInviterInfo: async payload => {
      const { rcode, updateInviteInfo } = payload;
      get().update({
        inviter: {
          loading: true,
          error: null,
          data: null,
        },
      });
      try {
        const { success, data = {} } = await getUserByRcodeUsingGet({ rcode });
        const { inviterCategory, rcodeType } = data;
        const isToBPartner = inviterCategory === 'TobReferral' && rcodeType?.toUpperCase() === 'TOB';
        const isBroker = inviterCategory === 'BrokerReferral' && rcodeType?.toUpperCase() === 'BROKER';
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
          const inviteData = {
            rcode,
            rcodeType,
            uid: inviterUid,
            campaigns,
            cashbackRatio,
            cashbackRatioText,
            message,
            nickname: getUserNickname({ nickname, email, phone }),
            email,
            phone,
            avatar,
          };
          updateInviteInfo?.(inviteData);
          get().update({
            inviter: {
              loading: false,
              data: inviteData,
              error: null,
            },
          });
        } else {
          get().update({
            inviter: {
              loading: false,
              error: null,
              data: null,
            },
          });
        }
      } catch (err) {
        get().update({
          inviter: {
            loading: false,
            error: err,
            data: null,
          },
        });
        console.error(err);
      }
    },

    clearInviterInfo: (payload = {}) => {
      const { updateInviteInfo } = payload;
      get().update({
        inviter: {
          loading: false,
          error: null,
          data: null,
        },
      });
      updateInviteInfo?.();
    },
  }));
};

export const { StoreProvider: SignupStoreProvider, useStoreValue: useSignupStore } = createStoreProvider<
  SignupState & SignupActions
>('SignupComponentStore', createSignupStore);
