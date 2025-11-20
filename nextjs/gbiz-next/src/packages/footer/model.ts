/**
 * Owner: victor.ren@kupotech.com
 */

import { create } from 'zustand';
import createStoreProvider from 'tools/createStoreProvider';
import { getSummary, getContractSummary, getServerTime, getTurnoverRank, getFooterInfo } from './service';
import { bootConfig } from "kc-next/boot";

interface Coin {
  name: string;
  fullName: string;
}

export type FooterState = {
  summary: {
    TRADING_VOLUME: {
      amount: number;
    };
  };
  serverTime: number;
  turnoverRank: {
    items: Coin[]
  }; // 成交额榜
  showStatic: boolean;
  multiLevelPositions: any[] | undefined;
}
export type FooterActions = {
  pullSummary: () => Promise<any>;
  pullServerTime: () => void;
  // 获取成交额榜
  getTurnoverRank: () => void;
  updateFooter: (params) => void;
  pullFooterInfo: () => Promise<any>;
};

// 开发主要关注这里，定义状态和方法
export const defaultInitState: FooterState = {
  summary: {
    TRADING_VOLUME: {
      amount: 0,
    }
  },
  serverTime: 0,
  turnoverRank: {
    items: [],
  },
  showStatic: false,
  multiLevelPositions: undefined,
};

export const createFooterStore = (initState: Partial<FooterState>= {}) => {
  return create<FooterState & FooterActions>((set, get) => ({
    ...defaultInitState,
    ...initState,

    updateFooter(params) {
      set(params);
    },

    pullSummary: async () => {
      try {
        const BASE_CURRENCY = bootConfig._BASE_CURRENCY_ || 'USDT';
        const [{ data }, contractSummaryData] = await Promise.all([
          getSummary(BASE_CURRENCY),
          getContractSummary(BASE_CURRENCY).catch(() => ({ data: { volume: '0' } }))
        ]);
    
        const summary: any = {
          TRADING_VOLUME: { amount: '0' }
        };
    
        if (data) {
          data.forEach(item => {
            summary[item.type] = item;
          });
        }
    
        const contractVolume = contractSummaryData.data.volume;
        if (summary.TRADING_VOLUME) {
          summary.TRADING_VOLUME = {
            ...summary.TRADING_VOLUME,
            amount: contractVolume || '0'
          };
        }
    
        set({ summary });
        return summary;
        
      } catch (error) {
        console.error('Error pulling summary:', error);
        const fallbackSummary: any = { TRADING_VOLUME: { amount: '0' } };
        set({ summary: fallbackSummary });
        return fallbackSummary;
      }
    },

    pullServerTime: async () => {
      const { data } = await getServerTime();
      set({ serverTime: data });
    },

    pullFooterInfo: async () => {
      const res = await getFooterInfo();
      if (res.success && res.data) {
        const { data } = res;
        set({ showStatic: !data.supportPosition, multiLevelPositions: data.multiLevelPositions,});
        return {
          showStatic: !data.supportPosition,
          multiLevelPositions: data.multiLevelPositions,
        }
      }
      return {
        showStatic: true,
        multiLevelPositions: undefined,
      }
    },

    getTurnoverRank: async () => {
      const { data } = await getTurnoverRank({
        tagId: '6225ad8d491ffe87c4e42490',
      }); // 获取交易榜单数据需要写死tagId
      set({ turnoverRank: data });
      return data;
    }
    
  }));
}

export const { StoreProvider: FooterStoreProvider, useStoreValue: useFooterStore } =
  createStoreProvider<FooterState & FooterActions>('FooterStore', createFooterStore);
