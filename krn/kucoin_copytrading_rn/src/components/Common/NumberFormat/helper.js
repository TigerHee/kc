import Decimal from 'decimal.js';

import {greaterThan, lessThan} from 'utils/operation';
export const genNumericalSymbol = ({isUnfZero, isPositive, formatNumber}) => {
  let numberStr = formatNumber;
  if (numberStr.indexOf('%')) {
    numberStr = numberStr.split('%')?.[0];
  }

  if (!isUnfZero && !isPositive) return '';
  if (+numberStr > 0) {
    return '+';
  }
  return '';
};

const getSmallestValuesByDecimal = decimalPlaces => {
  let smallestPositive = new Decimal(1).div(10).pow(decimalPlaces);
  // 最大的负值是最小的正值的相反数
  let largestNegative = smallestPositive.neg();

  return {smallestPositive, largestNegative};
};

// // 传入精度2
// let { smallestPositive, largestNegative } = getSmallestValues(2);
// console.log(`最小的正值: +${smallestPositive.toString()}, 最大的负值: ${largestNegative.toString()}`);
export const genComparisonOperatorAndValue = (
  number,
  {maximumFractionDigits, style},
) => {
  if (style === 'percent' || !maximumFractionDigits)
    return {
      operator: '',
      value: number,
    };
  const {smallestPositive, largestNegative} = getSmallestValuesByDecimal(
    maximumFractionDigits,
  );
  // 小于最小正精度数 例如 <0.01 返回operator: < ,value: 0.01,
  if (greaterThan(number)(0) && lessThan(number)(smallestPositive)) {
    return {
      operator: '<',
      value: smallestPositive,
    };
  }

  // 大于最小负精度数 例如 >-0.01 返回operator: >,value: -0.01,
  if (lessThan(number)(0) && greaterThan(number)(largestNegative)) {
    return {
      operator: '>',
      value: largestNegative,
    };
  }

  return {
    operator: '',
    value: number,
  };
};

export const transformRTLShowNumber = showNumber => {
  if (!showNumber || typeof showNumber !== 'string') return showNumber;

  const percentChar = showNumber.includes('%') ? '%' : '';
  // showNumber 正负号可能在前后面
  const unitPart = showNumber.includes('-')
    ? '-'
    : showNumber.includes('+')
    ? '+'
    : '';
  let numPart = showNumber.replace(/[\-\+\%]/g, '');
  // 数字部分强制不反转
  numPart = `\u202D${numPart}\u202C`;

  return `\u202E${unitPart}${numPart}${percentChar}\u202C`;
};
