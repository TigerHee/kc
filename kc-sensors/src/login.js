/**
 * Owner: iron@kupotech.com
 */
import { setUid, setVipLevel } from './user';

export default (uid = '', vipLevel = '0') => {
  setUid(uid);
  setVipLevel(vipLevel);

  if (uid) {
    window.sensors.login(uid);
  }
};
