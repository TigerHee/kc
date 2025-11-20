/**
 * Owner: odan.ou@kupotech.com
 */
import Decimal from 'decimal.js/decimal';
import { isEmpty, isEqual } from 'lodash';

/**
 * 转化为boolean值
 * @param {*} val
 * @param {boolean} [defaultVal] 默认true
 */
export const toBoolean = (val, defaultVal = true) => {
  return typeof val === 'boolean' ? val : defaultVal;
};

/**
 * 判断是否为空值
 * @param {unknown} val
 */
export const valIsEmpty = val => val == null || String(val).trim() === '';

/*
 * 获取浏览器上的symbolcode
 */
export const getUrlSymbolCode = () => {
  const urlSymbolCode = String(window?.location?.pathname).split('/').pop();
  return urlSymbolCode.includes('-') ? urlSymbolCode : undefined;
};

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
 export const numberFixed = (v, decimal, round = Decimal.ROUND_DOWN) => {
    const numberV = +v;
    if (typeof numberV !== 'number' || v === undefined || isNaN(v)) {
      return v;
    }
    // if (numberV === 0) {
    //     return '0';
    // }
    const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
    return new Decimal(stringV).toFixed(decimal, round);
  };


  /**
   * 对比两个对象（或某写属性值）是是否相等（在React.Memo或useSelector中，用做于两个对象的深比较）
   * 注意：
   * 1. 适用于props深度不大的场景，避免对嵌套过深的props进行深比较，深比较可能会速度变慢
   * 2. props不支持函数比较，如果props有函数，请在父级使用useCallback缓存函数
   * @param {object} prevProps 上一个对象
   * @param {object} nextProps 下一个对象
   * @param {array} params 用来对比的一级key，无此参数或者空数组，则默认对比全部 ['key1', 'key2', ...]
   * @return {boolean} 是否相等
   */
  export const deepEqual = (prevProps, nextProps, params = []) => {
    // 不传params，则直接对比当前和上一个的数据所有key对应的参数
    if (isEmpty(params)) {
      // isEqual 对象值比较自身的属性，不包括继承的和可枚举的属性。 不支持函数和DOM节点比较。
      return isEqual(prevProps, nextProps);
    }
    // 只比较指定的key
    return params.every((e) => {
      return isEqual(prevProps[e], nextProps[e]);
    });
  };
