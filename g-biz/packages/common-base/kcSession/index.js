/**
 * Owner: lucas.l.lu@kupotech.com
 */

import storage from '@utils/sessionStorage';

export const genKey = (subKey, prefix) => {
  const _prefix = prefix || 'kucoinv2';
  return `${_prefix}_${subKey}`;
};

export const sessionStorage = {
  _storage: storage,
  setItem(key, value, prefix) {
    if (!this._storage) {
      return false;
    }

    try {
      const _key = genKey(key, prefix);
      this._storage.setItem(_key, value);
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
      return this._storage.getItem(_key);
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
