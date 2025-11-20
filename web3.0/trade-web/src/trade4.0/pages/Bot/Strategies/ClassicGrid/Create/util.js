/**
 * Owner: mike@kupotech.com
 */
import { calcBuySellNum } from '../util';
import { submitData } from '../config';

// 合并生成需要提交、之后需要用的数据
export const createSetInProp = (allParams) => {
  const { useBaseCurrency, inverst } = allParams;
  // 计算实际投入
  const { deelBaseNum, needInverstBase, needInverstQuota } = calcBuySellNum(allParams);
  // 默认使用Base账户
  const setInProp = {
    // 提交的数据
    submitData: submitData({
      baseAmount: useBaseCurrency === false ? 0 : needInverstBase,
      quotaAmount: useBaseCurrency === false ? inverst : needInverstQuota,
      ...allParams,
    }),
    // 传入确认弹框的数据
    options: {
      ...allParams,
      deelBaseNum,
      needInverstBase,
      needInverstQuota,
    },
  };
  return setInProp;
};
