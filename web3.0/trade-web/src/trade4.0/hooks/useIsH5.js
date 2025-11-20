/**
 * Owner: Ray.Lee@kupotech.com
 */

import { useResponsive } from '@kux/mui/hooks';

/**
 * 抽离之前的 useMediaQuery
 */
const useIsH5 = () => {
  const { sm } = useResponsive();
  return !sm;
};

export default useIsH5;
