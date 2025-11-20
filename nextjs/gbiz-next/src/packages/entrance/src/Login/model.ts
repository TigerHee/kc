/**
 * Owner: sean.shi@kupotech.com
 */

import { create } from 'zustand';
import { createStoreProvider, storage } from 'tools';
import { kcsensorsManualTrack } from 'tools/sensors';
import type { TFunction } from 'next-i18next';
import {
  checkIsNeedMailAuthorize,
  reportPasswordError,
  getAnonymousID,
  getJWTPath,
  getValidateResult,
  parseQuery,
  sensorsLogin,
  sentryReport,
  loopCrypto,
  getUtm,
  compose,
} from '../common/tools';
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
  LOGIN_STEP,
  THIRD_PARTY_ACCOUNT_DIVERSION_STEP,
  ACCOUNT_KEY,
  ACCOUNT_LOGIN_TAB_KEY,
  LOGIN_BIZ_TYPE,
  THIRD_PARTY_LOGIN_TYPE,
  SUB_ACCOUNT_LOGIN_TAB_KEY,
  ACCOUNT_LOGIN_STEP,
} from './constants';
import {
  UserResponse,
  LoginResponse,
  UserUpdateTermResponse,
  CountryCodeResponse,
  SendValidationCodeUsingPostData,
  ValidateLoginV2UsingPost1Data,
  queryWaitedSignTermsUsingGet,
  getUserInfoUsingGet,
  appSignUserTermUsingPost,
  getCountryCodeListUsingGet,
  ObtainQrTokenUsingPostData,
  checkQrTokenStatusUsingGet,
  validateLoginV2UsingPost1,
  getLoginVerifyResultUsingGet,
  ResendVerifyEmailResponse,
  checkAccountUsingPost1,
  getExternalAccountUsingPost,
  externalLoginUsingPost1,
  loginKickOutUsingPost,
  LoginKickOutUsingPostData,
  sendValidationCodeUsingPost,
  aggregationLoginV2UsingPost,
  obtainQrTokenUsingPost,
  resendLoginVerifyEmailUsingPost,
} from '../api/ucenter';
import { logout } from '../api/non-swagger-api';
import { getCsrf } from 'tools/csrf';
import { setCsrf } from 'tools/request';
import { getMailSuffixesUsingGet } from '../api/market-operation';

export type TUserResponse = UserResponse & { csrf?: string; finishUpgrade?: boolean };

interface IRetryAfterSeconds {
  time: number;
  deadline: number;
}

// 公共的状态
export interface ICommonLoginState {
  /** 用户输入的邮箱 */
  email: string;
  /** 用户输入的手机号 */
  phone: string;
  // 登陆环节上一个步骤
  prevStepList: LOGIN_STEP[];
  // 登陆当前步骤
  currentStep: LOGIN_STEP;
  /** 短信验证码倒计时 */
  smsRetryAfterSeconds: IRetryAfterSeconds | null;
  /** 邮箱验证码倒计时 */
  emailRetryAfterSeconds: IRetryAfterSeconds | null;
  countryCodes: CountryCodeResponse[];
  accountDup: false;
  accountLoginStep: ACCOUNT_LOGIN_STEP;
  token: string;
  validationType: string; // 验证码类型
  account: string; // 账号
  loadingSms: boolean;
  loadingEmail: boolean;
  isCaptchaOpen: boolean; // 是否打开人机
  sendVerifyCodePayload: {
    sendChannel: SendValidationCodeUsingPostData['query']['sendChannel'];
    toast?: { error: (val: string) => void; warning: (val: string) => void; info: (val: string) => void };
    onSendCodeSuccess?: () => void; // 发送验证码成功的回调
    onSendError?: (err: any) => void;
  } | null;
  isPasskeyLogin: boolean; // 是否是Passkey登录
  scanLoginShow: boolean; // 扫码登录是否展示
  sendChannel: SendValidationCodeUsingPostData['query']['sendChannel']; // 验证码发送渠道，MY_SMS-短信，MY_VOICE-语音，MY_EMAIL-邮箱 MY_前缀代码往自己邮箱或者手机发送验证码
  isShowMailAuthorizePage: boolean;
  loginLoading: boolean; // 正在调用一步登陆接口
  loginErrorCode: number | null; // 登录错误码（用于外层埋点）
  loginErrorTip?: string; // 登录错误提示
  emailSuffixes: string[];
  multiDeviceLoginParams: IMultiDeviceLoginParams; // 多设备登录相关参数
  submitLoading: boolean; // 提交按钮loading状态
  loginSuccessData: TUserResponse | null; // 登陆成功后调用回调的参数列表
  userUpdateTermList: UserUpdateTermResponse[]; // 用户待签署的协议列表
}

// 接口请求加载中状态
export interface IAPILoadingState {
  validateLoading: boolean; // 验证码校验loading状态
}

// 三方
export type TThirdPartyBindAccount =
  | { countryCode: string; phone: string; email?: never }
  | { email: string; countryCode?: never; phone?: never }
  | null;

export type TThirdPartyPlatformInfo = {
  /**
   * 第三方授权成功返回信息
   */
  extInfo?: {
    [key: string]: string;
  };
  /**
   * 第三方授权平台标识，如:TELEGRAM
   */
  extPlatform?: 'GOOGLE' | 'APPLE' | 'TELEGRAM' | '';
};

