/**
 * Owner: will.wang@kupotech.com
 */
export type KLineType = "line" | "candle";

export interface TradingPair {
  currency: string;
  symbol: string;
  category: string;
  price: string;
  changeRate: string;
  maxLeverage: number;
  baseCurrency: string;
  quoteCurrency: string;
  siteType: string;
}

export interface TradeData {
  currency: string;
  symbol: string;
  highestPrice24h?: string;
  lowestPrice24h?: string;
  priceChangeRate1h?: string;
  priceChangeRate24h: string;
  priceChangeRate7d?: string;
  volume24h?: string;
  volumeValue24h?: string;
  timestamp?: number;
  price: string;
  priceUSD?: string;
  high?: string;
  highTime?: number;
  low?: string;
  lowTime?: number;
  priceAvg24h?: string;
  priceChange24h?: string;
  priceChange7d?: string;
  siteType: string;
  close?: number;
}

export interface TrendInfo {
  todayGrowthRate: string;
  todayGrowth: string;
  sevenDaysGrowthRate: string;
  sevenDaysGrowth: string;
  thirtyDaysGrowthRate: string;
  thirtyDaysGrowth: string;
  threeMonthsGrowthRate: string;
  threeMonthsGrowth: string;
}

export interface ContractGrid {
  maxLeverage: number;
  minAmount: string;
  todayTopProfitRateYear: string;
  symbol: string;
}

export interface SpotGrid {
  maxLeverage: null | number;
  minAmount: string;
  todayTopProfitRateYear: string;
  symbol: string;
}

export interface PoolStakingProducts {
  products: string[];
  todayTopProfitRateYear: string;
}

export interface CurrencyIntroduction {
  id: string;
  type: string;
  text: string;
  href: null | string;
  subText: string;
  subHref: null | string;
  src: null | string;
  remark: null | string;
  machineTranslate: boolean;
}

export interface Faq {
  question: string;
  answer: CurrencyIntroduction[];
}

export interface ArticleRecommend {
  id: string;
  bizType: string;
  category: null | string;
  articleCode: string;
  title: string;
  url: string;
  publicAt: number;
}

export interface CurrencyTag {
  tagId: string;
  type: number;
  algorithm: number;
  title: string;
  subtitle: string;
  description: null | string;
  gemBoxDescription: null | string;
  displayType: number;
}

export interface CurrencyExplain {
  rankExplain: string;
  athExplain: string;
  marketCapExplain: string;
  maxSupplyExplain: string;
  ratingExplain: string;
  hoursChangeExplain: null | string;
  daysChangeExplain: null | string;
  weeksChangeExplain: null | string;
}

export interface PriceLiveData {
  symbol: string;
  volume24h: string;
  priceChangeRate24h: string;
  priceChangeRate7d: string;
  highestPrice24h: string;
  lowestPrice24h: string;
  high: string;
  highTime: number;
  low: string;
  lowTime: number;
  close: string;
  closeUSD: string;
  closeTime: number;
  priceAvg24h: string;
  priceUSD: string;
  priceChange24h: string;
  priceChange7d: string;
}

export interface CoinInfo {
  currencyReferenceRecommend: {
    questInfos: null | any[];
    contractGrid: ContractGrid;
    spotGrid: SpotGrid;
    poolStakingProducts: PoolStakingProducts;
  } | null;
  ath: string;
  auditAgency: null | string[];
  circulatingSupply: string;
  codeAndCommunity: string[];
  contract: null | string;
  currencyIntroduction: CurrencyIntroduction[];
  doc: string[];
  explorer: string[];
  faqs: Faq[];
  investor: null | string[];
  marketCap: string;
  marketCapChange: string;
  maxSupply: string;
  priceLiveData: PriceLiveData;
  coinName: string;
  rank: string;
  rating: string;
  tags: null | string[];
  website: string[];
  dataSource: string;
  isUnsale: boolean;
  isTemporary: boolean;
  articleRecommendList: ArticleRecommend[];
  scaleChartDialogVisible: boolean;
  code: string;
  logo: string;
  atl: string;
  oneWordIntroduction: CurrencyIntroduction | null;
  currencyTagList: CurrencyTag[];
  activities: any[];
  topics: any[];
  arriveCountdown: null;
  jumpSuffix: string;
  siteType: string;
  currencyExplain: CurrencyExplain;
}

export type CoinDetail = {
  selectResolution: any[];
  kLineResolution: any[];
  expressSymbol: string;
  bestSymbol: string;
  spotSymbol: string;
  tradingPairs: any[];
  latestPrice: number | null;
  scaleChartDialogVisible: boolean,
  openPrice: number | null;
  tradeData: Record<string, PriceLiveData & { price: string; priceChangeRate1h: string; volumeValue24h: string; }>;
  trendInfo: Record<string, unknown>;
  coinInfoReady: boolean;
  coinInfo: CoinInfo;
  fallPercent: number | null;
  risePercent: number | null;
  sharePageFlag: number;
  thLatestPrice?: number;
  hideChart?: boolean;
  analysis: {
    mType: number;
    mValue: number;
    inOutUserChartData: any[];
    inOutMoneyChartData: any[];
    tradeUserChartData: any[];
    tradeAmtChartData: any[];
    buyAndSellUserChartData: any[];
    buyAndSellAmtChartData: any[];
  }
};