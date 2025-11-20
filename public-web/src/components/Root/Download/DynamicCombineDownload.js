/**
 * Owner: iron@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useMediaQuery } from '@kufox/mui';
import loadable from '@loadable/component';

const DynamicCombineDownload = loadable(() => import('./CombineDownload'));

export default (props) => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const inApp = JsBridge.isApp();

  return isH5 && !inApp && <DynamicCombineDownload {...props} />;
};
