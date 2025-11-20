/*
 * @Date: 2024-05-29 15:08:51
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import { useResponsive } from '@kux/mui/hooks';

/**
 * 抽离之前的 useMediaQuery
 */
export const useIsH5 = () => {
  const { sm } = useResponsive();
  return !sm;
};

export const useDeviceHelper = () => {
  const { sm, lg } = useResponsive();
  return {
    /** 是否为h5 */
    isH5: !sm,
    /** 是否为pad设备 */
    isPad: sm && !lg,
    /** (大屏web) */
    isPC: lg,
    // ...业务拓展
  };
};
