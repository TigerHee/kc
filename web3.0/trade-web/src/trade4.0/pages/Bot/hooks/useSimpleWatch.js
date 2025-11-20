/**
 * Owner: mike@kupotech.com
 */
import { useEffect, useRef } from 'react';
import useStateRef from '@/hooks/common/useStateRef';
import debounce from 'lodash/debounce';

/**
 * @description: 依赖变化, 发起请求,
 * 保证fetchHandler执行能获取到最新作用域里的数据
 * 会抑制第一次变化
 * @return {*}
 */
export default (keys, fetchHandler) => {
  const initRef = useRef(false);
  const handlerRef = useStateRef(fetchHandler);
  const debounceHandlerRef = useRef(
    debounce(() => {
      handlerRef.current();
    }, 600),
  );
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      return;
    }

    debounceHandlerRef.current();
  }, keys);
};
