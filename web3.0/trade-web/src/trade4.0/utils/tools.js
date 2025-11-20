/**
 * Owner: odan.ou@kupotech.com
 */

/**
 * 当传入的值是函数是，则执行, 否者返回对应的值
 * @param {*} val
 * @param  {...any} args
 */
export const execMaybeFn = (valOrFn, ...args) => {
  return typeof valOrFn === 'function' ? valOrFn(...args) : valOrFn;
};

/**
 * 当传入的值是函数是，则执行, 否者返回第一个参数值
 * @param {*} val
 * @param {*} firstArg
 * @param  {...any} args
 */
export const execMaybeFnOrParam = (valOrFn, firstArg, ...args) => {
  return typeof valOrFn === 'function' ? valOrFn(firstArg, ...args) : firstArg;
};

/**
 * 执行一个函数
 * @param {Function} [fn1]
 * @param {Function} [fn2]
 * @param  {...any} args
 */
export const execOneFn = (fn1, fn2, ...args) => {
  if (typeof fn1 === 'function') {
    return fn1(...args);
  }
  if (typeof fn2 === 'function') {
    return fn2(...args);
  }
};
