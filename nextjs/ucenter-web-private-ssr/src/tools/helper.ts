import Decimal from 'decimal.js';
import { isNil } from 'lodash-es';
import MD5 from 'crypto-js/md5';

export const getRequestOriginInfo = req => {
  const getHeader = (key, fallback = '') => {
    const val = req.headers[key];
    if (!val) return fallback;
    return val.trim();
  };

  const protocol = getHeader('x-forwarded-proto', 'http');
  const host = getHeader('x-forwarded-host') || getHeader('host');
  const userAgent = getHeader('user-agent', '');
  const path = req.url || '';
  return {
    origin: `${protocol}://${host}`,
    proto: protocol,
    host,
    path,
    userAgent,
  };
};

/**
 * 返回截取小数位后的数字
 * @param {*} num 数字
 * @param {*} interceptDigits
 * @returns Number类型的返回值
 * 举例 numSeparateDecimal(3212.12545, 2) => 3212.12
 * 举例 numSeparateDecimal('3212.12545', 8) => 3212.12545
 *
 */
export const numSeparateDecimal = (num: number | string | null | undefined, interceptDigits: number = 2): number => {
  if (isNil(num) || isNaN(Number(num)) || !Number(num)) return 0;

  const stringNum = String(num);
  const stringNumArray = stringNum.split('.');

  if (stringNumArray.length === 1) {
    return parseFloat(stringNum);
  }

  if (stringNumArray[1].length > interceptDigits) {
    const n1 = stringNumArray[1].slice(0, interceptDigits);
    stringNumArray.splice(1, 1, n1);
    return parseFloat(stringNumArray.join('.'));
  }

  return Number(num);
};

/**
 * @decription 高精度加法
 */
export const add = (a, b) => {
  return new Decimal(a).plus(b);
};


/**
 * 递归加密
 * @param str
 * @param time
 * @returns {*}
 */
function loopCrypto(str, time) {
  const salt = '_kucoin_';
  const c = MD5(`${salt}${str}${salt}`).toString();
  if (time <= 0) {
    return c;
  }
  return loopCrypto(c, time - 1);
}

/**
 * @param {*} 加密
 */
export const cryptoPwd = (str) => {
  // const salt = '_kucoin_';
  return loopCrypto(str, 2);
  // return MD5(`${salt}${MD5(`${salt}${str}${salt}`).toString()}${salt}`).toString();
};


/**
 * @description 高精度乘法并取给定位数向下取整
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const multiplyFloor = (a, b, decimal = 8, round = Decimal.ROUND_FLOOR) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  return new Decimal(a).mul(b).toFixed(decimal, round);
};

/** 记录通过广告来注册的用户数量 */
export const gtag_report_conversion = (url?: string & Location) => {
  const callback = () => {
    if (typeof url !== 'undefined') {
      window.location = url;
    }
  };
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-380686645/IogkCP3om4oCELWiw7UB',
        event_callback: callback,
      });
    }
    if (window.ym) {
      window.ym(84577030, 'reachGoal', 'registration');
    }

  }
  return false;
};
