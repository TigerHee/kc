/**
 * Owner: iron@kupotech.com
 */
/**
 * runtime: browser
 */
import SyncStorage from '@packages/syncStorage';

const storage = new SyncStorage();

export default {
  getItem: storage.getItem,
  setItem: storage.setItem,
  removeItem: storage.removeItem,
  setItemWithExpire(key, data, ttl = 0 /* 单位：ms */, params = {}) {
    const now = new Date();
    const item = {
      value: data,
      expire: now.getTime() + ttl,
    };
    this.setItem(key, item, params);
  },
  getItemWithExpire(key, params = {}) {
    const item = this.getItem(key, params);
    if (!item) return null;
    const now = new Date();
    if (now.getTime() > (item.expire || 0)) {
      this.removeItem(key, params);
      return null;
    }
    return item.value;
  },
};
