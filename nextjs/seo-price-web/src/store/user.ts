import { create } from 'zustand';
import * as userService from '@/services/user';
import { setUser } from '@sentry/nextjs';
import { setCsrf } from 'gbiz-next/request';
import { FROZEN_STATUS } from '@/config/base';
import { bootConfig } from 'kc-next/boot';
import { changeLocale, getCurrentLang, langToLocale } from "kc-next/i18n";
import { kucoinv2Storage as nsStorage } from "gbiz-next/storage";
import { loginSensors, reportExtension, setReportIdConfig } from '@/core/telemetryModule';

interface UserStore {
  user:
    | {
      
        language: string;
      }
    | undefined
    | null; // undefined表示未从服务器拉取
  isLogin: boolean | undefined;
  frozen: boolean | undefined;
  balanceCurrency: string; // 计价单位
  restrictedTypes: boolean | null; //  // 是否开启清退标识（kyc认证，充币）
  securtyStatus: {};
  recharged: {} | null; // 用户充值记录
  traded: {} | null; // 用户交易记录

  pullUser: () => any | null;
  getUserRestrictedStatus: ({
    payload,
    onlyStatus,
  }: {
    payload?: any;
    onlyStatus?: boolean;
  }) => Promise<void>;
  getUserDepositFlag: () => Promise<void>;
  pullSecurtyMethods: ({ id }: { id: string }) => Promise<void>;
  checkUserError: (error: any) => Promise<void>;
  setLocal: (payload: {
    reloadUser?: boolean;
    currency: string;
  }) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: undefined,
  isLogin: undefined,
  frozen: undefined, // undefined表示pullUser未返回
  balanceCurrency: bootConfig?._BASE_CURRENCY_, // 计价单位
  restrictedTypes: null,
  securtyStatus: {},
  recharged: null,
  traded: null,

  pullUser: async () => {
    try {
      const { data } = await userService.pullUserInfo();
      if (data) {
        // ip合规语言以CF边缘标识为准
        if (
          !!window.ipRestrictCountry &&
          window.ipRestrictCountry === data?.language
        ) {
          data.language = "en_US";
        }
        setUser({ id: data.uid });
        setCsrf(data.csrf);
           // 数据上报和初始化
        await setReportIdConfig(data.uid);
        loginSensors(data.uid, data.honorLevel);
        reportExtension(data);

        const userLang = data.language;
        if (userLang && getCurrentLang() !== userLang) {
          // 先冗余处理，后续优化
          nsStorage.setItem('lang', userLang);
          changeLocale(langToLocale(userLang));
          return;
        }

        // 获取用户被清退状态
        await get().getUserRestrictedStatus({});
      }
      const { type: _type = 1, balanceCurrency = bootConfig._BASE_CURRENCY_ } = data || {};
      if (data) data.isSub = _type === 3;
      set({
        user: data || null,
        isLogin: true,
        frozen: data ? data.status === FROZEN_STATUS : false,
        balanceCurrency:
          balanceCurrency && balanceCurrency !== "null"
            ? balanceCurrency
            : bootConfig._BASE_CURRENCY_,
      });

      await get().getUserDepositFlag();

      return data;
    } catch (e) {
      get().checkUserError(e);
      return null;
    }
  },
  getUserRestrictedStatus: async ({ payload, onlyStatus = true }) => {
    const queryHandler = onlyStatus
      ? userService.getUserRestrictedStatus
      : userService.getUserRestrictedStatusAndNotice;
    const { data } = await queryHandler(payload);
    const { data: openFlag } = await userService.getUserRestrictType(payload);
    const updateState: any = {};
    if (onlyStatus) {
      updateState.restrictedStatus = data;
    } else {
      updateState.restrictedUserNotice = data;
    }
    set({
      ...updateState,
      restrictedTypes: openFlag,
    });
  },
  pullSecurtyMethods: async ({ id }) => {
    const res = await userService.pullSecurtyMethods(id);
    set({
      securtyStatus: res.data,
    });
  },
  checkUserError: async (error) => {
    try {
      const { code } = error;
      switch (code) {
        // 默认抛出错误给showError处理
        default:
          set({
            user: null,
            frozen: false,
            isLogin: false,
          });
          throw error;
      }
    } catch (error) {
      console.log(error);
    }
  },
  getUserDepositFlag: async () => {
    const { success, data = {} } = await userService.getUserDepositFlag();
    if (success)
      set({
        recharged: data && data.recharged,
        traded: data && data.traded,
      });
  },
  setLocal: async ({
    reloadUser = true,
    currency,
  }: {
    reloadUser?: boolean;
    currency: string;
  }) => {
    await userService.setLocal({ currency });
    if (reloadUser) {
      get().pullUser();
    }
  }
}));
