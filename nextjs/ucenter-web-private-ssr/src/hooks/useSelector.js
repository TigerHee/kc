/*
 * Owner: chelsey.fan@kupotech.com
 */

import { IS_CLIENT_ENV } from 'kc-next/env';
import { useSelector as originalUseSelector } from 'react-redux';
export { shallowEqual } from 'react-redux';

const isObject = (param) => {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === 'object';
};
export function useSelector(selector, equalityFn) {
  let result = originalUseSelector(selector, equalityFn);
  const isDev = process.env.NODE_ENV === 'development' || (IS_CLIENT_ENV ? (window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1')) : false);
  if (isObject(result) && !equalityFn && isDev) {
    console.log(
      '检测到该state为对象,建议使用非解构写法or补充useSelector第二个参数来精确控制state是否需要更新',
    );
  }
  return result;
}
