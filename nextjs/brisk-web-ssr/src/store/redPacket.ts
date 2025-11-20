/**
 * Owner: willen@kupotech.com
 * RedPacket Zustand Store - converted from dva
 */
import { addLangToPath } from '@/tools/i18n';
import { getCountryCodeListUsingGet } from '@/api/ucenter/sdk.gen';
import { CountryCodeResponse } from '@/api/ucenter/types.gen';
import {
  getWelfareDetailListUsingGet1,
  getWelfareDetailUsingGet1,
  getWelfareReceiveRecordV2UsingPost,
  receive2CodeUsingPost,
  receiveV2UsingPost,
} from '@/api/welfare';
import {
  positionUsingGet3 as getResourcePosition
} from '@/api/resource-position';
import type {
  WelfareReceiveRecordResponse,
  WelfareReceiveRecordV2Response,
  WelfareRecordExistsResponse,
  WelfareResponse,
} from '@/api/welfare/types.gen';
import { create } from 'zustand';
import { useUserStore } from './user';
import { showReponseError } from '@/tools/showReponseError';

/**
 * 领取红包，需要使用中台资源位配置，进行弹窗提示
 */
const receiveTipUseResourceCodes = ['285033', '285034'];

// 红包账号信息类型
export interface RedPacketAccount {
  countryCode?: string;
  phone?: string;
  email?: string;
  sendRecordId?: string;
}

