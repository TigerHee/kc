/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { storagePrefix } from 'config';

export const genKey = (subKey, prefix) => {
  const _prefix = prefix || storagePrefix;
  return `${_prefix}_${subKey}`;
};

export const sessionStorage = {
  _storage: window.sessionStorage,
  setItem(key, value, prefix) {
    if (!this._storage) {
      return false;
    }

    try {
      const _key = genKey(key, prefix);
      this._storage.setItem(_key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  getItem(key, prefix) {
    if (!this._storage) {
      return null;
    }

    try {
      const _key = genKey(key, prefix);
      return JSON.parse(this._storage.getItem(_key));
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  removeItem(key, prefix) {
    if (!this._storage) {
      return false;
    }

    try {
      const _key = genKey(key, prefix);
      this._storage.removeItem(_key);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};