/**
 * Owner: sean.shi@kupotech.com
 */
/**
 * runtime: browser
 */
import SyncStorage from '@kucoin-biz/syncStorage';

const storage = new SyncStorage({
  storageType: 'sessionStorage',
});

export default storage;
