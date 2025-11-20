/**
 * Owner: iron@kupotech.com
 */
/**
 * runtime: browser
 */
import SyncStorage from '../syncStorage';

const storage = new SyncStorage({
  storageType: 'sessionStorage',
});

export default storage;