// 三方登录相关状态
export interface IThirdPartyState {
  // 三方注册绑定的流程步骤
  thirdPartyDiversionPrevStepList: THIRD_PARTY_ACCOUNT_DIVERSION_STEP[];
  thirdPartyDiversionStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP;
  // 三方账号登陆
  isThirdPartyLogin: boolean;
  // 三方绑定账号登陆
  isThirdPartyBindAccount: boolean;
  thirdPartyDecodeInfo: {
    countryCode?: string;
    email?: string;
    phone?: string;
    userInfo?: string;
  }; // 当前三方登录的解密信息（包含一些邮箱，用户名）
  thirdPartyInfo: {
    [key: string]: string;
  }; // 当前三方登录的返回信息
  thirdPartyPlatform: 'GOOGLE' | 'APPLE' | 'TELEGRAM' | ''; // 当前三方登录的平台
  // 三方注册绑定 输入的账号信息
  // { email } 或者 { countryCode, phone }
  thirdPartyBindAccountInfo: TThirdPartyBindAccount;
  // 三方场景的登录策略，1：三方绑定 直接登录，2:三方换绑登录
  loginDecision?: number;
}

// 扫码登录相关状态
export interface QrLoginState {
  initToken?: string; // 初始化扫码登录的token
  status?: string; // 扫码登录状态
  loginToken?: string; // 扫码登录的登录token
}

// 多设备登录相关状态
export interface IMultiDeviceLoginParams {
  dialogVisible: boolean; // 是否显示多设备登录弹窗
  deviceInfo: string; // 已登录设备信息
  trustDevice: boolean | null; // 本次登录是否信任当前设备，如果为true/false则表示用户是否勾选信任设备，如果为null，则表示直接跳过了登录二次验证
}

let JUMP_JWT = false;
let _loginType = '';

export type LoginState = ICommonLoginState & IAPILoadingState & IThirdPartyState & QrLoginState & LoginResponse;

const defaultState: LoginState = {
  validateLoading: false,
  prevStepList: [],
  currentStep: LOGIN_STEP.SIGN_IN_STEP_INPUT_ACCOUNT,
  countryCodes: [],
  thirdPartyDiversionPrevStepList: [],
  thirdPartyDiversionStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP.HOME,
  needValidations: [],
  smsRetryAfterSeconds: null, // 短信验证码倒计时
  emailRetryAfterSeconds: null, // 邮箱验证码倒计时
  accountDup: false,
  accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ONLY_ACCOUNT,
  type: 1,
  countryCode: '',
  email: '',
  phone: '',
  validationType: '',
  account: '',
  token: '',
  isCaptchaOpen: false,
  sendVerifyCodePayload: null,
  isPasskeyLogin: false,
  scanLoginShow: false,
  loadingSms: false,
  loadingEmail: false,
  sendChannel: 'MY_SMS',
  riskTag: '',
  verifyToken: '',
  verifyCheckToken: '',
  isShowMailAuthorizePage: false,
  loginLoading: false,
  loginErrorCode: null,
  loginErrorTip: undefined,
  emailSuffixes: [],
  multiDeviceLoginParams: {
    dialogVisible: false,
    deviceInfo: '',
    trustDevice: null,
  },
  submitLoading: false,
  // 三方账号登陆
  isThirdPartyLogin: false,
  // 三方绑定账号登陆
  isThirdPartyBindAccount: false,
  thirdPartyDecodeInfo: {},
  thirdPartyInfo: {},
  thirdPartyPlatform: '',
  // 三方注册绑定 输入的账号信息
  // { email } 或者 { countryCode, phone }
  thirdPartyBindAccountInfo: { phone: '', countryCode: '' },
  // 三方场景的登录策略，1：三方绑定 直接登录，2:三方换绑登录
  loginDecision: undefined,
  loginSuccessData: null,
  userUpdateTermList: [],
};

