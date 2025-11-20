import { useCategoriesStore } from "@/store/categories";

/**
 * 获取当前币种对象
 * @param coin 币种名称
 * @returns 币种对象或 null
 */
export function useCurrentCoinObj(coin: string | null | undefined) {
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coin ? coinDict[coin as string] || null : null;

  return coinObj;
}
