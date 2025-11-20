/*
 * @owner: borden@kupotech.com
 */
import Big from 'bignumber.js';
import i18n from '@tools/i18n';
import { toNumber } from 'lodash';
import { numberFormat, dateTimeFormat } from '@kux/mui/utils';
import { formatNumber as commonFormatNumber } from '@utils/math';

export const isFinite = (v) => Number.isFinite(+v);

// 高精度指定位数
export const numberFixed = (v, decimal, round = Big.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Big(stringV).toFixed(decimal, round);
};

// 数字本地化getter
export function intlFormatNumber({ lang, ...other }) {
  const currentLang = i18n.language;
  return numberFormat({ lang: lang || currentLang, ...other });
}

// 日期本地化getter
export function intlFormatDate({ lang, ...other }) {
  const currentLang = i18n.language;
  return dateTimeFormat({ lang: lang || currentLang, ...other });
}

export const intlFormatNumberTransfer = ({
  value,
  options,
  precision = 0,
  dropZ = false,
  ...others
}) => {
  const _options = { ...options };
  if (precision || precision === 0) {
    _options.maximumFractionDigits = precision;
  }
  // 不去0处理
  if (!dropZ) {
    if (precision) {
      _options.minimumFractionDigits = precision;
    } else {
      const arr = `${value}`?.split('.');
      if (arr && arr[1]) {
        _options.minimumFractionDigits = arr[1].length;
      }
    }
  }
  return intlFormatNumber({ number: value, options: _options, ...others });
};

export function formatNumber(n, params) {
  const dropZ = params?.keepZero !== true;
  const ret = commonFormatNumber(n, { ...params, commas: false });
  if ((params?.commas === undefined || params?.commas) && isFinite(ret)) {
    return intlFormatNumberTransfer({ value: ret, precision: params?.dp, dropZ });
  }
  return ret;
}

export function transformParam(a) {
  // 输入值为undefined或者null处理为0
  if (a == null || a === '') {
    a = new Big(0);
  }
  if (!Big.isBigNumber(a)) {
    const isNaNB = Number.isNaN(toNumber(a));
    a = new Big(isNaNB ? NaN : a);
  }
  return a;
}
// 比较函数
export function comparedTo(x, y) {
  try {
    x = Big.isBigNumber(x) ? x : new Big(x);
    y = Big.isBigNumber(y) ? y : new Big(y);
    return x.comparedTo(y);
  } catch (e) {
    return undefined;
  }
}

export const toFixed = (a) => {
  a = transformParam(a);
  return (b, mod = 'ROUND_HALF_UP') => {
    if (b == null) {
      return a.toFixed();
    }
    return a.toFixed(b, Big[mod]);
  };
};

export const plus = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.plus(b);
  };
};

export const minus = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.minus(b);
  };
};

export const multiply = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.multipliedBy(b);
  };
};

export const dividedBy = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    if (comparedTo(b, 0) === 0) {
      // 如果分母为0按0返回
      return new Big(0);
    }
    return a.dividedBy(b);
  };
};

export const pow = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.pow(b);
  };
};

export const mod = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.mod(b);
  };
};

export const isDivisible = (a, b) => {
  return mod(a)(b).isZero();
};

// 根据步长格式化数据, 默认向下取整
export const formatNumberByStep = (num, step = 1, round = 'DOWN') => {
  const remainder = mod(num)(step);
  if (remainder.isZero()) return toFixed(num)(null);
  if (round === 'DOWN') {
    return minus(num)(remainder).toFixed();
  }
  return minus(plus(num)(step))(remainder).toFixed();
};
