import { getWhiteConfigByAppIdUsingGet } from '@/api/growth-config';
import {
  getLocationsUsingGet,
  GetLocationsUsingGetResponse,
} from '@/api/ucenter';
import storage from 'gbiz-next/storage';
import { create } from 'zustand';
import { logout } from '@/api/common';
import forEach from 'lodash-es/forEach';
import { getWebConfigListByTypeUsingGet } from '@/api/kucoin-config';

// 使用新版首页的语言列表, 有all则代表所有语言都支持
const COUNTRY_INFO_KEY = 'locale_country_info';

interface IAppStore {
  showDownloadBanner: boolean;
  countryInfo?: GetLocationsUsingGetResponse['data'];
  // app gp下架地区
  illegalGpList: string[];
  pullCountryInfo: () => Promise<any>;
  pullAppGpDownloadConfig: () => Promise<void>;
  pullLangList: () => Promise<void>;
  langList: string[][];
  langListMap: Record<string, { lang: string; langName: string }>;
}

export const useAppStore = create<IAppStore>((set, _) => ({
  showDownloadBanner: false,
  countryInfo: undefined,
  // app gp下架地区
  illegalGpList: [],
  langList: [],
  langListMap: {},

  logout: async (params: { to?: string; notReload?: boolean } = {}) => {
    const { to, notReload = false } = params || {};
    const { code } = await logout();
    if (code === '200') {
      if (to) {
        window.location.href = `${window.location.origin}${to}`;
      } else if (notReload) {
        window.location.reload();
      }
    }
  },

  pullCountryInfo: async () => {
    try {
      const info = storage.getItem(COUNTRY_INFO_KEY);
      if (info) {
        set({ countryInfo: info });
        return;
      }

      const { data } = await getLocationsUsingGet();
      set({ countryInfo: data || {} });
      storage.setItem(COUNTRY_INFO_KEY, data || {});
    } catch (e) {
      console.log('pullCountryInfo error:', e);
      set({ countryInfo: {} });
    }
  },
  // 解析获得当前GP下架地区列表
  pullAppGpDownloadConfig: async () => {
    try {
      const { data } = await getWhiteConfigByAppIdUsingGet({
        appId: 'WEB_CONFOG_FOR_APP_DOWNLOAD',
      });
      const list =
        data?.properties?.filter?.(
          (el) => el.property === 'gpAppDownloads' && el.status === 0
        ) || [];
      const str = list[0]?.value;
      if (!str) {
        return;
      }
      const records = str.split?.('&&').filter(Boolean);
      set({ illegalGpList: records || [] });
    } catch (e) {
      console.log('pullAppGpDownloadConfig error:', e);
    }
  },
  pullLangList: async () => {
    try {
      const { data } = await getWebConfigListByTypeUsingGet();
      if (data) {
        const langListMap = {};
        forEach(data, (item) => {
          langListMap[item[0]] = {
            lang: item[0],
            langName: item[1],
          };
        });
        set({
          langList: data,
          langListMap,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
}));
