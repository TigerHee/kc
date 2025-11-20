/**
 * Owner: garuda@kupotech.com
 * 合约的 format 大多都是 4舍五入，单独引一份入口
 */
import Decimal from 'decimal.js';
import { isFinite } from 'lodash';

import { dropZero, intlFormatNumberTransfer, thousandPointed } from '@/utils/format';
import { dividedBy, greaterThanOrEqualTo, toDP, toFixed } from 'src/utils/operation';

export const formatNumber = (
  value,
  { fixed = 2, round = Decimal.ROUND_HALF_UP, negate = false, pointed = true, dropZ = false } = {},
) => {
  if (!value) {
    return 0;
  }
  let exactValue = +value;

  if (isFinite(exactValue)) {
    exactValue = new Decimal(exactValue).toFixed(fixed, round);

    if (dropZ) {
      exactValue = dropZero(exactValue);
    }
    if (pointed) {
      exactValue = intlFormatNumberTransfer({ precision: fixed, value: exactValue, dropZ });
    }
    return negate ? `-${exactValue}` : exactValue;
  } else {
    return value;
  }
};

const B = 1000 * 1000 * 1000;
const M = 1000 * 1000;
const K = 1000;
export const makeNumber = ({
  value,
  fixed = 2,
  showSmall = true,
  pointed = true,
  isDP = false, // isDP 开启的差别在于 fixed为2位小数时 1 跟 1.00
  isBigNumber = false,
  round = Decimal.ROUND_HALF_UP, // 默认取四舍五入
}) => {
  if (isNaN(value)) return '0';
  if (+value === 0 || isNaN(+value)) return '0';
  let resultUnit = '';
  const numberValue = Number(value);
  let exactNum = isDP ? toDP(value)(fixed, round) : toFixed(value)(fixed, round);

  // 截取精度后绝对值等于0但自己不为0
  if (Decimal(exactNum).abs().eq(0) && !Decimal(numberValue).eq(0) && showSmall) {
    const smallNum = `${Decimal(value).isNegative() ? '-' : ''} < 0.${Array(fixed - 1)
      .fill(0)
      .join('')}1`;
    return smallNum;
  }

  // 是否需要转换成大数格式
  if (isBigNumber) {
    let calcRet = value;
    // 是否大于10亿
    if (greaterThanOrEqualTo(value)(B)) {
      calcRet = dividedBy(value)(B).toString();
      resultUnit = 'B';
    } else if (greaterThanOrEqualTo(value)(M)) {
      calcRet = dividedBy(value)(M).toString();
      resultUnit = 'M';
    } else if (greaterThanOrEqualTo(value)(K)) {
      calcRet = dividedBy(value)(K).toString();
      resultUnit = 'K';
    } else {
      resultUnit = '';
    }
    exactNum = calcRet;
  }

  if (pointed) {
    exactNum = thousandPointed(exactNum);
  }

  if (resultUnit) {
    return `${exactNum}${resultUnit}`;
  }

  return exactNum;
};
