/**
 * owner@clyne@kupoetch.com
 */

/**
 * 交易对
 */
export type Symbol = 'string';

/**
 * 合约配置（后续完善）
 */
export interface SymbolInfo {
  quoteCurrency?: string;
  symbol?: string;
  baseCurrency?: string;
  type?: string;
  settleDate?: number | null;
}

/**
 * 合约列表
 */
export type SymbolList = SymbolInfo[];

/**
 * 合约列表映射
 */
export interface SymbolsMap {
  [symbol: string]: SymbolInfo;
}

/**
 * SymbolNameProps
 */
export interface SymbolNameProps {
  symbol: Symbol;
  theme?: string;
  variant?: 'text' | 'tag';
  className?: string;
  size?: 'basic' | 'small' | 'large';
}

export interface UseGetSymbolTextProps {
  /**
   * 交易对 symbol
   */
  symbol: Symbol; // Symbol 类型在原文件中定义为 string

  /**
   * 是否为标签模式（可选）
   */
  isTag?: boolean;

  /**
   * 备用显示文本（可选）
   */
  fallback?: string;
}

export interface UseGetSymbolTextResult {
  /**
   * 基准币种（如 BTC、ETH 等）
   */
  base: string;

  /**
   * 计价币种（如 USD、USDT 等）
   */
  quoteCurrency: string;

  /**
   * 完整的交易对名称（如 BTCUSD-23SEP25）
   */
  symbolName: string;

  /**
   * 标签名称
   */
  tagName: string;

  /**
   * symbolName备用显示文本
   */
  fallback: string;
}

// 定义状态类型
export interface AppState {
  symbolsMap?: SymbolsMap;
  theme?: string;
  _t?: any;
}

// 定义action类型
export type AppAction = { type: 'UPDATE'; payload: AppState };
