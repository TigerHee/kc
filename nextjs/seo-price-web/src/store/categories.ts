import { create } from "zustand";
import { Categories } from "@/types/categories";
import { UpdatePropAction } from "@/store/base";
import createStoreProvider from "gbiz-next/createStoreProvider";
import { getCoinsCategory } from "@/services/market";
import precision from '@/tools/precision';
import { maxPrecision } from "@/config/base";
import numberFixed from "@/tools/numberFixed";
import createDecimals from "@/tools/math/createDecimals";

type CategoriesAction = {
  pullCoinDictData: () => Promise<void>;
}

type CategoriesStoreState = Categories & UpdatePropAction<Categories> & CategoriesAction;

const actions = {
  async pullCategories() {
    try {
      const { data } = await getCoinsCategory();
      const map = {};
      const coinNamesMap = {};
      const poolCoinsMap = {};
      const kumexCoinsMap = {};

      data.pool.forEach((item) => {
        poolCoinsMap[item.currency] = item;
      });

      data.kumex.forEach((item) => {
        kumexCoinsMap[item.currency] = item;
      });
      
      data.kucoin.forEach((item) => {
        item.precision = parseInt(item.precision || maxPrecision, 10);
        precision(item.coin, item.precision);
        const newItem = {
          ...item,
          key: item.currency,
          coin: item.currency,
          step: numberFixed(1 / Math.pow(10, item.precision)),
          decimals: createDecimals(item.precision),
          isContractEnabled: !!kumexCoinsMap[item.currency],
          isPoolEnabled: !!poolCoinsMap[item.currency],
        };
        map[item.currency] = newItem;
        coinNamesMap[item.currencyName] = newItem;
      });

      return {
        coinDict: map,
      };
    } catch (e) {
      console.log('pullCategories Error', e);
      // yield call(delay, 3000);
      // yield put({ type: 'pull' });

      return {};
    }
  }
}

export const createCategoriesStore = (initial: Partial<Categories> = {}) => {
  return create<CategoriesStoreState>((set, get) => ({
    coinDict: {},
    ...initial,
    updateProp(payload) {
      return set(payload);
    },
    pullCoinDictData: async () => {
      const data = await actions.pullCategories();
      set(data);
    }
  }))
};

export const { StoreProvider: CategoriesStoreProvider, useStoreValue: useCategoriesStore } =
createStoreProvider<CategoriesStoreState>('categories', createCategoriesStore) as any;
