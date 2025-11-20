/**
 * Owner: tiger@kupotech.com
 */
import { create } from 'zustand';
import createStoreProvider from 'tools/createStoreProvider';
import * as services from '../services';
import { recaptchaKey, geeTestKey, image } from '../config';

export type CaptchaInitType = {
  apiKey: string;
  locale?: string;
  captchaType?: string;
  challenge?: string;
  gt?: string;
  [key: string]: any; // 如果还有其它字段，可加上索引签名
};
export type CaptchaState = {
  googleCaptchaVisible: boolean;
  captchaInit: CaptchaInitType;
  imageCaptchaVisible: boolean;
  imgSrc: string;
  checkLoading: boolean;
};

export type CaptchaActions = {
  initCaptcha: (params: { bizType: string; handleError: () => void }) => Promise<void>;
  captchaVerify: (params: any) => Promise<any>;
  captchaClose: () => void;
  captchaSuccess: () => void;
  getImage: (params: { challenge: string }) => Promise<void>;
  update: (params: Partial<CaptchaState>) => void;
};

export const defaultCaptchaState: CaptchaState = {
  googleCaptchaVisible: false,
  captchaInit: {
    apiKey: '',
  },
  imageCaptchaVisible: false,
  imgSrc: '',
  checkLoading: false,
};

export const createCaptchaStore = (initState: Partial<CaptchaState> = {}) => {
  return create<CaptchaState & CaptchaActions>((set, get) => ({
    ...defaultCaptchaState,
    ...initState,

    update(params: Partial<CaptchaState>) {
      set(state => ({
        ...state,
        ...params,
      }));
    },

    initCaptcha: async ({ bizType, handleError }) => {
      try {
        const versionNo = 20221008;
        const { data = {} } = await services.captchaInit({ bizType, versionNo });
        const { captchaType, challenge = '' } = data;

        if (captchaType === recaptchaKey) {
          set({ googleCaptchaVisible: true });
        } else if (captchaType === geeTestKey) {
          set({ googleCaptchaVisible: false });
        } else if (captchaType === image) {
          set({
            googleCaptchaVisible: false,
            imageCaptchaVisible: true,
          });
          await get().getImage({ challenge });
        }
        set({
          captchaInit: data,
        });
      } catch (error) {
        handleError?.();
      }
    },

    captchaVerify: async payload => {
      set({ checkLoading: true });
      return await services.captchaValidate(payload);
    },

    captchaClose: () => {
      set({
        googleCaptchaVisible: false,
        captchaInit: {
          apiKey: '',
        },
        imageCaptchaVisible: false,
        imgSrc: '',
        checkLoading: false,
      });
    },

    captchaSuccess: () => {
      set({
        googleCaptchaVisible: false,
        captchaInit: {
          apiKey: '',
        },
        imageCaptchaVisible: false,
        imgSrc: '',
        checkLoading: false,
      });
    },

    getImage: async ({ challenge }) => {
      const { success, data } = await services.getImageVer({ challenge });
      if (success) {
        set({
          imgSrc: `data:image/png;base64,${data}`,
        });
      }
    },
  }));
};

export const { StoreProvider: CaptchaStoreProvider, useStoreValue: useCaptchaStore } = createStoreProvider<
  CaptchaState & CaptchaActions
>('CaptchaStore', createCaptchaStore);
