/**
 * Owner: jesse.shao@kupotech.com
 */

import { isEmpty, toString, isString, isNumber } from 'lodash';
import { separateNumber } from 'helper';

export const recallStageStatus = {
  WAIT_DRAW: 3,
  WAIT_REWARD: 5,
  WAIT_QUEST_COMPLETE: 7,
  WAIT_WITHDRAW: 9,
  SUCCESS: 1,
  FAIL: -1,
};

export const recallStageTimeUnit = {
  MILLISECONDS: 1,
  SECONDS: 1000,
  MINUTES: 60 * 1000,
  HOURS: 60 * 60 * 1000,
  DAYS: 24 * 60 * 60 * 1000,
};

/**
 * 格式化数字
 * 格式化规则 -- 整数部分超过6位就不展示小数；整数部分小于6位的整数位➕小数位总共8位
 *
 * @param {*} number 需要格式化的数字
 * @param {*} needThousandsSeparator 是否需要千分位分隔符
 *
 * 举个例子
 * 1234567.1234 不需要千分位分隔符格式化后返回 1234567；需要千分位分隔符格式化后返回 1，234，567
 * 1234.12345678 不需要千分位分隔符格式化后返回 1234.1234；需要千分位分隔符格式化后返回  1,234.1234
 * 234.1234578 不需要千分位分隔符格式化后返回 234.12345；需要千分位分隔符格式化后返回 234.12345
 * 234.1 不需要千分位分隔符格式化后返回 234.1；需要千分位分隔符格式化后返回 234.1
 */

export const formatNumber = (number, needThousandsSeparator = true) => {
  const numberV = +number;
  if (typeof numberV !== 'number' || number === undefined) {
    return number;
  }
  if (numberV === 0) {
    return '0';
  }
  const numberString = toString(numberV);
  const numberStringArrays = numberString.split('.');
  const integerStr = numberStringArrays[0]; // 整数部分
  let targetStr;
  if (integerStr.length >= 6) {
    // 整数部分超过6位就不展示小数；
    targetStr = integerStr;
  } else {
    const hasDecimal = numberString.indexOf('.') > -1;
    targetStr = hasDecimal ? numberString.slice(0, 9) : numberString.slice(0, 8);
  }
  const result = needThousandsSeparator ? separateNumber(targetStr) : targetStr;
  return result;
};
