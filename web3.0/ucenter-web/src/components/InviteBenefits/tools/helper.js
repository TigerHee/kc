/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/tools/helper.js
 */
import Decimal from 'decimal.js';
import numberFixed from './numberFixed';

const MIN_CONVERT_NUM = 10000;
/**
 * 将num转成 1K 10K 1M的字符串， 10000以下不显示
 * @param {*} num
 * @param {*} digits
 * @returns
 */
export function nFormatter(num, digits = 2, { minCoverNum = MIN_CONVERT_NUM } = {}) {
  num = +num; // 将可能的字符串转为number
  if (Math.abs(num) < minCoverNum) return `${numberFixed(num, digits)}`;
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (Math.abs(num) >= si[i].value) {
      break;
    }
  }
  const fixedNum = `${numberFixed(num / si[i].value, digits)}`;
  const fixedNumWithSymbol = fixedNum.replace(rx, '$1') + si[i].symbol;
  return fixedNumWithSymbol;
}

/**
 * 获取当前设备是否为安卓终端设备
 * @returns bool
 */
export const getIsAndroid = () => {
  const u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    return true;
  } else {
    return false;
  }
};
/**
 * 增加千分位分隔符
 * @param n
 * @returns {string}
 */
export const SeparateNumberPool = {
  pool: Object.create(null),
  poolCount: 0,
  has(k) {
    return !!this.pool[k];
  },
  get(k) {
    return this.pool[k];
  },
  set(k, v) {
    if (this.poolCount > 100000) {
      // 清理缓存
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};

export const separateNumber = (n) => {
  if (typeof +n !== 'number') {
    return n;
  }
  const num = `${n}`;

  if (SeparateNumberPool.has(num)) {
    return SeparateNumberPool.get(num);
  }
  if (!/^[0-9.]+$/.test(num)) {
    return n;
  }

  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    [integer, floater] = arr;
  }
  const len = integer.length;
  let parser = '';
  if (len > 3) {
    let count = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      parser = integer[i] + parser;
      count += 1;
      if (count % 3 === 0 && i > 0) {
        parser = `,${parser}`;
      }
    }
  } else {
    parser = integer;
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  const r = `${parser}${floater}`;
  SeparateNumberPool.set(num, r);

  return r;
};

/**
 * 高精度除法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divide = (a, b, decimal = 8, round = Decimal.ROUND_HALF_UP) => {
  if (!a || !b) {
    return 0;
  }
  if (+b === 0) {
    // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
    return 0;
  }
  return new Decimal(a).div(b).toFixed(decimal, round);
};

/**
 * @decription 高精度加法
 */
export const add = (a, b) => {
  return new Decimal(a).plus(b);
};
