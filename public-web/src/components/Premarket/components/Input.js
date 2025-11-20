/**
 * Owner: solar.xia@kupotech.com
 */
import { Input } from '@kux/mui';
import { useResponsiveSize } from '../hooks';
export default (props) => {
  const size = useResponsiveSize();

  const isSm = size === 'sm';
  return <Input size={isSm ? 'large' : 'xlarge'} {...props} />;
};
