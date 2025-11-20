/**
 * Owner: will.wang@kupotech.com
 */
import { CANDLE_RESOLUTION_TYPES, COIN_DATA_SOURCE, KLINE_RESOLUTION_TYPES, SYMBOL_TYPE } from "@/config/kline";
import { CoinDetail, CoinInfo } from "@/types/coinDetail";
import { create } from "zustand";
import { UpdatePropAction } from "@/store/base";
import { fetchCoinSymbolData, fetchNewCoinInfos, getBestSymbolByCoin, getBetResult, getNotSalePriceData } from "@/services/coinDetail";
import { reportApiError } from "@/tools/sentry";
import createStoreProvider from "gbiz-next/createStoreProvider";
import { fetchExpressSymbols } from "@/services/convert";
import { bootConfig } from "kc-next/boot";
import { getTenantConfig } from "@/config/tenant";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const initialCoinInfo: CoinInfo = {
  currencyReferenceRecommend: null,
  ath: 'null',
  auditAgency: null,
  circulatingSupply: '',
  codeAndCommunity: [],
  contract: null,
  currencyIntroduction: [],
  doc: [],
  explorer: [],
  faqs: [],
  investor: null,
  marketCap: '',
  marketCapChange: '',
  maxSupply: '',
  priceLiveData: {
    priceUSD: '',
    close: '',
    closeTime: 0,
    high: '',
    highTime: 0,
    low: '',
    lowTime: 0,
    priceChangeRate24h: '',
    priceChangeRate7d: '',
    volume24h: '',
    symbol: '',
    closeUSD: '',
    priceAvg24h: '',
    priceChange24h: '', 
    priceChange7d: '',
    highestPrice24h: '',
    lowestPrice24h: '',
  },
  coinName: '',
  rank: '',
  rating: '',
  tags: [],
  website: [],
  dataSource: '',
  isUnsale: false,
  isTemporary: false,
  articleRecommendList: [],
  scaleChartDialogVisible: false, // k线放大dialog
  code: '',
  logo: '',
  atl: '',
  oneWordIntroduction: null,
};


