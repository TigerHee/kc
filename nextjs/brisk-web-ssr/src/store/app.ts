import { getWhiteConfigByAppIdUsingGet } from '@/api/growth-config';
import { getLocationsUsingGet, GetLocationsUsingGetResponse } from '@/api/ucenter';
import storage from 'gbiz-next/storage';
import { create } from 'zustand';

// 使用新版首页的语言列表, 有all则代表所有语言都支持
const COUNTRY_INFO_KEY = 'locale_country_info';

interface IAppStore {
  showDownloadBanner: boolean;
  countryInfo?: GetLocationsUsingGetResponse['data'];
  // app gp下架地区
  illegalGpList: string[];
  pullCountryInfo: () => Promise<any>;
  pullAppGpDownloadConfig: () => Promise<void>;
  setShowDownloadBanner: (show: boolean) => void;
}

export const useAppStore = create<IAppStore>((set) => ({
  showDownloadBanner: true, // 只有 h5 展示，h5 默认 true
  countryInfo: undefined,
  // app gp下架地区
  illegalGpList: [],

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
      const list = data?.properties?.filter?.(el => el.property === 'gpAppDownloads' && el.status === 0) || [];
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
  setShowDownloadBanner: (show: boolean) => {
    set({ showDownloadBanner: show });
  },
}));
