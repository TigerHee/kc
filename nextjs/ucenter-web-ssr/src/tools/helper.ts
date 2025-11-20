import Decimal from 'decimal.js';
import { isNil } from 'lodash-es';

export const getRequestOriginInfo = (req) => {
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
export const numSeparateDecimal = (
  num: number | string | null | undefined,
  interceptDigits: number = 2
): number => {
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

// 跳转检查是否是安全的链接，防止可执行代码；
export const checkUrlIsSafe = (url) => {
  const _url = decodeURIComponent(decodeURIComponent(url));
  if (!url) {
    return false;
  }
  const _newUrl = new URL(_url);
  // 是否是可执行代码

  if (_newUrl.protocol === 'javascript:') {
    return false;
  }
  return true;
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
