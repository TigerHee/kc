/**
 * Owner: willen@kupotech.com
 */
import { queryUserHasHighAccount } from '@/services/account';
import createStoreProvider from 'gbiz-next/createStoreProvider';
import { create } from 'zustand';

interface UserAssetsStateAndEffects {
  isHFAccountExist: boolean;
  queryUserHasHighAccount: (payload: any, callback?: () => void) => Promise<void>;
}


export const createUserAssetsStore = (initState: Partial<UserAssetsStateAndEffects> = {}) => {
  return create<UserAssetsStateAndEffects>((set, get) => ({
    isHFAccountExist: false,
    ...initState,
    queryUserHasHighAccount: async (payload, callback) => {
      const res = await queryUserHasHighAccount();
      if (res?.success) {
        set({ isHFAccountExist: res?.data });
      }
      callback?.();
    },
  }));
}


export const { StoreProvider: UserAssetsStoreProvider, useStoreValue: useUserAssetsStore } = createStoreProvider('UserAssetsStore', createUserAssetsStore) as any;