// 异步状态获取
const asyncActions = {
  async getBestSymbolByCoin(coin: string) {
    try {
      const { success, data } =  await getBestSymbolByCoin({ coin: coin.toUpperCase() });

      if (success && data) {
        const spotSymbol = data.find((item) => item.category === SYMBOL_TYPE.SPOT)?.symbol;
        return ({ bestSymbol: spotSymbol || `${coin}-${bootConfig._BASE_CURRENCY_}`, tradingPairs: data });
      }
      return ({ bestSymbol: `${coin}-${bootConfig._BASE_CURRENCY_}`, tradingPairs: [] }); 
    } catch (err) {
      reportApiError('获取币种最佳交易对失败', err);
      console.log('获取币种最佳交易对失败 getBestSymbolByCoin Error', err);
      return ({ bestSymbol: `${coin}-${bootConfig._BASE_CURRENCY_}`, tradingPairs: [] });
      
    }
  },
  async fetchNewCoinInfos(params: { currency: string; symbol: string; legalCurrency: string; source: string;  }): Promise<Partial<CoinDetail>> {

      try {
        const { success, data } = await fetchNewCoinInfos(params);
        if (success) {
          if (data) {
            // 如果dataSource为null，则视为一个无效的币
            // TODO 无效币处理
            // if (!data.currencyInfo?.dataSource) {
            //   replace('/price');
            //   return;
            // }
            const spotSymbol = data.marketSymbolList?.find(
              (item) => item.category === SYMBOL_TYPE.SPOT,
            )?.symbol;

            // currencyInfo?.klineType 这个字段有如下取值，15min,1h,8h,1d,1w, null
            // 如果不为null，则代表业务那边配置了该币为冷币，且指定了kline默认聚合时间
            const currentKlineType = data.currencyInfo?.klineType;

            // 默认的kline时间聚合为5min
            let currentkLineResolution = CANDLE_RESOLUTION_TYPES[1];

            // 如果是配置了冷币，则让它的初始化resolution为[currencyInfo.klineType]对应的resolution
            if (typeof currentKlineType === 'string') {
              const isExistItem = CANDLE_RESOLUTION_TYPES.find(c => c[0].toLowerCase() === currentKlineType.toLowerCase());
             if (isExistItem) {
               currentkLineResolution = isExistItem;
             }
            }

            return {
              coinInfoReady: true,
              coinInfo: {
                ...initialCoinInfo,
                ...data.currencyInfo,
                currencyExplain: data.currencyExplain,
                isUnsale: data.currencyInfo?.dataSource === COIN_DATA_SOURCE.kucoinUnsale,
                isTemporary:
                  data.currencyInfo?.dataSource === COIN_DATA_SOURCE.ti ||
                  data.currencyInfo?.dataSource === COIN_DATA_SOURCE.cmc,
              },
              risePercent: data.currencyGuessingInfo?.risePercent || null,
              fallPercent: data.currencyGuessingInfo?.fallPercent || null,
              spotSymbol: spotSymbol || `${params.currency}-${bootConfig._BASE_CURRENCY_}`,
              tradingPairs: data.marketSymbolList,
              kLineResolution: currentkLineResolution,
            };
          }
        }

        return {
          coinInfoReady: false,
          coinInfo: initialCoinInfo,
        };
      } catch (err) {
        reportApiError('获取币种基础信息失败', err);
        console.log('获取币种基础信息失败 fetchNewCoinInfos Error', err);
        return {
          coinInfoReady: false,
          coinInfo: initialCoinInfo,
        };
      }
  },
  async fetchCoinSymbolData(bestSymbol: string): Promise<Partial<CoinDetail>> {
    try {
      const { success, data } = await fetchCoinSymbolData({ symbol: bestSymbol });
      if (success) {
        if (data) {
          return {
            tradeData: {
              [bestSymbol]: data.symbolStats,
            },
            trendInfo: data.currencyTrendInfo,
            latestPrice: data.symbolStats?.price || null,
          }
        }
      }

      return {};
    } catch (err) {
      reportApiError('获取币种交易对相关数据失败', err);
      console.log('获取币种交易对相关数据失败 fetchCoinSymbolData Error', err);
      return {};
    }
  },
  async getExpressSymbolByCoin(payload?: { coin: string, currency: string }): Promise<{
    expressSymbol: string;
  }> {
    try {
      const { success, data } = await fetchExpressSymbols();
      if (success) {
        let _expressSymbol = '';
        const { coin, currency } = payload ?? { coin: '', currency: '' };
        const curCoinSymbols = data.symbols?.[coin];
        if (curCoinSymbols && Array.isArray(curCoinSymbols)) {
          _expressSymbol = `${coin}-`;
          if (curCoinSymbols.some((i) => i === currency)) {
            _expressSymbol = `${coin}-${currency}`;
          }
        }
        return { expressSymbol: _expressSymbol };
      }

      return { expressSymbol: '' };
    } catch (err) {
      reportApiError('获取币种Express可交易对失败', err);
      console.log('获取币种Express可交易对失败 getExpressSymbolByCoin Error', err);
      return { expressSymbol: '' };
    }
  },
}

export const getInitialCoinDetail = async (coin: string, legalCurrency: string): Promise<Partial<CoinDetail>> => {
  const bestSymbolResult = await asyncActions.getBestSymbolByCoin(coin);

  const [coinInfoResult, tradeDataResult] = await Promise.all([
    asyncActions.fetchNewCoinInfos({
      currency: coin,
      symbol: bestSymbolResult.bestSymbol,
      legalCurrency,
      // TODO 获取source 原代码：useMemo(() => (responsive.md ? 'WEB' : 'H5'), [responsive.md]);
      source: 'WEB',
    }),
    asyncActions.fetchCoinSymbolData(bestSymbolResult.bestSymbol),
  ]);

  return {
    ...coinInfoResult,
    ...bestSymbolResult,
    ...tradeDataResult,
  }
}


type CoinDetailState = CoinDetail;

