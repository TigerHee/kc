/**
 * Owner: will.wang@kupotech.com
 */

import { useInitialProps } from "gbiz-next/InitialProvider";
import { useMemo } from "react";


/** 根据UA获取设备屏幕类型 */
export default function usePlatformSize() {
  const initialProps = useInitialProps();

  const platform = initialProps?._platform || 'default'; 

  return useMemo(() => {
    const IS_H5 = platform === 'mobile' || platform === 'app';
    const IS_MOBILE = platform === 'mobile';
    const IS_APP = platform === 'app';
    const IS_SM = IS_H5;
    const IS_PC = platform === 'default';

    return {
      isH5: IS_H5,
      isSm: IS_SM,
      isMobile: IS_MOBILE,
      isApp: IS_APP,
      isPC: IS_PC,
    }
  }, [platform])
}