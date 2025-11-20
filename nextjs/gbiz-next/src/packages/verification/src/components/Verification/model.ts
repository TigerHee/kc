import { create } from 'zustand';
import getPreVerifyResult, { GetPreVerifyResultPayload, GetPreVerifyResultResponse } from '../../utils/getPreVerifyResult';
import addLangToPath from 'tools/addLangToPath';
import { SCENE } from '../../enums';
import { ERROR_CODE, METHODS } from '../../enums';
import JsBridge from "tools/jsBridge";
import { getSiteConfig } from 'kc-next/boot';

/** 接口加了新字段，暂时先这样扩展类型 */
interface CombineResult extends GetPreVerifyResultResponse {
  isNeedLiveVerify: boolean;
  isNeedSelfService: boolean;
  phone: string;
  email: string;
  countryCode: string;
}

export interface VerificationState {
  scene: SCENE;
  bizType: string;
  options: { token?: string, address?: string };
  combineResult: CombineResult | null;
  selectedMethod: string[]
  formData: Record<string, string>;
  formError: Record<string, string | undefined>;
}

type PullCombineResultParams = GetPreVerifyResultPayload & Pick<VerificationState, 'options'>;

export interface VerificationActions {
  pullCombineResult: (params: PullCombineResultParams) => Promise<CombineResult>;
  setScene: (scene: SCENE) => void;
  setSelectedMethod: (selectedMethod: string[]) => void;
  getFormData: () => Record<string, string>;
  setFormData: (formData: Record<string, string>) => void;
  setFormError: (formError: Record<string, string | undefined>) => void;
  openResetSecurityPage: () => void;
}

const initialValue: VerificationState = {
  scene: SCENE.INIT,
  bizType: '',
  options: {},
  combineResult: null,
  selectedMethod: [],
  formData: {},
  formError: {},
};

export const useVerification = create<VerificationState & VerificationActions>((set, get) => ({
  ...initialValue,
  async pullCombineResult({ bizType, businessData, permitValidateType, options }) {
    const { setSelectedMethod } = get();
    set({ bizType, options });
    const res = (await getPreVerifyResult({ bizType, options, businessData, permitValidateType })) as CombineResult;
    set({ combineResult: res, formData: {}, formError: {} });
    const { methods, errorCode } = res;
    if (errorCode) {
      if (errorCode === ERROR_CODE.RISK_REJECTION) {
        set({ scene: SCENE.ERROR_40016 });
      } else if (errorCode === ERROR_CODE.MATCHING_TIMEOUT) {
        set({ scene: SCENE.ERROR_40017 });
      } else if (errorCode === ERROR_CODE.GO_TO_SECURITY) {
        set({ scene: SCENE.ERROR_50005 });
      } else if (errorCode === ERROR_CODE.GO_TO_MAIN_ACCOUNT) {
        set({ scene: SCENE.ERROR_500017 });
      } else {
        set({ scene: SCENE.ERROR_DEFAULT });
      }
    } else {
      setSelectedMethod(methods[0]);
    }
    return res;
  },
  setScene: (scene: SCENE) => {
    set({ scene });
  },
  setSelectedMethod: (selectedMethod: string[] = []) => {
    const { formData, setScene } = get();
    set({ selectedMethod });
    const hasPk = selectedMethod.includes(METHODS.PASSKEY);
    const pkPassed = formData[METHODS.PASSKEY];
    const newFormData = {};
    selectedMethod.forEach(method => {
      if (formData[method]) newFormData[method] = formData[method];
    });
    set({ formData: newFormData });
    if (hasPk && !pkPassed) {
      setScene(SCENE.PASSKEY);
    } else {
      setScene(SCENE.OTP);
    }
  },
  getFormData: () => {
    return get().formData;
  },
  setFormData: (formData: Record<string, string>) => {
    const oldValue = get().formData;
    set({ formData: { ...oldValue, ...formData } });
  },
  setFormError: (formError: Record<string, string | undefined>) => {
    const oldValue = get().formError;
    set({ formError: { ...oldValue, ...formError } });
  },
  openResetSecurityPage: () => {
    const { selectedMethod, options } = get();
    let url: string;
    if (selectedMethod.includes(METHODS.LOGIN_PASSWORD)) {
      // 有登陆密码则跳忘记密码
      url = '/ucenter/reset-password';
    } else {
      // 没有登陆密码则跳重置安全项
      url = '/ucenter/reset-security';
      if (options.address) {
        url += `/address/${encodeURIComponent(options.address)}`;
      } else if (options.token) {
        url += `/token/${options.token}`;
      }
    }
    const siteConfig = getSiteConfig();
    const { KUCOIN_HOST = '' } = siteConfig;
    const isInApp = JsBridge.isApp();
    if (isInApp) {
      const encodeUrl = encodeURIComponent(`${KUCOIN_HOST}${url}?appNeedLang=true`);
      JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeUrl}` } });
    } else {
      window.open(addLangToPath(url));
    }
  },
  reset: () => {
    set(() => ({ ...initialValue }));
  }
}));