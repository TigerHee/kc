/*
 * @owner: borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useSelector } from 'src/hooks/useSelector';
import siteConfig from 'utils/siteConfig';

const isInApp = JsBridge.isApp();
const { KUCOIN_HOST_COM, KUCOIN_HOST } = siteConfig;

export default function useMainHost() {
  const appInfo = useSelector((state) => state.app.appInfo);
  const appMainHost = appInfo?.webHost ? `https://${appInfo.webHost}` : KUCOIN_HOST_COM;
  return isInApp ? appMainHost : KUCOIN_HOST;
}
