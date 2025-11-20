/**
 * Owner: solar.xia@kupotech.com
 */

import * as tma from '@kc/telegram-biz-sdk';
import JsBridge from '@knb/native-bridge';
import history from '@kucoin-base/history';
import Decimal from 'decimal.js';
import qs from 'query-string';
import { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath } from 'src/tools/i18n';
import { push } from 'src/utils/router';
import siteCfg from 'src/utils/siteConfig';

const { KUCOIN_HOST } = siteCfg;

/**
 * 保留n位小数
 * @param {*} decimal
 * @param {*} digits
 * @returns
 */
export const truncateDecimals = (decimal, digits = 12) => {
  let numStr = decimal.toString();
  let decimalPointIndex = numStr.indexOf('.');
  if (decimalPointIndex != -1) {
    numStr = numStr.slice(0, decimalPointIndex + digits + 1);
  }
  return numStr;
};

/**
 * 高精度乘法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const multiply = (...args) => {
  try {
    const res = args.reduce((acc, val) => {
      const _acc = new Decimal(acc);
      const _val = new Decimal(val);
      if (parseFloat(val) === 0) {
        // val === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
        return 0;
      }
      return _acc.mul(_val).toFixed(12);
    }, 1);
    // 截取12位小数，后面0去掉
    // return trimTrailingZeros(truncateDecimals(res));
    return new Decimal(res).toFixed();
  } catch {
    return '--';
  }
};

export const getMin = (a, b) => {
  if (a === '--' || b === '--') return '--';
  return lessThan(a, b) ? a : b;
};

/**
 * 高精度加法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const add = (a, b) => {
  try {
    const _a = new Decimal(a);
    const _b = new Decimal(b);
    // 最多取小数点12位、四舍五入
    return new Decimal(_a.plus(_b).toFixed(12)).toFixed();
  } catch {
    return '--';
  }
};

export const minus = (a, b) => {
  try {
    const _a = new Decimal(a);
    const _b = new Decimal(b);
    // 最多取小数点12位、四舍五入
    return new Decimal(_a.minus(_b).toFixed(12)).toFixed();
  } catch {
    return '--';
  }
};

// 获取小数点位数
export function getDecimalPlace(val) {
  if (val === null || val === undefined) return 0;
  try {
    const decimal = new Decimal(val);
    return decimal.decimalPlaces();
  } catch {
    return 0;
  }
}

export function deleteCoinQuery(url = '') {
  if (!url) {
    return url;
  }
  let href = url;
  const query = qs.parse(window.location.search, { decode: false });
  if (query.coin) {
    delete query.coin;
    const search = qs.stringify(query);
    if (search) {
      href = `${url}?${search}`;
    } else {
      // 去掉coin的search
      href = url;
    }
  }
  if (href.endsWith('/')) {
    href = href.substring(0, href.length - 1);
  }
  return href;
}

// 收口跳转到登录方法，app调用原生
/**
 * 跳转登录位置check
 * 1. myOrder appHeader coinTab旁
 * 2. postOrder 在redux 中
 * 3. only my order 在redux 中
 * 4. takeOrder 在redux 中
 */
export const skip2Login = () => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/login',
      },
    });
  } else if (tma.bridge.isTMA()) {
    tma.actions.accountLanding();
  } else {
    history.push('/ucenter/signin?backUrl=' + encodeURIComponent(window.location.href));
  }
};

export const skip2Rules = () => {
  const isInApp = JsBridge.isApp();
  const url = KUCOIN_HOST + addLangToPath('/announcement/Pre-Market-Trading-User-Guidelines');
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodeURIComponent(url)}`,
      },
    });
  } else {
    window.open(url);
  }
};

export const skip2Faq = () => {
  const isInApp = JsBridge.isApp();
  const url = KUCOIN_HOST + addLangToPath('/announcement/Pre-Market-Trading-FAQ');
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodeURIComponent(url)}`,
      },
    });
  } else {
    window.open(url);
  }
};

export const useSkip2Myorder = () => {
  const user = useSelector((state) => state.user.user, shallowEqual);
  const skip2Myorder = useCallback(() => {
    if (!user) {
      skip2Login();
      return;
    }
    push('/pre-market/myOrder');
  }, [user]);
  return skip2Myorder;
};

function isIllegalityNumber(num) {
  try {
    new Decimal(num);
    return true;
  } catch {
    return false;
  }
}

/**
 * a是否小于b
 */
export function lessThan(a, b) {
  if (!isIllegalityNumber(a) || !isIllegalityNumber(b)) return false;
  const _a = new Decimal(a);
  const _b = new Decimal(b);
  return _a.lt(b);
}

/**
 * a是否大于b
 */
export function greeterThan(a, b) {
  if (!isIllegalityNumber(a) || !isIllegalityNumber(b)) return false;
  const _a = new Decimal(a);
  const _b = new Decimal(b);
  return _a.gt(b);
}
