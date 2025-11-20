/*
 * Owner: chelsey.fan@kupotech.com
 */
// eslint-disable-next-line no-restricted-imports
import { useSelector as originalUseSelector } from 'react-redux';
export { shallowEqual } from 'react-redux';

const isObject = (param) => {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === 'object';
};
export function useSelector(selector, equalityFn) {
  let result = originalUseSelector(selector, equalityFn);
  if (isObject(result) && !equalityFn && _ENV_ === 'dev') {
    console.log(
      '检测到该state为对象,建议使用非解构写法or补充useSelector第二个参数来精确控制state是否需要更新',
    );
  }
  return result;
}
