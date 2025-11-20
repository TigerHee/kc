/**
 * Owner: iron@kupotech.com
 */
import isEqual from 'lodash/isEqual';

import md5 from 'md5';

// 简单的对比 props
export function areEqual(prevProps, nextProps) {
  if (!isEqual(prevProps, nextProps)) {
    return true;
  }
  return false;
}

// md5 加密
export function loopCrypto(str, time) {
  const salt = '_kucoin_';
  const c = md5(`${salt}${str}${salt}`).toString();
  if (time <= 0) {
    return c;
  }
  return loopCrypto(c, time - 1);
}

// 常用正则
export const REGEXP = {
  pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{10,32}$/, // 至少包含大小写字母跟数字，不支持空格
  email: /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, // eslint-disable-line
  tradePwd: /^\d{6}$/,
};
