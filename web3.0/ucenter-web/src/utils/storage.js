/**
 * Owner: willen@kupotech.com
 */
/**
 * runtime: browser
 */
import SyncStorage, { namespace } from '@kucoin-biz/syncStorage';

const storageInstance = new SyncStorage({
  namespace,
});

export default storageInstance;
