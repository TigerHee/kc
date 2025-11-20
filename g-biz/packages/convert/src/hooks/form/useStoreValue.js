/*
 * owner: june.lee@kupotech.com
 */

// 从 store 里获取的值统一收口到本文件定义的hook，自动适配orderType

import { useSelector } from 'react-redux';
import {
  convertSymbolsMapSelector,
  currenciesMapSelector,
  currenciesSelector,
  fromCurrencySelector,
  loopDurationTimeSelector,
  priceSymbolSelector,
  toCurrencySelector,
} from '../../models';

export const useFromCurrency = () => {
  const fromCurrency = useSelector(fromCurrencySelector);
  return fromCurrency;
};

export const useToCurrency = () => {
  const toCurrency = useSelector(toCurrencySelector);
  return toCurrency;
};

export const useLoopDurationTime = () => {
  const loopDurationTime = useSelector(loopDurationTimeSelector);
  return loopDurationTime;
};

export const usePriceSymbol = () => {
  const priceSymbol = useSelector(priceSymbolSelector);
  return priceSymbol;
};

export const useCurrencies = () => {
  const currencies = useSelector(currenciesSelector);
  return currencies;
};

export const useCurrenciesMap = () => {
  const currenciesMap = useSelector(currenciesMapSelector);
  return currenciesMap;
};

export const useConvertSymbolsMap = () => {
  const convertSymbolsMap = useSelector(convertSymbolsMapSelector);
  return convertSymbolsMap;
};
