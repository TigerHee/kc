/**
 * Owner: mike@kupotech.com
 */

type SymbolCode = string;
type Decimal = number;
/**
 * @description: 获取最小投资额度/爆仓价
 * 没有limitAsset计算最小投资额度;
 * 有, 就可以计算爆仓价
 */
export interface PostForMinInvestBlowPrice {
  symbol: SymbolCode;
  direction: string;
  leverage: number;
  buyAfterFall: Decimal;
  buyTimes: number;
  buyMultiple: number;
  
  limitAsset?: number;
  openUnitPrice?: number;
}

/**
 * @description: 最小投资额数据类型
 * @return {*}
 */
export interface minInvestData {
  blowUpPrice: number;
  minInvestment: number;
}
