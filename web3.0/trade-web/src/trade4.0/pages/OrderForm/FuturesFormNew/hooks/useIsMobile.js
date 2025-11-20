/**
 * Owner: garuda@kupotech.com
 * copy 一份 hooks, 不直接使用
 */
import { useMemo } from 'react';

export default function useIsMobile() {
  return useMemo(() => {
    const userAgent = navigator.userAgent || window.opera;

    return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }, []);
}