export type LoginActions = {
  update: (params: Partial<LoginState>) => void;
  reset: () => void;
  nextStep: (nextStep: LOGIN_STEP) => void;
  rebackStep: () => void;
  validate: (param: {
    payload: Partial<LoginState> & {
      trustDevice?: boolean;
      validations?: Record<string, string>;
      t?: (key: string, param?: any) => string;
      toast?: { error: (val: string) => void };
    };
    isPasskeyLogin?: boolean; // 是否是Passkey登录
    onSuccess?: (data: TUserResponse | null) => void;
    trackResultParams?: Record<string, any>; // 埋点参数
    onBack?: () => void; // 返回上一步的回调
  }) => void;
  loginV2: (param: {
    payload: Partial<LoginState> & { jwtLogin?: boolean; loginType?: string; password: string; mobileCode?: string };
    isThirdPartyBindAccount?: boolean; // 是否是三方绑定账号登录
    onSuccess?: (data: TUserResponse | null) => void;
    onOpenCaptcha?: () => void; // 打开验证码的回调
    trackResultParams?: Record<string, any>; // 埋点参数
  }) => Promise<void>;
  loginCallback: (param: {
    payload: Partial<LoginState>;
    onSuccess?: (data: TUserResponse | null) => void;
    trackResultParams?: Record<string, any>; // 埋点参数
  }) => Promise<void>;
  getUserUpdateTerm: (param: {
    loginSuccessData: TUserResponse | null;
    hasUpdateTermCallback?: () => void;
    noUpdateTermCallback?: () => void;
  }) => Promise<void>;
  sendVerifyCode: (params: {
    payload: Partial<LoginState> & {
      sendChannel: SendValidationCodeUsingPostData['query']['sendChannel'];
      toast?: { error: (val: string) => void; warning: (val: string) => void; info: (val: string) => void };
    };
    onSendCodeSuccess?: () => void; // 发送验证码成功的回调
    onSendError?: (err: any) => void; // 发送验证码失败的回调
  }) => Promise<void>;
  passkeyLogin: (param: {
    payload: Partial<LoginState> & { loginType?: string; account?: string; mobileCode?: string };
    passkeyLoginRes: { data?: LoginResponse };
    onSuccess?: (data: TUserResponse | null, loginToken?: string) => void;
    onOpenCaptcha?: () => void; // 打开验证码的回调
    trackResultParams?: Record<string, any>; // 埋点参数
  }) => Promise<void>;
  signTerm: (param: { userTermSubRequests: UserUpdateTermResponse[] }) => Promise<void>;
  getCountryCodes: () => Promise<void>;
  getToken: () => Promise<void>;
  getStatus: () => Promise<void>;
  resetScan: () => void;
  validateToken: (params: { trackResultParams?: Record<string, any> }) => Promise<boolean>;
  resendMail: () => Promise<{ data?: ResendVerifyEmailResponse; success?: boolean }>;
  getMailVerifyResult: (param: {
    onSuccess?: (data: TUserResponse | null) => void;
    trackResultParams?: Record<string, any>;
  }) => Promise<void>;
  getEmailSuffixes: () => Promise<void>;
  checkAccount: (payload: TThirdPartyPlatformInfo & TThirdPartyBindAccount) => Promise<any>;
  getThirdPartyBaseInfo: (payload: { extInfo: any; extPlatform: string }) => Promise<void>;
  thirdPartyLoginSubmit: (params: {
    payload: TThirdPartyPlatformInfo;
    onSuccess?: (data: TUserResponse | null) => void;
  }) => Promise<void>;
  thirdPartyNextStep: (nextStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP) => void;
  thirdPartyRebackStep: (onBack?: () => void) => void;
  logout: (param: { to?: string }) => Promise<void>;
  loginKickOut: (param: {
    payload: LoginKickOutUsingPostData['query'];
    trackResultParams?: Record<string, any>;
  }) => Promise<{ data?: TUserResponse & { finishUpgrade?: boolean }; success: boolean; msg?: string }>;
};