// 分页过滤器类型
export interface RedPacketFilters {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 红包列表项类型
export type RedPacketListItem = WelfareReceiveRecordResponse;

// 红包状态接口
export interface RedPacketState {
  // 红包信息
  redPacketInfo: WelfareRecordExistsResponse;
  // 领取红包信息
  receivedInfo: WelfareReceiveRecordV2Response | WelfareReceiveRecordResponse;
  // 红包账号信息
  redPacketAccount: RedPacketAccount;
  // 红包列表
  redPacketList: RedPacketListItem[];
  // 红包底部信息
  redPacketFooterInfo: WelfareResponse;
  // 分页过滤器
  filters: RedPacketFilters;
  // 国家列表
  countryList: CountryCodeResponse[];
  // 是否正在领取中
  receiving: boolean;
  // 获取红包列表是否正在加载
  getRedPacketListLoading: boolean;
  // 是否显示中台资源位-领取红包错误弹窗
  showResourceTip: boolean;
  // 中台资源位-领取红包错误弹窗配置
  resourceTipData?: {
    content: string;
    link: string;
    btnText: string;
  };
}


// 红包操作接口
export interface RedPacketActions {
  // 设置红包信息
  setRedPacketInfo: (info: WelfareRecordExistsResponse) => void;
  // 设置红包账号
  setRedPacketAccount: (account: RedPacketAccount) => void;
  // 设置是否领取中
  setReceiving: (receiving: boolean) => void;
  // 获取国家列表
  getCountryList: () => Promise<void>;
  // 获取红包奖励
  getReward: (payload: any, callback: (isNewUser?: boolean) => void) => Promise<any>;
  // 获取领取信息
  getReceiveInfo: (payload?: any, callback?: (p?: any) => void) => Promise<any>;
  // 获取红包列表
  getRedPacketList: (page: number) => Promise<void>;
  // 重置状态
  reset: () => void;
  // 根据code，查询资源位中台文案，进行弹窗提示
  showTipFromResourceByCode: (code: string, e: any, t: (key: string) => string) => Promise<void>;
  closeTip: () => void;
}

// 初始状态
const initialState: RedPacketState = {
  redPacketInfo: {},
  receivedInfo: {},
  redPacketAccount: {},
  redPacketList: [],
  redPacketFooterInfo: {},
  filters: {
    page: 1,
    pageSize: 5,
    hasMore: true,
  },
  countryList: [],
  receiving: false,
  getRedPacketListLoading: false,
  showResourceTip: false,
  resourceTipData: undefined,
};

// 创建红包store
export const useRedPacketStore = create<RedPacketState & RedPacketActions>((set, get) => ({
  ...initialState,

  // 设置红包信息
  setRedPacketInfo: info => {
    set({
      redPacketInfo: info,
    });
  },

  // 设置红包账号
  setRedPacketAccount: account => {
    set(() => ({
      redPacketAccount: account,
    }));
  },

  // 设置是否领取中
  setReceiving: receiving => {
    set({ receiving });
  },

  // 设置国家列表
  getCountryList: async () => {
    try {
      const { data = [] } = await getCountryCodeListUsingGet();
      set({ countryList: data });
    } catch (e: any) {
      showReponseError(e);
      console.error(e);
    }
  },
  closeTip: () => {
    set({
      showResourceTip: false,
    });
  },
  // 根据code，查询资源位中台文案，进行弹窗提示
  showTipFromResourceByCode: async (code: string, error: any, t: (key: string) => string) => {
    try {
      const data = await getResourcePosition({ codes: code });
      if (data && data.success && data.data && data.data[code] && data.data[code].length > 0) {
        const resourceData = data.data[code][0];
        // 读取标题，文案等，进行弹窗提示
        set({
          showResourceTip: true,
          resourceTipData: {
            content: resourceData.srcTextMap.content,
            link: addLangToPath(resourceData.webUrl || resourceData.appUrl),
            btnText: resourceData.srcTextMap.btnTxt,
          }
        });
      } else {
        showReponseError(error);
      }
    } catch(e) {
      showReponseError(error || e);
    }
  },
  // 获取红包奖励
  getReward: async ({ t, ...payload }, callback) => {
    const { redPacketAccount, redPacketInfo } = get();
    try {
      const isLogin = useUserStore.getState().isLogin;

      const { success, data } = isLogin
        ? await receive2CodeUsingPost({ ...payload, channel: 'WEB' })
        : await receiveV2UsingPost({ ...payload, channel: 'WEB' });
      if (success) {
        set({
          redPacketAccount: { ...payload },
          receivedInfo: data,
        });
        if (callback) {
          const isNewUser = !isLogin && data && data.isNewUser === true;
          callback(isNewUser);
        }
      } else {
        set({ receiving: false });
      }
    } catch (e: any) {
      set({
        redPacketAccount,
        redPacketInfo,
        receiving: false,
      });
      // 收红包用户冻结 弹窗,取资源位中台code对应文案进行提示
      const isRecivceError = e && e.data && receiveTipUseResourceCodes.includes(e.data.code);
      const hasResourceId = isRecivceError && !!e.data.data?.resourceId;
      if (hasResourceId) {
        const resourceId = e.data.data.resourceId;
        get().showTipFromResourceByCode(resourceId as string, e, t);
      } else {
        showReponseError(e);
      }
      console.error(e);
    }
  },

  // 获取领取信息
  getReceiveInfo: async (payload, callback) => {
    try {
      const isLogin = useUserStore.getState().isLogin;
      const { redPacketAccount, redPacketInfo } = get();
      const { phone, email } = redPacketAccount;
      const { sendRecordId } = redPacketInfo;

      let footerData: any = {};
      if (!isLogin && (phone || email)) {
        const { data } = await getWelfareReceiveRecordV2UsingPost({
          ...redPacketAccount,
          sendRecordId,
        });
        footerData = data;
      } else {
        const { data } = await getWelfareDetailUsingGet1({ sendRecordId });
        footerData = data;
      }
      set({
        redPacketFooterInfo: footerData,
      });
      if (callback) {
        callback(footerData);
      }
    } catch (e: any) {
      set({ receiving: false });
      showReponseError(e);
      console.error(e);
    }
  },

  // 获取红包列表
  getRedPacketList: async page => {
    set({ getRedPacketListLoading: true });
    const { filters, redPacketInfo, redPacketList } = get();
    const { sendRecordId } = redPacketInfo;
    const { pageSize } = filters;

    try {
      const params: any = { sendRecordId, size: pageSize };

      if (page !== 1 && redPacketList && redPacketList.length > 0) {
        // 不是查询首页，取出已有列表的最后一个索引值
        const lastItem = redPacketList[redPacketList.length - 1];
        params.index = lastItem.index || 0;
      }

      const { hasMore = true, dataList = [] } = await getWelfareDetailListUsingGet1(params);
      const newList = page === 1 ? dataList : [...redPacketList, ...dataList];

      set({
        redPacketList: newList,
        filters: {
          ...filters,
          hasMore,
        },
      });
    } catch (e) {
      console.error(e);
      set({
        redPacketList: [],
        filters: {
          ...filters,
          hasMore: false,
        },
      });
    } finally {
      set({ getRedPacketListLoading: false });
    }
  },

  // 重置状态
  reset: () => {
    set(initialState);
  },
}));
