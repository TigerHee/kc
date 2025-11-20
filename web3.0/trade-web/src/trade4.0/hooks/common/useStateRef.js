/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-12 11:28:49
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-12 11:29:03
 * @FilePath: /trade-web/src/trade4.0/hooks/common/useStateRef.js
 * @Description: 通过引用获取最新state值
 */
import { useRef } from 'react';

export default (state) => {
  const stateRef = useRef(state);
  stateRef.current = state;
  return stateRef;
};
