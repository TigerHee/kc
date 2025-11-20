/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback } from 'react';
import Decimal from 'decimal.js';

import { toFixed } from 'utils/operation';
import { thousandPointed } from '@/utils/format';
import { formatCurrency } from '@/utils/futures';

import BigNumberTransform from './BigNumberTransform';

import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';

const PrettyCurrency = (props) => {
  const {
    value,
    isShort,
    unitClassName,
    currency = '-',
    placeholder = '-',
    showUnitLabel = true,
    isBigNumber = false, // 需要转换万(K)单位的数字
    round = Decimal.ROUND_DOWN,
    mark = '', // eg ≈
    className = '',
  } = props;

  const { prettyCurrency } = usePrettyCurrency();

  const {
    markStr,
    unitStr,
    formatStr: exactNum,
  } = prettyCurrency({ value, mark, currency, isBigNumber, isShort, placeholder, round });

  const markComp = markStr ? <span className="mr-2">{markStr}</span> : <></>;
  if (showUnitLabel) {
    return (
      <div className={`pretty-currency ${className}`}>
        {markComp}
        {exactNum}
        <span className={`ml-2 ${unitClassName}`}>{` ${unitStr}`}</span>
      </div>
    );
  } else {
    return (
      <div className={`pretty-currency ${className}`}>
        {markComp}
        {exactNum}
      </div>
    );
  }
};

export const usePrettyCurrency = () => {
  const prettyCurrency = useCallback(
    ({
      value,
      currency,
      isBigNumber = false,
      isShort,
      mark,
      placeholder = '-',
      round = Decimal.ROUND_DOWN,
    }) => {
      let exactNum = '';
      const unitStr = formatCurrency(currency);

      const { precision: normalP, shortPrecision: shortP } = getCurrenciesPrecision(currency);

      const precision = isShort ? shortP : normalP;
      const unitFixed = +precision;
      let markStr = mark;
      // 兼容 NaN 显示为 '--'
      const numberValue = Number(value);
      if (Number.isNaN(numberValue) || !precision) {
        exactNum = placeholder;
      } else {
        exactNum = toFixed(value)(unitFixed, round);

        const isNegative = Decimal(value).isNegative();
        // 截取精度后绝对值等于0但自己不为0
        if (Decimal(exactNum).abs().eq(0) && !Decimal(numberValue).eq(0)) {
          const smallNum = `${isNegative ? '>' : '<'} ${isNegative ? '-' : ''} 0.${Array(
            precision - 1,
          )
            .fill(0)
            .join('')}1`;
          exactNum = smallNum;
          markStr = '';
        } else if (isBigNumber) {
          exactNum = <BigNumberTransform value={exactNum} />;
        } else {
          exactNum = thousandPointed(exactNum);
        }
      }
      return { markStr, unitStr, formatStr: exactNum, value };
    },
    [],
  );
  return { prettyCurrency };
};

export default React.memo(PrettyCurrency);
