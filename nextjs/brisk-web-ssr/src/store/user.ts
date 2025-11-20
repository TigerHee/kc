import { queryTotalBalanceUsingGet1 } from '@/api/account-front';
import { getUserTradeStatusUsingGet } from '@/api/chameleon';
import { getUserInfoUsingGet, setUserLocaleUsingPost, SetUserLocaleUsingPostData, UserResponse } from '@/api/ucenter';
import { getKycStatusUsingGet, type KycStatusResponse } from '@/api/user-dismiss';
import * as telemetry from '@/core/telemetryModule';
import { TDefaultEmpty } from '@/types/TDefaultEmpty.ts';
import { setUser } from '@sentry/nextjs';
import Decimal from 'decimal.js';
import { bootConfig } from 'kc-next/boot';
import { create } from 'zustand';
import { client } from '@/api/client.gen';
import { showReponseError } from '@/tools/showReponseError';
import { setCsrf } from 'gbiz-next/request';

export interface IUserStore {
  user: (UserResponse & { isSub?: boolean }) | TDefaultEmpty; // undefined表示未从服务器拉取
  isLogin: boolean | undefined;
  // 计价单位
  balanceCurrency: string;
  kycStatusInfo: KycStatusResponse | TDefaultEmpty;
  conflictModal: boolean; // 用户碰撞检测
  hasTrade: boolean | TDefaultEmpty; // 是否有余额
  totalAssets: number | TDefaultEmpty; // 是否有余额
  // actions
  pullUser: () => void;
  pullKycStatus: () => void;
  pullBalanceInfo: () => void;
  pullUserTradeStatus: () => void;
  setLocal: (params: { [key: string]: any }, reloadUser?: boolean) => Promise<void>;
}

export const useUserStore = create<IUserStore>((set, get) => ({
  // state
  user: undefined,
  isLogin: undefined,
  kycStatusInfo: undefined,
  conflictModal: false,
  hasTrade: undefined,
  totalAssets: undefined,
  // 基础计价币
  balanceCurrency: bootConfig._BASE_CURRENCY_,

  // actions
  pullUser: async () => {
    try {
      const { data } = await getUserInfoUsingGet();
      if (data) {
        // ip合规语言以CF边缘标识为准
        if (!!window.ipRestrictCountry && window.ipRestrictCountry === data?.language) {
          data.language = bootConfig._DEFAULT_LANG_;
        }
        setUser({ id: data.uid });
        setCsrf((data as any).csrf || '');
        client.refreshCsrfToken((data as any).csrf || '');

        // 数据上报和初始化
        await telemetry.setReportIdConfig(data.uid!);
        telemetry.loginSensors(data.uid!, data.honorLevel!);
        telemetry.reportExtension(data);

        // TODO: socket 的 csrf 设置，原始代码如下
        // import('@kc/socket').then((ws) => {
        //   ws.setCsrf(data.csrf);
        // });

        const { type = 1, balanceCurrency } = data;
        set({
          user: {
            ...data,
            isSub: type === 3,
          },
          isLogin: true,
          balanceCurrency: balanceCurrency && balanceCurrency !== 'null' ? balanceCurrency : bootConfig._BASE_CURRENCY_,
        });
      } else {
        set({
          user: null,
          isLogin: false,
        });
      }
    } catch {
      set({
        user: null,
        isLogin: false,
      });
    }
  },

  pullKycStatus: async () => {
    try {
      const { data } = await getKycStatusUsingGet();
      if (data) {
        set({
          kycStatusInfo: data,
        });
      }
    } catch (e: any) {
      showReponseError(e);
      set({
        kycStatusInfo: null,
      });
    }
  },

  pullBalanceInfo: async () => {
    try {
      const { data } = await queryTotalBalanceUsingGet1();
      const { mainModel, tradeModel } = data || {};
      const mainAssets = mainModel?.totalBalance || 0;
      const tradeAssets = tradeModel?.totalBalance || 0;
      const totalAssets = new Decimal(mainAssets).plus(tradeAssets).toNumber() || 0;
      set({
        totalAssets,
      });
    } catch (e: any) {
      showReponseError(e);
      set({
        totalAssets: null,
      });
    }
  },

  pullUserTradeStatus: async () => {
    try {
      const { data = {} } = await getUserTradeStatusUsingGet();
      set({
        hasTrade: data.tradeStatus,
      });
    } catch (e: any) {
      showReponseError(e);
      set({
        hasTrade: null,
      });
    }
  },

  setLocal: async (params: SetUserLocaleUsingPostData['query'], reloadUser = true) => {
    try {
      await setUserLocaleUsingPost(params);
      if (reloadUser) {
        get().pullUser();
      }
    } catch (e: any) {
      showReponseError(e);
    }
  },
}));
