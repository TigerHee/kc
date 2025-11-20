/**
 * Owner: garuda@kupotech.com
 */
import { equals, lessThan } from 'utils/operation';

// 利用 二分查找法找到风险限额对应的档位
export const findRiskLimitItem = (riskLimits, leverage) => {
  if (!riskLimits?.length || !leverage) return false;
  let left = 0;
  let right = riskLimits.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (equals(riskLimits[mid]?.maxLeverage)(leverage)) {
      return riskLimits[mid];
    } else if (lessThan(riskLimits[mid]?.maxLeverage)(leverage)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  // 如果没有找到等于目标数的元素，返回小于目标数的最大值
  return riskLimits[right];
};
