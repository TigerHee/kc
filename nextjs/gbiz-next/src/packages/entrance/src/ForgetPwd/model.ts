import { create } from 'zustand';
import { createStoreProvider } from 'tools';
import { getMobileCode, loopCrypto, reportPasswordError } from '../common/tools';
import isObject from 'lodash-es/isObject';
import {
  getCountryCodeListUsingGet,
  getUserInfoUsingGet,
  resetPasswordFromEmailV2UsingPost2,
  resetPasswordFromPhoneV2UsingPost2,
  SendValidationCodeUsingPostData,
} from '../api/ucenter';

export interface ForgetPwdState {
  /**
   * 验证码发送渠道
   * - MY_SMS-短信
   * - MY_VOICE-语音
   * - MY_EMAIL-邮箱
   */
  sendChannel: SendValidationCodeUsingPostData['query']['sendChannel'];
  /** 国家区号列表 */
  countryCodes: any[];
  /** 用户输入的邮箱 */
  email: string;
  /** 用户输入的手机号 */
  phone: string;
  /** 用户输入的账号类型 phone/email */
  accountType: 'email' | 'phone' | '';
  /** 用户选择的国家区号 */
  countryCode: string;
  loading: {
    resetPwd: boolean;
  };
  isLogin: boolean;
  verifyResult: {
    headers?: Record<string, string>;
    data?: {
      isNeedLiveVerify: boolean;
      isNeedSelfService: boolean;
    };
  };
}

type Toast = {
  error: (val?: string) => void;
  warning: (val?: string) => void;
  info: (val?: string) => void;
};

interface ResetPwdParams {
  toast: Toast;
  password: string;
  headers: Record<string, string>;
}

export interface ForgetPwdActions {
  update: (payload: Partial<ForgetPwdState>) => void;
  // /** 重置密码 */
  resetPwd: (params: ResetPwdParams) => Promise<boolean>;
  // /** 重置所有参数 */
  resetInit: () => void;
  getCountryCodes: () => Promise<void>;
  pullUser: () => Promise<void>;
}

const defaultState: ForgetPwdState = {
  sendChannel: 'MY_SMS',
  countryCodes: [], // 国家区号列表
  email: '', // 用户输入的邮箱
  phone: '', // 用户输入的手机号
  accountType: '', // 用户输入的账号类型 phone/email
  countryCode: '', // 用户选择的国家区号
  verifyResult: {},
  isLogin: false,
  loading: {
    resetPwd: false,
  },
};

export const createForgetPwdStore = (initState: Partial<ForgetPwdState>) => {
  return create<ForgetPwdState & ForgetPwdActions>((set, get) => ({
    ...defaultState,
    ...initState,
    update: payload => set(state => ({ ...state, ...payload })),
    resetPwd: async ({ toast, password, headers }) => {
      console.log('resetPwd in');
      const { email, phone, accountType, countryCode: countryCodePre, loading } = get();
      const countryCode = getMobileCode(countryCodePre);

      // 根据账号类型来发送
      const sendChannel = accountType === 'phone' ? 'MY_SMS' : 'MY_EMAIL';

      try {
        set({ loading: { ...loading, resetPwd: true } });
        reportPasswordError(password, 'forgetPwd');
        let result: any;
        switch (sendChannel) {
          case 'MY_SMS':
            // case 'MY_VOICE':
            result = await resetPasswordFromPhoneV2UsingPost2(
              {
                password: loopCrypto(password, 2),
                phone,
                countryCode,
              },
              { headers }
            );
            break;
          case 'MY_EMAIL':
            result = await resetPasswordFromEmailV2UsingPost2(
              {
                password: loopCrypto(password, 2),
                email,
              },
              { headers }
            );
            break;
        }
        const { code: dataCode, msg } = result;
        if (dataCode !== '200') {
          toast.error(msg);
          return false;
        }
        // toast.info(msg);
        return true;
      } catch (err: any) {
        if (err?.response?.data?.msg) {
          toast.info(err.response.data.msg);
          return false;
        }
        const msg = isObject(err) ? JSON.stringify((err as any).msg) : err;
        toast.info(msg);
        return false;
      } finally {
        set({ loading: { ...loading, resetPwd: false } });
      }
    },
    resetInit: () => {
      set({
        ...defaultState,
        ...initState,
      });
    },
    getCountryCodes: async () => {
      const { data } = await getCountryCodeListUsingGet();
      set({ countryCodes: data });
    },
    // 获取用户信息
    pullUser: async () => {
      try {
        await getUserInfoUsingGet();
        get().update({ isLogin: true });
      } catch (err) {
        get().update({ isLogin: false });
      }
    },
  }));
};

export const { StoreProvider: ForgetPwdStoreProvider, useStoreValue: useForgetPwdStore } = createStoreProvider<
  ForgetPwdState & ForgetPwdActions
>('ForgetPwdComponentStore', createForgetPwdStore);
