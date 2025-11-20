/**
 * Owner: tiger@kupotech.com
 */
import { delay } from 'lodash';
// 验证不能输入除 空格，"-", "." 之外的其他符号和数字
export const checkRegExp = /[\u0021-\u002C]|[\u002F-\u0040]|[\u005B-\u0060]|[\u007B-\u00BF]|[\u2000-\u27FF]|[\u2900-\u2BFF]|[\u2E00-\u2E7F]|[\u3001-\u303F]|[\u3200-\u33FF]|[\u4DC0-\u4DFF]|[\uFE00-\uFF20]|[\uFF3B-\uFF40]|[\uFF5B-\uFF65]|[\uFFE0-\uFFFF]/;

// 这里直接利用delay来做防抖，每次触发验证时，之前的验证器会被直接舍弃
export const checkValues = (value, err, cb) => {
  return new Promise((resolve, reject) => {
    delay(() => {
      if (!checkRegExp.test(value)) {
        resolve();
      } else {
        typeof cb === 'function' && cb();
        reject(err);
      }
    }, 300);
  });
};
// 判断是否是IOS
export const isIOS = () => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

// 特殊字符
export const specialCharacterArr = [
  ' ',
  '-',
  '——',
  '/',
  '\\',
  '！',
  '¥',
  '…',
  '……',
  '（',
  '）',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '_',
  '~',
  '～',
  '`',
  '·',
  '《',
  '》',
  '<',
  '>',
  '?',
  '：',
  '“',
  ':',
  '"',
  '「',
  '」',
  '｜',
  '{',
  '}',
  '|',
  '[',
  ']',
  '【',
  '】',
  '、',
  ';',
  '？',
];
