/**
 * Owner: iron@kupotech.com
 */
import { useMediaQuery } from '@kufox/mui';
import loadable from '@loadable/component';

const DynamicDepositBanner = loadable(() => import('./DepositBanner'));

export default (props) => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return isH5 ? <DynamicDepositBanner {...props} /> : null;
};
