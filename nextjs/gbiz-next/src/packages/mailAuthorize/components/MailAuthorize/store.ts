/**
 * Owner: tiger@kupotech.com
 */
import { create } from 'zustand';
import * as serv from './services';

export interface MailAuthorizeState {
  visible: boolean;
  riskTag: string;
  verifyToken: string;
  verifyCheckToken: string;
  email?: string;
}

const initialState: MailAuthorizeState = {
  visible: false,
  riskTag: '',
  verifyToken: '',
  verifyCheckToken: '',
  email: '',
};

interface MailAuthorizeActions {
  update: (payload: Partial<MailAuthorizeState>) => void;
  reset: () => void;
  checkRisk: (params: {
    bizType: string;
    params: any;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }) => Promise<void>;
  resendEmail: (params: { bizType: string }) => Promise<any>;
  getMailVerifyResult: (params: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => Promise<void>;
}

export type MailAuthorizeStore = MailAuthorizeState & MailAuthorizeActions;

export const createMailAuthorizeStore = (initState: Partial<MailAuthorizeState> = {}) => {
  return create<MailAuthorizeStore>()((set, get) => ({
    ...initialState,
    ...initState,

    update: (payload) => {
      set((state) => ({
        ...state,
        ...payload,
      }));
    },

    reset: () => {
      set(initialState);
    },

    checkRisk: async ({ bizType, params, onSuccess, onError }) => {
      try {
        const res = await serv.checkRisk({ bizType, params });
        const { riskTag } = res.data;
        // accept：通过； verify: 授权验证；  reject 拒绝
        const isNeedVerify = riskTag === 'verify';
        get().update({
          visible: isNeedVerify,
          ...res.data,
        });
        if (!isNeedVerify && typeof onSuccess === 'function') {
          onSuccess(res.data);
        }
      } catch (e) {
        if (typeof onError === 'function') {
          onError(e);
        }
      }
    },

    resendEmail: async ({ bizType }) => {
      const { verifyToken, verifyCheckToken } = get();
      const res = await serv.resendEmail({ verifyToken, verifyCheckToken, bizType });
      get().update(res.data);
      return res;
    },

    getMailVerifyResult: async ({ onSuccess, onError }) => {
      const { verifyToken, verifyCheckToken } = get();
      try {
        const { data } = await serv.queryResult({ verifyToken, verifyCheckToken });
        if (data?.status === 'success') {
          get().reset();
          if (typeof onSuccess === 'function') {
            onSuccess();
          }
        }
      } catch (e) {
        if (typeof onError === 'function') {
          onError(e);
        }
      }
    },
  }));
};

// 创建默认 store 实例
export const useMailAuthorizeStore = createMailAuthorizeStore();

