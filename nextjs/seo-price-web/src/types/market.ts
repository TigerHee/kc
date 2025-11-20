/**
 * Owner: will.wang@kupotech.com
 */

export interface SymbolInfo {
  code: string;
  symbolCode: string;
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  type: string;
  mark: number;
  board: number;
  weight: number;
  enableTrading: boolean;
  display: boolean;
  market: string;
  markets: string[];
  disabledTip: string | null;
  createdAt: number;
  isMarginEnabled: boolean;
  isEnableMarginTrade: boolean;
  isBotEnabled: boolean;
  context: any | null;
  sequence: number;
  previewTime: number | null;
  previewRemainSecond: number;
  previewEnableShow: boolean;
  tradeEnableShow: boolean;
  openingTime: number | null;
  isAuctionEnabled: boolean;
  isEnableAuctionTrade: boolean;
  feeCode: string;
  makerFeeRate: string;
  takerFeeRate: string;
  quoteIncrement: string;
  quoteMinSize: string;
  quoteMaxSize: string;
  baseIncrement: string;
  baseMinSize: string;
  baseMaxSize: string;
  priceIncrement: string;
  priceLimitRate: string;
  precision: number;
  restrictedCountry: string | null;
  makerFeeCoefficient: string;
  takerFeeCoefficient: string;
  priceProtect: boolean;
  onlySupportLimit: boolean | null;
  limitExpireTime: number | null;
  referPriceUp: number | null;
  referPriceDown: number | null;
  referPriceExpireTime: number | null;
  minFunds: number | null;
  tradeSideLimit: boolean;
  auctionStatus: number;
  callAuctionPrice: number | null;
  auctionPreviewTime: number | null;
  auctionPreviewRemainSecond: number;
  unionUpdatedAt: number | null;
  isEnabled: boolean;
  siteType: string | null;
}

export interface Market {
  symbolsInfoMap: Record<string, Partial<SymbolInfo>>;
}