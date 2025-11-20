/**
 * Owner: terry@kupotech.com
 */
import { useResponsive } from '@kux/mui';

export const useStakingUrl = () => {
  const { sm } = useResponsive();
  const isSm = !sm;
  return isSm ? '/earn-h5/kcs?appNeedLang=true&loading=2&isBanner=1' : '/earn/kcs';
}