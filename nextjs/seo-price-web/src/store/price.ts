/**
 * Owner: will.wang@kupotech.com
 */
import { create } from 'zustand';
import { getCoinsCategory, searchAllTypeList } from '@/services/price';
import { getCoinList } from '@/services/newCurrency';
import { PriceRecord } from '@/types/price';

import createStoreProvider from 'gbiz-next/createStoreProvider';
import createCommonErrorResponse from '@/with-common-props/createCommonErrorResponse';
import { tabsConfig } from '@/routes/[coin]/components/CoinRank/config';

const getRankOverViewList = async (payload: any) => {
  const res = await getCoinList(payload);
  if (res?.success) {
    return {
      key: payload.key,
      data: res.data,
    };
  }
  return false;
}

interface UsdtRate {
  [key: string]: string; // USDT 汇率数据，键为币种，值为汇率
}

interface CoinItem {
  tags: string[];
  operationTags: string[] | null;
  item: string;
  weight: number | null;
  name: string;
  fullName: string;
  precision: number;
  iconUrl: string;
  symbolCode: string;
  price: string;
  changeRate: string;
  volValue: string;
  openingTime: string | null;
  openingPrice: string | null;
  holding: string | null;
  proportion: string | null;
  hourTradingUserCount: number | null;
  heatValue: number | null;
  marketCap: string | null;

}

interface PriceState {
  topList: Array<{ id: string; name: string; change: number }>; // 涨幅榜; INCREASE
  hotCoins: Array<{ id: string; name: string; volume: number, volValue: string }>; // 热币榜; HOT_CURRENCY
  newCoins: Array<{ id: string; name: string; launchDate: string }>; // 新币列表; NEW_CURRENCY
  keywords: string; // 搜索字段
  usdtRate: UsdtRate; // USDT 汇率数据
  overViewList: Record<string, CoinItem[]>; // 概览列表
  mainCoinList: CoinItem[]; // 主流币种列表
  records: PriceRecord[]; // 虚拟货币列表
  pagination: { current: number; page: number; pageSize: number; total: number }; // 分页结果
  totalHeaderHeight: number;  // header的动态高度，在gbiz header中回调获取
}


 type getMainCoinListQueryParams = {
  currentPage: number; // 当前页码
  pageSize: number; // 每页显示的条数
  sortField: string; // 排序字段
  sortType: 'ASC' | 'DESC'; // 排序类型，限定为升序或降序
  tabType: 'ALL_CURRENCY' | 'OTHER_TAB_TYPES'; // 标签类型，可根据实际情况扩展
  subCategory: string; // 子分类
}

interface AppActions {
  updateKeywords: (keywords: string) => void; // 更新搜索字段
  getMainCoinList: (params: getMainCoinListQueryParams) => Promise<void>; // 获取主流币种列表 
  getRankingOverViewForRanking: () => Promise<void>; // 获取概览列表
  getUsdtRate: () => Promise<void>; // 获取USDT汇率数据
  getAllCrypto: (params: any) => Promise<void>; // 获取所有虚拟货币数据
  getListByKeyword: (payload: { keywords: string; currentPage: number; }) => Promise<void>; // 根据关键词获取虚拟货币数据
  getCoinList: (params: { keyName: string, algorithm: string }) => Promise<void>; // 获取虚拟货币数据
  update: (state: Partial<PriceState>) => void; // 更新状态
  handleSocketSubscribe: (data: { result: any, keyName: string }) => void; // 处理 WebSocket 订阅
}

const asyncActions = {
  getAllCrypto: async (payload: {
    currentPage: string | number;
    pageSize: number;
    sortField: string;
    sortType: string;
    source: string;
    keywords: string;
  }): Promise<Partial<PriceState>> => {
    const currentPage = payload?.currentPage || 1;
    try {
      const { success, data } = await getCoinsCategory({
        currencyCode: payload.keywords,
        sortField: '',
        sortType: '',
        source: '',
        pageIndex: currentPage,
        pageSize: 100,
      });
      
      if (success && data) {
        const { items, currentPage, pageSize, totalNum, totalPage } = data;

        return {
          records: items || [],
          pagination: {
            current: currentPage,
            pageSize: pageSize || 100,
            total: totalNum || 0,
            page: totalPage || 0,
          },
        }
      }

      return {
        records: [],
        pagination: {
          current: Number(currentPage),
          pageSize: 100,
          total: 0,
          page: 0,
        }
      };
    } catch (e) {
      console.log('getAllCrypto Error', e);
      return createCommonErrorResponse({}, e);
    }
  },
  getCoinList: async (payload: { keyName: string, algorithm: string }): Promise<Partial<PriceState>> => {
    try {
      const { success, data } = await getCoinList({
        algorithm: payload.algorithm,
        type: 'LIST',
      });

      if (success) {
        const list = data && data.items ? data.items : [];

        return {
          [payload.keyName]: list
        };
      }

      return {
        [payload.keyName]: [],
      };
    } catch (e) {
      console.log('getCoinList Error', e);
      return createCommonErrorResponse({}, e);
    }
  }
}


