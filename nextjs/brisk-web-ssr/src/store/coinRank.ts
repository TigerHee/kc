import { create } from 'zustand';
import { getSplUsingGet, SplItemResponse } from '@/api/discover-front';
import { queryUsingGet3 } from '@/api/currency-front';
import type { CoinItem } from '@/types/coin';

// 算法类型枚举
type AlgorithmType = 'NEW_CURRENCY' | 'HOT_SEARCH' | 'INCREASE';

// 币种列表类型映射
const LIST_TYPE_MAP = {
  NEW_CURRENCY: 'newCoins',
  HOT_SEARCH: 'hotCoins',
  INCREASE: 'topList',
} as const;

// 币种排行榜状态类型
interface CoinRankState {
  newCoins: CoinItem[];
  hotCoins: CoinItem[];
  topList: CoinItem[];
  comingList: CoinItem[];
}

// 币种排行榜操作类型
interface CoinRankActions {
  setCoinList: (algorithm: AlgorithmType) => void;
  setRecentActivePrefix: () => void;
}

// 完整的币种排行榜store类型
type CoinRankStore = CoinRankState & CoinRankActions;

type ExtendedSplItemResponse = SplItemResponse & {
  symbolCode: string;
  iconUrl: string;
  price: string;
  changeRate: string;
};

export const useCoinRankStateStore = create<CoinRankStore>(set => ({
  // 新币
  newCoins: [],
  // 热币
  hotCoins: [],
  // 涨幅
  topList: [],
  // 上新列表:
  comingList: [],

  setCoinList: async (algorithm: AlgorithmType) => {
    const listKey = LIST_TYPE_MAP[algorithm];

    const res = await getSplUsingGet({
      algorithm,
      type: 'LIST',
    });

    const items = (res?.data?.items || []) as ExtendedSplItemResponse[];

    set({
      [listKey]: items
        .filter(i => i.symbolCode)
        .slice(0, 5)
        .map(item => {
          return {
            currencyCode: item.item,
            iconUrl: item.iconUrl,
            symbolCode: item.symbolCode,
            price: item.price,
            changeRate: item.changeRate,
            isComing: false,
          };
        }),
    });
  },

  setRecentActivePrefix: async () => {
    const res = await queryUsingGet3({ type: 'NEWEST' });
    set({
      comingList: (res?.data || [])
        .filter(el => el.isAllowBook && (el.tradeCountdown ?? 0) > 0)
        .sort((a, b) => (a.tradeCountdown ?? 0) - (b.tradeCountdown ?? 0))
        .slice(0, 2)
        .map(el => ({
          currencyCode: el.currency || '',
          iconUrl: el.iconUrl || '',
          symbolCode: el.symbol || '',
          supportBook: el.supportBook || 0,
          tradeCountdown: el.tradeCountdown || 0,
          isComing: true,
        })),
    });
  },
}));
