/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useRef } from 'react';

/**
 * 获取上一轮的state
 */
export default value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
