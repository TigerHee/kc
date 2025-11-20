/*
 * @owner: borden@kupotech.com
 */
import i18n from '@tools/i18n';
import { isEqual, isEmpty } from 'lodash';
import { formatNumber } from '@utils/math';
import addLangToPath from '@tools/addLangToPath';
import { isFinite, comparedTo, pow, toFixed } from './format';

/**
 * 通过步长获取精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等）
 * @param num 步长
 * @returns {*}
 */
// export const transStepToPrecision = (num) => {
//   if (num > 1) {
//     return 0;
//   }
//   const decimal = `${num}`.split('.')[1];
//   return decimal ? decimal.length : 0;
// };

export const validateEmpty = (_, values) => {
  if (!values) {
    return Promise.reject(new Error(i18n.t('convert:trans.amount.num.err')));
  }
  return Promise.resolve();
};

export const checkIsMobile = () => {
  const regMobile = /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo)/i;
  const regPad = /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?!\s.+?\smobile))/i;
  if (regMobile.test(navigator.userAgent) || regPad.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

export const numberFormatter = (val, precision) => {
  if (val) {
    const decimalFraction = val.split('.')[1];
    if (decimalFraction && decimalFraction.length > precision) {
      return formatNumber(+val, { dp: precision, commas: false });
    }
  }
  return val;
};

export const isEqualPair = (pair1, pair2) => {
  return isEqual(pair1.sort(), pair2.sort());
};

export const getMax = ({ max, balance }) => {
  if ([balance, max].every(isFinite)) {
    return comparedTo(balance, max) > 0 ? max : balance;
  }
  return [balance, max].find(isFinite);
};

export const getOppositionFieldName = (obj) => {
  return ['fromCurrencySize', 'toCurrencySize'].find(
    (v) => !Object.getOwnPropertyDescriptor(obj, v),
  );
};

export const getInverseSymbol = (symbol) => {
  return symbol
    .split('-')
    .reverse()
    .join('-');
};

export const map2list = (v) => Object.values(v);

export const list2map = (list, key, formatItem = (v) => v) =>
  list.reduce((a, b, i) => {
    a[typeof key === 'function' ? key(b) : b[key]] = formatItem(b, i);
    return a;
  }, {});

export const getInnerUrl = (router) =>
  addLangToPath(`${window._WEB_RELATION_?.KUCOIN_HOST || ''}${router}`, i18n.language);

export const calcPrice = (originPrice, isInverse) => {
  originPrice = isInverse ? pow(originPrice)(-1) : originPrice;
  let pricePrecision = 4;
  if (comparedTo(0.000000001, originPrice) >= 0) {
    pricePrecision = 16;
  } else if (comparedTo(0.00001, originPrice) >= 0) {
    pricePrecision = 12;
  } else if (comparedTo(0.1, originPrice) >= 0) {
    pricePrecision = 8;
  }
  return toFixed(toFixed(originPrice)(pricePrecision))(null);
};

export const sentryCaptureEvent = (params) => {
  const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
  try {
    if (window[sentryNamespace]) {
      window[sentryNamespace]?.captureEvent({
        level: 'fatal',
        ...params,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
/**
 * 获取币种配置
 * @param {*} currency 币种
 * @param {*} invertCurrency 组成交易对的对手币种
 * @param {*} data 后端返回的配置数据
 */
export const getCurrencyConfig = (currency, invertCurrency, data) => {
  if (currency === 'USDT') {
    return data?.usdtCurrencyLimitMap?.[invertCurrency] || {};
  }
  return data?.normalCurrencyLimitMap?.[currency] || {};
};
/**
 * 获取交易对配置，主要用来转换新旧配置接口的数据结构
 * @param {*} base base币种
 * @param {*} quote quote币种
 * @param {*} data 后端返回的配置数据
 */
export const getSymbolConfig = (base, quote, data) => {
  const baseConfig = getCurrencyConfig(base, quote, data);
  const quoteConfig = getCurrencyConfig(quote, base, data);
  return {
    minBaseSize: baseConfig.minSize,
    maxBaseSize: baseConfig.maxSize,
    minQuoteSize: quoteConfig.minSize,
    maxQuoteSize: quoteConfig.maxSize,
    stepSize: baseConfig.step,
    tickSize: quoteConfig.step,
  };
};

// 判断交易对是否被禁用
export const checkSymbolIsDisabled = ({
  orderType,
  symbol,
  toCurrency,
  fromCurrency,
  convertSymbolsMap,
}) => {
  try {
    const pair = symbol?.split('-') || [fromCurrency, toCurrency];
    return (
      !isEmpty(convertSymbolsMap?.[orderType]) &&
      pair.some((v, i) => {
        const ret = getCurrencyConfig(v, pair[1 - i], convertSymbolsMap[orderType]);
        return isEmpty(ret);
      })
    );
  } catch (e) {
    return false;
  }
};
