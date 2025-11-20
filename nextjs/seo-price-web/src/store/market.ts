import { create } from "zustand";
// import mockMarket from './mock/market_mock.json';
import { Market, SymbolInfo } from "@/types/market";
import createStoreProvider from "gbiz-next/createStoreProvider";
import { getMarketSymbols } from "@/services/market";

export const marketAsyncActions = {
  getSymbolInfoMap: async () => {
    const { data = [] } = await getMarketSymbols({}) as { data: SymbolInfo[] };
    return { data };
  }
}

interface MarketActions {
  updateSymbolsInfo: (payload: { data?: SymbolInfo[] }) => void;
  pullSymbolsInfo: () => Promise<void>;
}

export const createMarketStore = () => {
  return create<Market & MarketActions>((set, get) => ({
    // ...mockMarket as any,
    symbolsInfoMap: {},
    updateSymbolsInfo(payload) {
      const { data = [] } = payload;
      const symbolsInfoMap = {};
      const size = (data || []).length;
      for (let i = 0; i < size; i++) {
        const val = data[i];
        symbolsInfoMap[val.code] = val;
      }

      set({ symbolsInfoMap });
    },
    pullSymbolsInfo: async() =>  {
      try {
        const data = await marketAsyncActions.getSymbolInfoMap();
        get().updateSymbolsInfo(data);
      } catch (error) {
        // 
        console.log('pullSymbolsInfo Error', error);
      }
    }
  }))
};

export const { StoreProvider: MarketStoreProvider, useStoreValue: useMarketStore } =
createStoreProvider<Market & MarketActions>('market', createMarketStore) as any;
