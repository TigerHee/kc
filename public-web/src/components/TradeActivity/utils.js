/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import Decimal from 'decimal.js';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath } from 'tools/i18n';
import { push } from 'utils/router';

const { KUCOIN_HOST } = siteCfg;

function isIllegalityNumber(num) {
  try {
    new Decimal(num);
    return true;
  } catch {
    return false;
  }
}

export const transformTimeStr = (value) => {
  if (value < 0 || isNaN(+value)) return '00';
  if (value > 9) return value;
  return `0${+value}`;
};

/**
 * 数据精度格式化: > 10000 只展示整数位, 1<总数量≤10000 展示2位小数, 总数量≤1 展示8位小数; 均截断处理, 末尾为0不展示
 * @param {*} value 数字
 * @param {*} precision 精度 默认8位
 * @returns
 */
export const transformNumberPrecision = (value, precision = 8) => {
  if (!value) {
    return value;
  }

  let _precision = precision;
  if (value > 10000) {
    _precision = 0;
  } else if (value > 1) {
    _precision = 2;
  }

  return new Decimal(new Decimal(value).toFixed(_precision, Decimal.ROUND_DOWN)).toFixed();
};

// web跳转到登录方法，app调用原生
export const skip2Login = () => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/login',
      },
    });
  } else {
    push('/ucenter/signin?backUrl=' + encodeURIComponent(window.location.href));
  }
};

// app内跳转，仅针对app拦截
export const locateToUrlInApp = (url) => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    const tragetUrl =
      url?.indexOf('https') > -1 ? addLangToPath(url) : KUCOIN_HOST + addLangToPath(url);
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodeURIComponent(tragetUrl)}`,
      },
    });
  }
};

// 普通跳转，区分app内和web
export const locateToUrl = (url) => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    const tragetUrl =
      url?.indexOf('https') > -1 ? addLangToPath(url) : KUCOIN_HOST + addLangToPath(url);
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodeURIComponent(tragetUrl)}`,
      },
    });
  } else {
    push(url);
  }
};

// 跳转到交易页面
export const locateToTrade = (symbol) => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    // app内跳转
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/trade${symbol ? `?symbol=${symbol}` : ''}&goBackUrl=${encodeURIComponent(
          window.location.href,
        )}`,
      },
    });
  } else {
    push(symbol ? `/trade/${symbol}` : '/trade');
  }
};

/**
 * a是否大于b
 */
export function greeterThan(a, b) {
  if (!isIllegalityNumber(a) || !isIllegalityNumber(b)) return false;
  const _a = new Decimal(a);
  const _b = new Decimal(b);
  return _a.gt(_b);
}

/**
 * a是否小于b
 */
export function lessThan(a, b) {
  if (!isIllegalityNumber(a) || !isIllegalityNumber(b)) return false;
  const _a = new Decimal(a);
  const _b = new Decimal(b);
  return _a.lt(_b);
}
