/*
 * @owner: borden@kupotech.com
 */
import { useCurrenciesMap, useFromCurrency, useToCurrency } from './useStoreValue';

export default function useEtfTag() {
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const currenciesMap = useCurrenciesMap();

  return [currenciesMap?.[fromCurrency]?.marginMark, currenciesMap?.[toCurrency]?.marginMark].find(
    (v) => v && v !== 'NO_MARGIN',
  );
}
