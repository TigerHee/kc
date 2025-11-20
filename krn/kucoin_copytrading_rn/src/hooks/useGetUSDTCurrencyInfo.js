import {useSelector} from 'react-redux';
import {getBaseCurrency} from 'site/tenant';

const COPY_TRADE_BUSINESS_USDT_DEFAULT_DISPLAY_PRECISION = 2;
const COPY_TRADE_BUSINESS_USDT_DEFAULT_PRECISION = 8;

/** 获得 USDT 币种 相关信息 */
export const useGetUSDTCurrencyInfo = () => {
  const futuresCurrenciesMap =
    useSelector(state => state.futures.futuresCurrenciesMap) || {};
  const settleSymbol = getBaseCurrency();

  return {
    currencyInfo:
      futuresCurrenciesMap[settleSymbol] || futuresCurrenciesMap.USDT,
    displayPrecision:
      Number(
        futuresCurrenciesMap[settleSymbol]?.properties?.displayPrecision,
      ) || COPY_TRADE_BUSINESS_USDT_DEFAULT_DISPLAY_PRECISION,
    precision:
      Number(futuresCurrenciesMap[settleSymbol]?.precision) ||
      COPY_TRADE_BUSINESS_USDT_DEFAULT_PRECISION,
  };
};