type CoinDetailActions =  {
  // 获取最佳交易对
  getBestSymbolByCoin: (coin: string) => Promise<Partial<CoinDetail>>;
  // 获取币种基本信息
  fetchNewCoinInfos: (params: { coin: string; currency: string }) => Promise<CoinInfo>;
  // getBetResult
  getBetResult: (payload: any) => Promise<void>;
  // 获取币种交易对相关数据
  getCurrentExpressSymbol: (coin: string, currency: string) => Promise<void>;
  // 获取临时币信息
  getNotSalePriceData: (params: { symbol: string }) => Promise<void>
  updateLatestPrice: (payload: any) => void;
} & UpdatePropAction<CoinDetailState>;


export const coinDetailInitialState: CoinDetailState = {
  selectResolution: KLINE_RESOLUTION_TYPES[1],
  kLineResolution: CANDLE_RESOLUTION_TYPES[1],
  hideChart: false,
  expressSymbol: '', // express 法币购买交易对
  bestSymbol: '', // 最佳交易对
  spotSymbol: '', // 最佳交易对
  tradingPairs: [], // 币种可交易对（现货 & 合约 & 杠杆）
  latestPrice: null, // 最新成交价
  openPrice: null, // 当前折线区间开盘价
  tradeData: {}, // 交易对价格等数据信息
  trendInfo: {}, // 交易对币价走势信息
  coinInfoReady: false,
  coinInfo: initialCoinInfo,
  fallPercent: null, // 竞猜上涨百分数
  risePercent: null, // 竞猜下跌百分数
  scaleChartDialogVisible: false,
  sharePageFlag: 0,
  analysis: {
    "mValue": 0.39,
    "mType": 1,
    "inOutUserChartData": [],
    "inOutMoneyChartData": [],
    "tradeUserChartData": [],
    "tradeAmtChartData": [],
    "buyAndSellUserChartData": [],
    "buyAndSellAmtChartData": [],
  },
};


export const createCoinDetailStore = (initState: Partial<CoinDetailState> = {}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return create<CoinDetailState & CoinDetailActions>((set, get) => ({
    ...coinDetailInitialState,
    ...initState,
    updateProp(payload) {
      return set(payload);
    },
    ...asyncActions,
    getBetResult: async (payload) => {
      const { success, data } = await getBetResult(payload.coin);
      if (success && data) {
        set({
          risePercent: data.risePercent || null,
          fallPercent: data.fallPercent || null,
        });
      }
    },
    getCurrentExpressSymbol: async (coin: string, currency: string) => {
      const { coinInfo } = get();
      const { expressSymbol } = await asyncActions.getExpressSymbolByCoin({ coin: coinInfo.code, currency });
      set({ expressSymbol });
    },
    updateLatestPrice(payload) {
      const { latestPrice } = payload;

      if (getTenantConfig().showExtraLatestPriceKey) {
        set({
          thLatestPrice: latestPrice,
        });
      } else {
        set({
          latestPrice,
        });
      }
    },
    getNotSalePriceData: async (payload: any) => {
      const { success, data } = await getNotSalePriceData(`${payload.symbol}-${bootConfig._BASE_CURRENCY_}`);
      if (success) {
        const symbolPair = `${payload.symbol}-${bootConfig._BASE_CURRENCY_}`;
        set({
            // 基于USDT的价格, 注意汇率转换
            latestPrice: data.livePrice, 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tradeData: {
              ...get().tradeData,
              [symbolPair]: {
                lowestPrice24h: data.twentyFourHourLowPrice,
                highestPrice24h: data.twentyFourHourHighPrice,
                priceChangeRate1h: data.oneHourChange,
                priceChangeRate24h: data.twentyFourHourChange,
                priceChangeRate7d: data.sevenDayChange,
              }
            },
          });
      }
    }
  }));
}

export const { StoreProvider: CoinDetailStoreProvider, useStoreValue: useCoinDetailStore } =
  createStoreProvider<CoinDetailState & CoinDetailActions>('coinDetail', createCoinDetailStore);
