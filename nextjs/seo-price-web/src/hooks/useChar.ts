/**
 * Owner: melon@kupotech.com
 */
import { currencyMap } from "@/config/base";
import { useCurrencyStore } from "@/store/currency";

/**
 * 根据汇率符号
 * @returns
 */
const useChar = () => {
  const currency = useCurrencyStore((state) => state.currency);
  const char = currencyMap[currency] || currency;
  return char;
};

export default useChar;
