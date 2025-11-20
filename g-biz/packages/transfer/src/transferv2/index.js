/**
 * Owner: solar@kupotech.com
 */
import loadable from '@loadable/component';

const Transfer = loadable(() => import('./transfer'));

export default (props) => {
  return <Transfer {...props} />;
};
