import {useCallback} from 'react';
import {getBaseCurrency} from 'site/tenant';
import {useTheme} from '@krn/ui';

import useLang from 'hooks/useLang';
import {isUnfOrZero, numberFixed} from 'utils/helper';
import {genComparisonOperatorAndValue, transformRTLShowNumber} from './helper';

export const useGetFormatNumber = () => {
  const {numberFormat} = useLang();
  const {isRTL} = useTheme();

  const formatNumber = useCallback(
    (data, payload) => {
      const {
        isProfitNumber,
        placeholder,
        isPositive = false,
        beforeText = '',
        afterText = '',
        options,
        needUSDTUnit = false,
      } = payload || {};
      const {maximumFractionDigits, style} = options || {};

      // 产品需求： 跟单收益金额存在部分账户剩余尾巴数（整数为 0，小数都为 0 精度超出八位后不为 0 的小数 eg： 0.000000000123)
      // 尾巴忽略,展示为: 0 也不展示大于 小于符号
      const ignoredPrecisionNumber =
        style !== 'percent' && isProfitNumber ? numberFixed(data, 8) : data;

      //向下取整
      try {
        const {value, operator} = genComparisonOperatorAndValue(
          ignoredPrecisionNumber,
          {
            maximumFractionDigits,
            style,
          },
        );
        // 百分数 保留位数处理
        const floorDecimal =
          style !== 'percent'
            ? maximumFractionDigits
            : (maximumFractionDigits || 0) + 2;

        const floorDecimalValue = numberFixed(
          value,
          floorDecimal ? +floorDecimal : undefined,
        );

        const showNumber = numberFormat(
          floorDecimalValue,
          {
            isPositive: !isUnfOrZero(value) && (isProfitNumber || isPositive),
            options,
          },
          placeholder,
        );

        if (isRTL) {
          let rtlShowNumber = transformRTLShowNumber(showNumber);
          return `${beforeText}${
            needUSDTUnit ? `${getBaseCurrency()} ` : ''
          }${rtlShowNumber}${operator}${afterText}`;
        }

        return `${beforeText}${operator}${showNumber}${afterText}${
          needUSDTUnit ? ` ${getBaseCurrency()}` : ''
        }`;
      } catch (error) {
        console.error('formatNumber ~ error:', error);
        return '-';
      }
    },
    [numberFormat, isRTL],
  );

  return formatNumber;
};
