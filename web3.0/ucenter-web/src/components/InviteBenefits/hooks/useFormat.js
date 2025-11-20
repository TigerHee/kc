/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/NewCustomerTask/Task/LimitTaskArea/components/hooks/index.js
 */
import { currentLang } from '@kucoin-base/i18n';
import { useEventCallback } from '@kux/mui/hooks';
import useKuxFormat from '../hooks/useKuxFormat';
import { nFormatter } from '../tools/helper';

export const minCoverNum = 1000;

export const numOptions = {
  maximumFractionDigits: 2,
};

export const useFormat = () => {
  const { numberFormat } = useKuxFormat();
  const formatNum = useEventCallback((num, options = {}) => {
    const _options = { ...numOptions, ...(options || {}) };
    return numberFormat({
      lang: currentLang,
      number: Number(num),
      options: _options,
    });
  });
  const formatNumInt = useEventCallback((num) => {
    return formatNum(Math.floor(num), {
      maximumFractionDigits: 0,
    });
  });
  return {
    formatNum,
    formatNumInt,
    nFormatterK: useEventCallback(
      (amount, precision = 0, { minCoverNum: _minCoverNum = minCoverNum } = {}) => {
        return nFormatter(Number(amount), precision, { minCoverNum: _minCoverNum });
      },
    ),
  };
};