export const createLoginStore = (initState: Partial<LoginState> = {}) => {
  return create<LoginState & LoginActions>((set, get) => ({
    ...defaultState,
    ...initState,

    // 通用更新
    update: payload => {
      // 检查是否有实际变化，避免不必要的状态更新
      const currentState = get();
      const hasChanges = Object.keys(payload).some(key => {
        const currentValue = currentState[key as keyof LoginState];
        const newValue = payload[key as keyof LoginState];

        // 对于对象类型，进行深度比较
        if (
          typeof currentValue === 'object' &&
          typeof newValue === 'object' &&
          currentValue !== null &&
          newValue !== null
        ) {
          return JSON.stringify(currentValue) !== JSON.stringify(newValue);
        }

        return currentValue !== newValue;
      });

      if (hasChanges) {
        set(state => ({ ...state, ...payload }));
      }
    },
    reset: () => set(() => ({ ...initState, ...defaultState })),

    // 切换到下一个步骤
    nextStep: nextStep => {
      const { prevStepList, currentStep } = get();
      // 防止重复设置相同步骤，避免无限循环
      if (currentStep === nextStep) return;

      set(() => ({
        currentStep: nextStep,
        prevStepList: [...prevStepList, currentStep],
      }));
    },

    // 返回上一个步骤
    rebackStep: () => {
      const { prevStepList } = get();
      if (prevStepList.length > 0) {
        const lastStep = prevStepList[prevStepList.length - 1];
        set(() => ({
          currentStep: lastStep,
          prevStepList: prevStepList.slice(0, -1),
        }));
      } else {
        // 如果没有上一步，则重置登录状态
        get().reset();
      }
    },

    // 签署用户协议
    signTerm: async ({ userTermSubRequests }) => {
      try {
        await appSignUserTermUsingPost({ userTermSubRequests });
      } catch (err: any) {
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

    // 登陆成功之后获取用户待更新协议
    getUserUpdateTerm: async ({ loginSuccessData, hasUpdateTermCallback, noUpdateTermCallback }) => {
      // 清空待签协议和登录成功数据
      set(state => ({
        ...state,
        userUpdateTermList: [],
        loginSuccessData,
      }));
      try {
        const { data } = await queryWaitedSignTermsUsingGet();
        if (data && data.length) {
          // 没有csrf则先获取
          if (!getCsrf()) {
            const res = await getUserInfoUsingGet();
            if ((res?.data as TUserResponse)?.csrf) {
              setCsrf((res?.data as TUserResponse)?.csrf);
            }
          }
          // 有csrf才能执行签署协议逻辑
          if (getCsrf()) {
            set(state => ({
              ...state,
              userUpdateTermList: data,
            }));
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
      } catch (err: any) {
        // 签署接口静默失败，不能影响登陆流程
        console.log('query waited sign term error...', err);
        sentryReport({
          level: 'warning',
          message: `get user update term error: ${err?.message}`,
          tags: {
            errorType: 'get_user_update_term_error',
          },
        });
        noUpdateTermCallback?.();
      }
    },

    // 发送验证码
    sendVerifyCode: async params => {
      const { payload, onSendCodeSuccess, onSendError } = params;
      const { toast, sendChannel } = payload;
      const { token, isThirdPartyLogin, scanLoginShow } = get();

      // 每次发送验证码都需要根据传入的sendChannel来判断发送的类型是手机还是邮箱，再去做对应的状态处理
      const _sendChannel = sendChannel === 'MY_VOICE' ? 'MY_SMS' : sendChannel;
      const _sendType = _sendChannel === 'MY_SMS' ? 'phone' : 'email';
      const _retryTypeKey = _sendType === 'phone' ? 'smsRetryAfterSeconds' : 'emailRetryAfterSeconds';
      const _sendLoadingKey = _sendType === 'phone' ? 'loadingSms' : 'loadingEmail';

      try {
        set((state: any) => ({ ...state, [_sendLoadingKey]: true }));
        const result = await sendValidationCodeUsingPost(
          {
            token,
            bizType: isThirdPartyLogin || scanLoginShow ? THIRD_PARTY_LOGIN_TYPE : LOGIN_BIZ_TYPE,
            sendChannel,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        const { data: { maxRetryTimes = 0, retryTimes = 0, retryAfterSeconds = 0 } = {}, msg = '', success } = result;
        // 发送验证码，如果达到最大次数，则给出一个提示
        if (maxRetryTimes === retryTimes) {
          toast?.warning(msg);
        }
        if (success) {
          const _payload: any = {
            sendChannel,
          };
          if (_retryTypeKey === 'smsRetryAfterSeconds') {
            _payload.smsRetryAfterSeconds = {
              time: retryAfterSeconds,
              deadline: Date.now() + retryAfterSeconds * 1000,
            };
          } else {
            _payload.emailRetryAfterSeconds = {
              time: retryAfterSeconds,
              deadline: Date.now() + retryAfterSeconds * 1000,
            };
          }
          set((state: any) => ({ ...state, ..._payload }));
          onSendCodeSuccess?.();
          if (msg && maxRetryTimes !== retryTimes) {
            toast?.info(msg);
          }
        }
      } catch (err: any) {
        if (err?.response?.data?.msg) {
          toast?.error(err.response.data.msg);
          return;
        }
        if (err?.code && err.code === CAPTCHA_CODE) {
          set((state: any) => ({
            ...state,
            isCaptchaOpen: true,
            sendVerifyCodePayload: { ...payload, onSendCodeSuccess, onSendError },
          }));
        } else {
          const msg = typeof err === 'object' ? JSON.stringify(err.msg) : err;
          toast?.error(msg);
        }
        onSendError?.(err);
      } finally {
        set((state: any) => ({ ...state, [_sendLoadingKey]: false }));
      }
    },

    // 获取国家区号列表
    getCountryCodes: async () => {
      try {
        const res = await getCountryCodeListUsingGet();
        set(state => ({
          ...state,
          countryCodes: res?.data || [],
        }));
      } catch (error) {
        // 可根据需要添加错误处理
        set(state => ({
          ...state,
          countryCodes: [],
        }));
      }
    },

    // 获取邮箱后缀
    getEmailSuffixes: async (): Promise<void> => {
      const { data } = await getMailSuffixesUsingGet();
      set(state => ({
        ...state,
        emailSuffixes: data || [],
      }));
    },

    // 二步登陆校验
    validate: async ({ payload, isPasskeyLogin, onSuccess, trackResultParams = {}, onBack }) => {
      // 启动按钮 loading
      set(state => ({ ...state, gfaBtnLoading: true, validateLoading: true }));

      const { t, toast, account, validationType, validations, ...rest } = payload || {};
      const {
        token,
        finishUpgrade,
        isThirdPartyLogin,
        isThirdPartyBindAccount,
        loginDecision,
        thirdPartyPlatform,
        thirdPartyDiversionStep,
      } = get();

      let preSpmId: string[] = [];
      if (isThirdPartyLogin) {
        preSpmId = ['thirdAccount', thirdPartyPlatform];
      } else if (isThirdPartyBindAccount) {
        if (thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN) {
          // 登陆绑定
          preSpmId = ['loginExistingKCAccount', 'nextButton'];
        } else if (thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT) {
          preSpmId = ['bindExistingKCAccountInputPassword', 'nextButton'];
        }
      }

      try {
        // 格式化验证码参数
        let formatValidationsForGateway = {};
        if (validationType !== 'EMPTY') {
          formatValidationsForGateway = Object.keys(validations || {}).reduce((sum, cur) => {
            return { ...sum, [`${cur.toUpperCase()}`]: (validations || {})[cur] };
          }, {});
        } else {
          formatValidationsForGateway = { EMPTY: '' };
        }

        const validateParam: ValidateLoginV2UsingPost1Data['query'] = {
          ...rest,
          token,
          validations: JSON.stringify(formatValidationsForGateway),
          anonymousId: getAnonymousID(),
        };

        // 三方绑定 登陆场景
        if (loginDecision && isThirdPartyBindAccount) {
          validateParam.loginDecision = loginDecision;
        }

        const {
          data,
          success,
          msg: errorMsg,
          code: errorCode,
        } = await validateLoginV2UsingPost1(validateParam, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (success && data) {
          const _type = _loginType || ACCOUNT_LOGIN_TAB_KEY;
          storage.setItem('kucoinv2_login_key', _type);
          sensorsLogin(String(data.uid), String(data.honorLevel));
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType,
                businessType: isPasskeyLogin ? 'passkey' : isThirdPartyLogin ? 'thirdPartyLogin' : 'v2Login',
                is_success: true,
                is_login: true,
              },
            },
            'login_result'
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

          await onSuccess?.({ ...data, finishUpgrade });
        } else {
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType,
                businessType: isPasskeyLogin ? 'passkey' : isThirdPartyLogin ? 'thirdPartyLogin' : 'v2Login',
                is_success: false,
                fail_reason: errorMsg,
                fail_reason_code: errorCode,
              },
            },
            'login_result'
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
      } catch (e: any) {
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
          if (onBack) {
            onBack();
          } else {
            get().reset();
            // 重置状态
          }
        };
        let alreadyToast = false;
        if (e?.response?.data?.msg) {
          toast && toast.error(e.response.data.msg);
          back?.();
          set(state => ({ ...state, gfaBtnLoading: false }));
          return;
        }

        const { code, msg, data } = e || {};
        if (code === VALIDATE_ERROR) {
          const { errorToastKeyList, hasMaxLimit } = getValidateResult(data?.validationResultResponses || []);
          if (hasMaxLimit) {
            toast && toast.error(msg || '');
            alreadyToast = true;
          }
          const errorCount = data?.validationResultResponses?.length || 0;
          if (!hasMaxLimit && errorCount === 1) {
            t && toast && toast.error(t('402de1b872464000ac97', { type: t(errorToastKeyList[0]) }));
            alreadyToast = true;
          } else if (!hasMaxLimit && errorCount >= 2) {
            alreadyToast = true;
            toast &&
              t &&
              toast.error(
                t('ac466db4cd4f4000a02f', {
                  type1: t(errorToastKeyList[0]),
                  type2: t(errorToastKeyList[1]),
                })
              );
          }
        }
        if (code === MULTI_DEVICE_LIMIT) {
          alreadyToast = true;
          set(state => ({
            ...state,
            multiDeviceLoginParams: {
              dialogVisible: true,
              deviceInfo: msg,
              trustDevice: typeof payload?.trustDevice === 'boolean' ? payload?.trustDevice : null,
            },
          }));
        }
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              ...trackResultParams,
              validationType,
              businessType: isPasskeyLogin ? 'passkey' : isThirdPartyLogin ? 'thirdPartyLogin' : 'v2Login',
              is_success: false,
              fail_reason: e && e.msg,
              fail_reason_code: e && e.code,
            },
          },
          'login_result'
        );

        if (e.code && e.code === TOKEN_INVALID_CODE) {
          set(state => ({ ...state, needValidations: [] }));
          back?.();
        }
        !alreadyToast && toast && toast.error(msg || '');
      } finally {
        set(state => ({ ...state, gfaBtnLoading: false, validateLoading: false }));
      }
    },

    // 重新发送登录授权邮件
    resendMail: async () => {
      const { verifyToken, verifyCheckToken } = get();
      try {
        const res = await resendLoginVerifyEmailUsingPost(
          { verifyToken, verifyCheckToken },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        set(state => ({
          ...state,
          ...(res.data || {}),
        }));
        return res;
      } catch (e: any) {
        sentryReport({
          level: 'warning',
          message: `resendMail error: ${e?.message}`,
          tags: { errorType: 'resend_mail_error' },
        });
        throw e;
      }
    },

    // 获取登录授权验证结果
    getMailVerifyResult: async ({
      onSuccess,
      trackResultParams = {},
    }: {
      onSuccess?: (data: any) => void;
      trackResultParams?: Record<string, any>;
    }) => {
      const { verifyToken, verifyCheckToken } = get();
      if (!verifyToken || !verifyCheckToken) return;
      try {
        const { data } = await getLoginVerifyResultUsingGet({ verifyToken, verifyCheckToken });
        if (data?.status === 'success') {
          await get().loginCallback({
            onSuccess,
            trackResultParams,
            payload: {
              ...(data?.loginInfo || {}),
              isShowMailAuthorizePage: !data?.loginInfo?.needValidations?.length,
            },
          });
        }
      } catch (e: any) {
        // 邮箱验证失效 或 token 失效
        if (e?.code === MAIL_AUTHORIZE_EXPIRE_CODE || e?.code === TOKEN_INVALID_CODE) {
          get().reset();
        }
      }
    },

    // 登陆回调
    loginCallback: async ({ payload, onSuccess, trackResultParams = {} }) => {
      const isNeedMailAuthorize = checkIsNeedMailAuthorize(payload);
      const parsed = parseQuery() as { return_to?: string };
      const { return_to } = parsed;
      if (payload.jwtToken && return_to) {
        if (!JUMP_JWT) {
          JUMP_JWT = true;
          window.location.href = getJWTPath('zendesk', payload.jwtToken, return_to);
        }
        return;
      }
      set(state => ({
        ...state,
        type: payload.type || 1,
        countryCode: payload.countryCode || '',
        token: payload.loginToken,
        loginLoading: false,
        needValidations: payload.needValidations || [],
        // 明确指定需要的属性，避免展开整个payload导致状态覆盖
        isThirdPartyLogin: payload.isThirdPartyLogin ?? state.isThirdPartyLogin,
        isPasskeyLogin: payload.isPasskeyLogin ?? state.isPasskeyLogin,
        scanLoginShow: payload.scanLoginShow ?? state.scanLoginShow,
        isShowMailAuthorizePage: payload.isShowMailAuthorizePage ?? state.isShowMailAuthorizePage,
        account: payload.account ?? state.account,
        email: payload.email ?? state.email,
        phone: payload.phone ?? state.phone,
        riskTag: payload.riskTag ?? state.riskTag,
        verifyToken: payload.verifyToken ?? state.verifyToken,
        verifyCheckToken: payload.verifyCheckToken ?? state.verifyCheckToken,
        finishUpgrade: payload.finishUpgrade ?? state.finishUpgrade,
        jwtToken: payload.jwtToken ?? state.jwtToken,
        loginSafeWord: payload.loginSafeWord ?? state.loginSafeWord,
      }));
      if (!isNeedMailAuthorize && !(payload.needValidations || []).length) {
        await get().validate({
          payload: { validationType: 'EMPTY', account: payload.account },
          isPasskeyLogin: payload.isPasskeyLogin,
          onSuccess,
          trackResultParams,
        });
      } else {
        get().nextStep(
          isNeedMailAuthorize ? LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK : LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT
        );
      }
    },

    // 账号(包含子账号)密码登陆
    loginV2: async ({ payload, isThirdPartyBindAccount = false, onSuccess, onOpenCaptcha, trackResultParams = {} }) => {
      set(state => ({
        ...state,
        loginLoading: true,
        loginErrorTip: undefined,
        loginErrorCode: null,
        isThirdPartyBindAccount,
      }));
      try {
        const { password, loginType } = payload;
        reportPasswordError(password, 'login');
        _loginType = loginType || '';
        const cryptoPassword = loopCrypto(password, 2);
        let params = { ...payload, password: cryptoPassword, loginType: undefined };
        const parsed = parseQuery() as { jwtLogin?: boolean };
        const { jwtLogin } = parsed;
        if (jwtLogin) params.jwtLogin = !!jwtLogin;
        const utm = getUtm();
        if (utm) params = { ...params, ...utm };
        const res = await aggregationLoginV2UsingPost(
          { ...params },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        kcsensorsManualTrack({
          kc_pageid: 'B1login',
          spm: ['B1login', ['submit', '1']],
        });
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(res.data || {});
        await get().loginCallback({
          onSuccess,
          trackResultParams,
          payload: {
            ...(res.data || {}),
            needValidations: Array.isArray(res?.data?.needValidations) ? res.data.needValidations : [],
            isThirdPartyLogin: false,
            scanLoginShow: false,
            isPasskeyLogin: false,
            isShowMailAuthorizePage: isNeedMailAuthorize,
          },
        });
        if (_loginType === ACCOUNT_LOGIN_TAB_KEY) {
          if (ACCOUNT_KEY?.[ACCOUNT_LOGIN_TAB_KEY]) {
            storage.setItem(
              ACCOUNT_KEY[ACCOUNT_LOGIN_TAB_KEY],
              window?.btoa?.(payload.phone || payload.account || '') || ''
            );
            storage.setItem(
              ACCOUNT_KEY.mobileCode,
              payload.mobileCode && payload.mobileCode !== '0' ? payload.mobileCode : ''
            );
          }
        } else if (ACCOUNT_KEY?.[SUB_ACCOUNT_LOGIN_TAB_KEY]) {
          storage.setItem(ACCOUNT_KEY[SUB_ACCOUNT_LOGIN_TAB_KEY], window?.btoa?.(payload.account || '') || '');
        }
      } catch (e: any) {
        if (e.code && e.code === CAPTCHA_CODE && onOpenCaptcha) {
          onOpenCaptcha();
        } else {
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                ...trackResultParams,
                validationType: 'NONE',
                businessType: 'v2Login',
                is_success: false,
                fail_reason: e.msg,
                fail_reason_code: e.code,
              },
            },
            'login_result'
          );
          set(state => ({ ...state, loginLoading: false }));
          if (e.code && e.msg) {
            set(state => ({
              ...state,
              loginErrorCode: e.code,
              loginErrorTip: e.msg,
            }));
            return;
          }
          throw e;
        }
      }
    },

    // passkey 登陆
    passkeyLogin: async ({ payload, passkeyLoginRes, onSuccess, onOpenCaptcha, trackResultParams = {} }) => {
      set(state => ({
        ...state,
        loginLoading: true,
        loginErrorTip: undefined,
        loginErrorCode: null,
      }));
      try {
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(passkeyLoginRes.data || {});
        const { loginType } = payload;
        _loginType = loginType || '';

        // 复用 loginCallback 逻辑
        await get().loginCallback({
          onSuccess,
          trackResultParams,
          payload: {
            finishUpgrade: passkeyLoginRes?.data?.finishUpgrade,
            countryCode: passkeyLoginRes?.data?.countryCode,
            email: passkeyLoginRes?.data?.email,
            jwtToken: passkeyLoginRes?.data?.jwtToken,
            loginSafeWord: passkeyLoginRes?.data?.loginSafeWord,
            loginToken: passkeyLoginRes?.data?.loginToken,
            needValidations: Array.isArray(passkeyLoginRes?.data?.needValidations)
              ? passkeyLoginRes.data.needValidations
              : [],
            phone: passkeyLoginRes?.data?.phone,
            riskTag: passkeyLoginRes?.data?.riskTag,
            type: passkeyLoginRes?.data?.type,
            verifyCheckToken: passkeyLoginRes?.data?.verifyCheckToken,
            verifyToken: passkeyLoginRes?.data?.verifyToken,
            isShowMailAuthorizePage: isNeedMailAuthorize,
            account: payload?.account,
            isPasskeyLogin: true,
            isThirdPartyLogin: false,
            isThirdPartyBindAccount: false,
            scanLoginShow: false,
          },
        });

        if (_loginType === ACCOUNT_LOGIN_TAB_KEY) {
          if (ACCOUNT_KEY?.[ACCOUNT_LOGIN_TAB_KEY]) {
            storage.setItem(
              ACCOUNT_KEY[ACCOUNT_LOGIN_TAB_KEY],
              window?.btoa?.(payload.phone || payload.account || '') || ''
            );
            storage.setItem(
              ACCOUNT_KEY.mobileCode,
              payload.mobileCode && payload.mobileCode !== '0' ? payload.mobileCode : ''
            );
          }
        } else if (ACCOUNT_KEY?.[SUB_ACCOUNT_LOGIN_TAB_KEY]) {
          storage.setItem(ACCOUNT_KEY[SUB_ACCOUNT_LOGIN_TAB_KEY], window?.btoa?.(payload.account || '') || '');
        }
      } catch (e: any) {
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
                businessType: payload?.account ? 'accountPasskeyLogin' : 'passkeyLogin',
                is_success: false,
                fail_reason: e.msg,
                fail_reason_code: e.code,
              },
            },
            'login_result'
          );
          set(state => ({ ...state, loginLoading: false }));
          if (e.code && e.msg) {
            set(state => ({
              ...state,
              loginErrorCode: e.code,
              loginErrorTip: e.msg,
            }));
            return;
          }
          throw e;
        }
      }
    },

    // 重置扫码登录状态
    resetScan: () => {
      set(state => ({
        ...state,
        initToken: undefined,
        status: undefined,
        loginToken: undefined,
      }));
    },
    // 初始化获取token
    getToken: async () => {
      try {
        const utm = getUtm();
        const parsed = parseQuery() as { jwtLogin?: boolean };
        const { jwtLogin } = parsed;
        let params: ObtainQrTokenUsingPostData['query'] = {};
        if (jwtLogin) {
          params.jwtLogin = !!jwtLogin;
        }
        if (utm) {
          params = {
            ...params,
            ...utm,
          };
        }
        const { data = {} } = await obtainQrTokenUsingPost(params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        set(state => ({
          ...state,
          initToken: data.token,
        }));
      } catch (e: any) {
        // 可根据需要添加错误处理
        sentryReport({
          level: 'warning',
          message: `getToken error: ${e?.message}`,
          tags: { errorType: 'get_token_error' },
        });
      }
    },
    // 扫码登录状态轮询
    getStatus: async () => {
      const { initToken, scanLoginShow } = get();
      if (!scanLoginShow || !initToken) {
        return;
      }
      try {
        const { data } = await checkQrTokenStatusUsingGet({ qrToken: initToken });
        const { jwtToken, needValidations, loginToken } = data || {};
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(data || {});
        if (jwtToken) {
          const parsed = parseQuery() as { return_to?: string };
          const { return_to } = parsed;
          if (return_to) {
            if (!JUMP_JWT) {
              JUMP_JWT = true;
              window.location.href = getJWTPath('zendesk', jwtToken, return_to);
            }
            return;
          }
        }
        const validations = Array.isArray(needValidations) ? needValidations : [];
        set(state => ({
          ...state,
          ...data,
          token: loginToken,
          needValidations: validations,
          isShowMailAuthorizePage: isNeedMailAuthorize,
        }));
        if (isNeedMailAuthorize || validations.length) {
          get().nextStep(
            isNeedMailAuthorize ? LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK : LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT
          );
        }
      } catch (e: any) {
        sentryReport({
          level: 'warning',
          message: `getStatus error: ${e?.message}`,
          tags: { errorType: 'get_status_error' },
        });
      }
    },
    // 扫码登录验证
    validateToken: async ({ trackResultParams = {} }: { trackResultParams?: Record<string, any> }) => {
      const { loginToken } = get();
      try {
        await validateLoginV2UsingPost1(
          {
            token: loginToken!,
            // bizType: LOGIN_BIZ_TYPE,
            // TODO: 这里的bizType需要确认是否需要传递
            validations: JSON.stringify({ QR_CODE: '' }),
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        kcsensorsManualTrack(
          {
            checkID: false,
            data: { ...trackResultParams, businessType: 'scan_code', is_success: true },
          },
          'login_result'
        );
        return true;
      } catch (e: any) {
        if (e?.code === MULTI_DEVICE_LIMIT) {
          set(state => ({
            ...state,
            multiDeviceLoginParams: {
              dialogVisible: true,
              deviceInfo: e.msg,
              trustDevice: null,
            },
          }));
        } else {
          kcsensorsManualTrack(
            {
              checkID: false,
              data: { ...trackResultParams, businessType: 'scan_code', is_success: false },
            },
            'login_result'
          );
          throw e;
        }
        return false;
      }
    },

    // 查询用户是否已存在
    checkAccount: async payload => {
      const { extInfo, extPlatform, ...rest } = payload;
      // 保存用户输入的账号信息，后续绑定三方账号时使用
      set(state => ({
        ...state,
        loginDecision: undefined,
        thirdPartyBindAccountInfo: rest,
      }));
      const { data } = await checkAccountUsingPost1(payload);
      return data;
    },
    // 查询当前三方登录信息的基础信息，如邮箱、用户名
    getThirdPartyBaseInfo: async payload => {
      const { data } = await getExternalAccountUsingPost(payload);
      set(state => ({
        ...state,
        thirdPartyDecodeInfo: data || {},
      }));
    },
    // 发起三方登录
    thirdPartyLoginSubmit: async params => {
      const { payload, onSuccess } = params;
      set(state => ({
        ...state,
        loginLoading: true,
        loginErrorTip: undefined,
        loginErrorCode: null,
        thirdPartyDecodeInfo: {},
        isThirdPartyLogin: false,
        isThirdPartyBindAccount: false,
        thirdPartyBindAccountInfo: null,
        loginDecision: undefined,
        thirdPartyInfo: payload?.extInfo,
        thirdPartyPlatform: payload?.extPlatform || '',
      }));
      try {
        const utm = getUtm();
        const reqParams = { ...payload, ...utm };
        const res = await externalLoginUsingPost1(reqParams);
        const isNeedMailAuthorize = checkIsNeedMailAuthorize(res.data || {});
        if (res?.data?.needValidations?.length) {
          kcsensorsManualTrack(
            { checkID: false, data: { accountType: payload?.extPlatform, '2faStart': 'success' } },
            'thirdAccountLogin'
          );
        }
        // 复用 loginCallback 逻辑
        await get().loginCallback({
          onSuccess,
          payload: {
            finishUpgrade: res?.data?.finishUpgrade,
            countryCode: res?.data?.countryCode,
            email: res?.data?.email,
            jwtToken: res?.data?.jwtToken,
            loginSafeWord: res?.data?.loginSafeWord,
            loginToken: res?.data?.loginToken,
            needValidations: Array.isArray(res?.data?.needValidations) ? res.data.needValidations : [],
            isThirdPartyLogin: true,
            phone: res?.data?.phone,
            riskTag: res?.data?.riskTag,
            type: res?.data?.type,
            verifyCheckToken: res?.data?.verifyCheckToken,
            verifyToken: res?.data?.verifyToken,
            isShowMailAuthorizePage: isNeedMailAuthorize,
          },
        });
      } catch (e: any) {
        if (e?.code === THIRD_PARTY_SIMPLE_REGISTER || e?.code === THIRD_PARTY_NO_BINDING) {
          // 极简注册或三方注册分流时，需请求三方基本信息
          if (payload?.extInfo && payload?.extPlatform) {
            await get().getThirdPartyBaseInfo({
              extInfo: payload.extInfo,
              extPlatform: payload.extPlatform,
            });
          }
        }
        set(state => ({ ...state, loginLoading: false }));
        if (e?.code === THIRD_PARTY_SIMPLE_REGISTER) {
          get().nextStep(LOGIN_STEP.SIGN_IN_STEP_THIRD_PARTY_SIMPLE);
        } else if (e?.code === THIRD_PARTY_NO_BINDING) {
          kcsensorsManualTrack(
            {
              checkID: false,
              data: { accountType: payload?.extPlatform, whichProcess1: 'toBond' },
            },
            'thirdAccountLogin'
          );
          get().nextStep(LOGIN_STEP.SIGN_IN_STEP_BIND_THIRD_PARTY);
        } else {
          kcsensorsManualTrack(
            {
              checkID: false,
              data: {
                accountType: payload?.extPlatform,
                whichProcess1: 'noBond',
                failReason: e?.code,
              },
            },
            'thirdAccountLogin'
          );
          if (e.code && e.msg) {
            set(state => ({ ...state, loginErrorTip: e.msg }));
            return;
          }
          throw e;
        }
      }
    },
    // 三方绑定 下一步
    thirdPartyNextStep: (nextStep: THIRD_PARTY_ACCOUNT_DIVERSION_STEP) => {
      const { thirdPartyDiversionStep, thirdPartyDiversionPrevStepList } = get();
      // 防止重复设置相同步骤，避免无限循环
      if (thirdPartyDiversionStep === nextStep) return;

      set(state => ({
        ...state,
        thirdPartyDiversionStep: nextStep,
        thirdPartyDiversionPrevStepList: [...thirdPartyDiversionPrevStepList, thirdPartyDiversionStep],
      }));
    },
    // 三方绑定 回退
    thirdPartyRebackStep: (onBack?: () => void) => {
      const { thirdPartyDiversionPrevStepList } = get();
      if (thirdPartyDiversionPrevStepList.length) {
        const prevList = [...thirdPartyDiversionPrevStepList];
        const currentStep = prevList.pop()!;
        set(state => ({
          ...state,
          thirdPartyDiversionStep: currentStep,
          thirdPartyDiversionPrevStepList: prevList,
        }));
      } else {
        onBack?.();
      }
    },

    // 确认登录并踢出其他Web设备
    loginKickOut: async ({ payload, trackResultParams = {} }) => {
      try {
        const res = await loginKickOutUsingPost(payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        const data = res?.data;
        if (data) {
          // finishUpgrade 直接取 zustand 状态
          const { finishUpgrade } = get();
          kcsensorsManualTrack(
            {
              checkID: false,
              data: { ...trackResultParams, businessType: 'kick_out', is_success: true },
            },
            'login_result'
          );
          return { success: true, data: { ...data, finishUpgrade } };
        }
        kcsensorsManualTrack(
          {
            checkID: false,
            data: { ...trackResultParams, businessType: 'kick_out', is_success: false },
          },
          'login_result'
        );
        return { success: false, msg: 'Network Error' };
      } catch (e: any) {
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
          'login_result'
        );
        return { success: false, msg: e?.msg || 'Network Error' };
      }
    },
    // 踢出登陆
    logout: async ({ to }) => {
      try {
        const res = await logout();
        if (res.code === '200') {
          if (to) {
            window.location.href = to;
          } else {
            window.location.reload();
          }
        }
      } catch (e: any) {
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
  }));
};

export const { StoreProvider: LoginStoreProvider, useStoreValue: useLoginStore } = createStoreProvider<
  LoginState & LoginActions
>('LoginComponentStore', createLoginStore);