// 获取首页price列表数据
export const getInitialPriceStoreState = async (params: {
  page?: string;
}): Promise<Partial<PriceState>> => {
  try {
    const [
    priceRecordResult,
    priceHotList,
  ] = await Promise.all([
    asyncActions.getAllCrypto({
      currentPage: params.page ?? 1,
      pageSize: 100,
      sortField: '',
      sortType: '',
      source: '',
      keywords: '',
    }),
    asyncActions.getCoinList({ keyName: 'hotCoins', algorithm: 'HOT_CURRENCY' }),
  ]);

    return {
      ...priceHotList,
      ...priceRecordResult,
    }
  } catch (error) {
    console.error('获取首页price列表数据失败', error);
    return createCommonErrorResponse({}, error);  
  }
}

// 获取首页其他tab列表数据
export const getOtherCategoryInitialStoreState = async (payload: { keyName: string, algorithm: string }): Promise<Partial<PriceState>> => {
  try {
    const coinListResult = await asyncActions.getCoinList(payload);
    return coinListResult;
  } catch (error) {
    console.error(`获取首页price tab[${payload.keyName}]列表数据失败`, error);
    return createCommonErrorResponse({}, error);  
  }
}

export const defaultInitState: PriceState = {
  topList: [],
  hotCoins: [],
  newCoins: [],
  keywords: '',
  usdtRate: {},
  overViewList: {},
  mainCoinList: [],
  records: [],
  totalHeaderHeight: 72,
  pagination: {
    current: 1,
    pageSize: 10,
    page: 1,
    total: 0,
  },
};

export const createPriceStore = (initState: Partial<PriceState> = {}) => {
  return create<PriceState & AppActions>((set, get) => ({
    ...defaultInitState,
    ...initState,
    updateKeywords(keywords) {
      set({ keywords });
    },
    getMainCoinList: async (payload: getMainCoinListQueryParams) => {
      const { success, data } = await searchAllTypeList(payload);
      
      if (success && data.data) {
        const newsData = data?.data.map((item) => {
          return {
            ...item,
            name: item.baseCurrency,
            price: item.lastTradePrice,
            changeRate: item.changeRate24h,
          };
        });
        set({
          mainCoinList: newsData,
        })
      }
    },
    // 获取币种排行数据
    getRankingOverViewForRanking: async () => {
      const questList = tabsConfig.filter((item) => item.tagId);
      const promiseList = questList.map((promise) => {
        
        return getRankOverViewList({
            tagId: promise?.tagId,
            key: promise.value,
          })
      });
      const results = await Promise.all(promiseList);
      const overView = {};
      results.map((ranking, index) => {
        if (!ranking) return {}
        overView[ranking.key] = ranking?.data?.items.length ? ranking?.data?.items : [];
      });
      set({
        overViewList: overView,
      });
    },
    getUsdtRate: async () => {
    },
    getAllCrypto: async (payload: {
      currentPage: number;
      pageSize: number;
      sortField: string;
      sortType: string;
      source: string;
    }) => {
      const keywords = get().keywords || '';
      const data = await asyncActions.getAllCrypto({ ...payload, keywords });
      set(data);
    },
    getListByKeyword: async (payload: { keywords: string; currentPage: number; }) => {
      set({ keywords: payload.keywords });
      get().getAllCrypto({ currentPage: payload.currentPage });
    },
    getCoinList: async (payload: { keyName: string, algorithm: string }) => {
      const data = await asyncActions.getCoinList(payload);
      set(data);
    },
    update: (state: Partial<PriceState>) => {
      set((prevState) => ({ ...prevState, ...state }));
    },
    handleSocketSubscribe: ({ result, keyName }) => {
      const key = keyName;
      const oldData = get()[key] || [];
      const newSymbolsData = {};
      
      result.forEach((item: any) => {
        const name = item.data.currency;
        newSymbolsData[name] = item.data;
      });

      set({
        [key]: oldData.map((item) => ({
          ...item,
          price: newSymbolsData[item.name]?.lastPrice || item.price,
          changeRate: newSymbolsData[item.name]?.changeRate || item.changeRate,
        })),
      })
    }
  }));
};

export const { StoreProvider: PriceStoreProvider, useStoreValue: usePriceStore } =
  createStoreProvider<PriceState & AppActions>('PriceStore', createPriceStore);
