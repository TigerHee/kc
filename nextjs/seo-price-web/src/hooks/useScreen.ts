/**
 * Owner: will.wang@kupotech.com
 */
import { useResponsive } from '@kux/mui-next';

/**
 * xs: < 768
 * sm: >= 768, < 1200
 * lg: >= 1200
 */
export default () => {
  const { xs, sm, lg } = useResponsive();
  return {
    isH5: xs && !sm,
    isSm: xs && !sm,
    isMd: sm && !lg,
    isLg: lg,
  };
};
