/**
 * Owner: sean.shi@kupotech.com
 */
import { client } from '@/api/client.gen';
import {
  getUserInfoUsingGet,
  setUserLocaleUsingPost,
  SetUserLocaleUsingPostData,
  UserResponse,
} from '@/api/ucenter';
import * as telemetry from '@/core/telemetryModule';
import { TDefaultEmpty } from '@/types/TDefaultEmpty.ts';
import { toast } from '@kux/design';
import { setUser } from '@sentry/nextjs';
import { setCsrf } from 'gbiz-next/request';
import { getGlobalTenantConfig } from 'gbiz-next/tenant';
import { bootConfig } from 'kc-next/boot';
import { create } from 'zustand';
import { InvitationUserResponse } from '@/api/growth-ucenter';

export type InviterState = Pick<
  InvitationUserResponse,
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
  uid?: InvitationUserResponse['inviterUid'];
};

interface IUserState {
  user?: (UserResponse & { isSub?: boolean }) | TDefaultEmpty; // undefined表示未从服务器拉取
  isLogin?: boolean;
  // 计价单位
  balanceCurrency: string;
  conflictModal: boolean; // 用户碰撞检测
  // 邀请人信息
  inviter?: InviterState;
}

interface IUserAction {
  update: (payload: Partial<IUserState>) => void;
  pullUser: (callback?: (code: string) => void) => Promise<void>;
  setLocal: (
    params: { [key: string]: any },
    reloadUser?: boolean
  ) => Promise<void>;
  updateInviteInfo: (payload?: InviterState) => Promise<void>;
}

export interface IUserStore {}

export const useUserStore = create<IUserState & IUserAction>((set, get) => ({
  // state
  user: undefined,
  isLogin: undefined,
  conflictModal: false,
  // 基础计价币
  balanceCurrency: bootConfig._BASE_CURRENCY_,
  inviter: undefined,

  update: (payload) => set((state) => ({ ...state, ...payload })),

  // actions
  pullUser: async (callback?: (code: string) => void) => {
    try {
      const { data } = await getUserInfoUsingGet();
      console.log('data...', data);
      if (data) {
        if (getGlobalTenantConfig().enableIpRestrictLang) {
          // ip合规语言以CF边缘标识为准
          if (
            !!window.ipRestrictCountry &&
            window.ipRestrictCountry === data?.language
          ) {
            data.language = bootConfig._DEFAULT_LANG_;
          }
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
          balanceCurrency:
            balanceCurrency && balanceCurrency !== 'null'
              ? balanceCurrency
              : bootConfig._BASE_CURRENCY_,
        });
      } else {
        set({
          user: null,
          isLogin: false,
        });
      }
    } catch (e: any) {
      // 调用 callback 回调函数
      if (callback) {
        callback(e?.code || '');
      }
      set({
        user: null,
        isLogin: false,
      });
    }
  },

  setLocal: async (
    params: SetUserLocaleUsingPostData['query'],
    reloadUser = true
  ) => {
    try {
      await setUserLocaleUsingPost(params);
      if (reloadUser) {
        get().pullUser();
      }
    } catch (e: any) {
      toast.info(e?.msg || e?.message || '');
    }
  },

  updateInviteInfo: async (payload?: InviterState) => {
    get().update({
      inviter: payload,
    });
  },
}));
