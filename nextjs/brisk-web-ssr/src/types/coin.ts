// 基础币种信息类型
export interface BaseCoinItem {
  currencyCode: string;
  iconUrl: string;
  symbolCode: string;
}

// 交易币种列表项类型
export interface CoinListItem extends BaseCoinItem {
  price: string | number;
  changeRate: string | number;
  isComing: false;
}

// 即将上线币种项类型
export interface ComingCoinItem extends BaseCoinItem {
  supportBook: number;
  tradeCountdown: number;
  isComing: true;
}

// 统一的币种项类型（可以是交易币种或即将上线币种）
export type CoinItem = CoinListItem | ComingCoinItem;


