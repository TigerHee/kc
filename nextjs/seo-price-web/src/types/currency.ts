export interface Currency {
  currency: string;
  currencyList: string[];
  rates: Record<string, string>;
  prices: Record<string, string>;
}