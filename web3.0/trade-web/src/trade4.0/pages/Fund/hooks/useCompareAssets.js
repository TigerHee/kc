/**
 * Owner: odan.ou@kupotech.com
 */
import { useCallback } from 'react';
import { useSelector } from 'dva';
import { multiplyAndFixed } from 'helper';

const getMultiplyVal = (a, b) => {
  if (!a || !b) return 0;
  try {
    return +multiplyAndFixed(a, b);
  } catch (err) {
    return 0;
  }
};

/**
 * 判断是否为小额资产
 * 都转化为法币比较
 * @param {*} currencyInfo1
 * @param {*} currencyInfo2
 */
const useCompareAssets = () => {
  const prices = useSelector((state) => state.currency.prices);
  // 用户小额资产配置
  const smallExchangeConfig = useSelector(
    (state) => state.user_assets.smallExchangeConfig,
  );
  // 如 baseCurrency: "USDT", quotaLimit: "10"
  const { quotaLimit, baseCurrency } = smallExchangeConfig || {};
  const hasSmall = !!quotaLimit && !!baseCurrency;
  // 小额资产额度值
  const smallExchangeVal = getMultiplyVal(quotaLimit, prices[baseCurrency]);
  // 判断是否为小额资产
  const isLargeAssets = useCallback((amount, currency) => {
    if (!hasSmall) return true;
    return getMultiplyVal(amount, prices[currency]) >= smallExchangeVal;
  }, [hasSmall, prices]);

  const getAssetsVal = useCallback(
    (currencyInfo, amountKey = 'baseCurrencyAmount') => {
      const { [amountKey]: amount, currency } = currencyInfo;
      return getMultiplyVal(amount, prices[currency]);
  }, [prices]);
  // 比较两种资产大小，amountKey
  const compareAssets = useCallback(
    (currencyInfo1, currencyInfo2, amountKey = 'baseCurrencyAmount') => {
      return getAssetsVal(currencyInfo1, amountKey) >=
      getAssetsVal(currencyInfo2, amountKey);
  }, [getAssetsVal]);

  // 两种资产排序(table上用)
  const assetsSorter = useCallback((amountKey = 'baseCurrencyAmount') => {
    return (currencyInfo1, currencyInfo2) => {
      const val1 = getAssetsVal(currencyInfo1, amountKey);
      const val2 = getAssetsVal(currencyInfo2, amountKey);
      if (val1 === 0 && val2 === 0) {
        return currencyInfo1[amountKey] - currencyInfo2[amountKey];
      }
      return val1 - val2;
    };
  }, [getAssetsVal]);

  return {
    isLargeAssets,
    assetsSorter,
    compareAssets,
    // getAssetsVal,
  };
};

export default useCompareAssets;
