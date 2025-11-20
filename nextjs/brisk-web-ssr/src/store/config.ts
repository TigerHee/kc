import { getClientPropertyByCodeUsingGet1 } from '@/api/growth-config';
import createCommonErrorResponse from '@/tools/createCommonErrorResponse';
import type { ConfigItemsType } from '@/types/configItems';
import createStoreProvider from 'gbiz-next/createStoreProvider';
import { create } from 'zustand';

interface IConfigState {
  configItems: ConfigItemsType;
}

interface IConfigActions {
  pullConfigItems: () => Promise<ConfigItemsType>;
}

export const defaultInitState: IConfigState = {
  // 后台配置项
  configItems: {},
};

export const createConfigStore = (initState: Partial<IConfigState> = {}) => {
  return create<IConfigState & IConfigActions>(set => ({
    ...defaultInitState,
    ...initState,

    pullConfigItems: async () => {
      try {
        const clientConfigRes = await getClientPropertyByCodeUsingGet1({
          businessLine: 'platform-reward',
          codes: ['webHomepageDownload', 'webHomepageData', 'web202508homepageProductIntro'].join(','),
        });
        const configItems: ConfigItemsType = {};
        clientConfigRes?.data?.properties?.forEach((item: any) => {
          if (item && typeof item.property === 'string') {
            configItems[item.property] = { value: item.value, backupValues: item.backupValues };
          }
        });
        set({ configItems });
        return configItems;
      } catch (error) {
        return createCommonErrorResponse({ configItems: {} }, error);
      }
    },
  }));
};

export const { StoreProvider: ConfigStoreProvider, useStoreValue: useConfigStore } =
  createStoreProvider<IConfigState & IConfigActions>('ConfigStore', createConfigStore) || {};
