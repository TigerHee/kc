/**
 * Owner: will.wang@kupotech.com
 */
import { storagePrefix } from "@/config/base";
import { IS_CLIENT } from "@/config/env";

export const genKey = (subKey, prefix) => {
  const _prefix = prefix || storagePrefix;
  return `${_prefix}_${subKey}`;
};

export const session = {
  _storage:  IS_CLIENT ? window.sessionStorage : null,
  setItem(key: string, value: any, prefix?: string) {
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
  getItem(key: string, prefix?: string) {
    if (!this._storage) {
      return null;
    }

    try {
      const _key = genKey(key, prefix);
      return JSON.parse(this._storage.getItem(_key) || 'null');
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  removeItem(key: string, prefix?: string) {
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
