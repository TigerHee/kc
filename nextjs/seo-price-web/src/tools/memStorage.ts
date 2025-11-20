/**
 * Owner: victor.ren@kupotech.com
 */

import { storagePrefix } from '@/config/base';

const genKey = (subKey: string) => `${storagePrefix}_${subKey}`;

const storage = {};

const localStorage = {
  getItem: (key: string) => {
    const data = storage[genKey(key)];

    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
    }
    return null;
  },
  setItem: (key: string, data: any) => {
    storage[genKey(key)] = JSON.stringify(data);
  },
};

export default localStorage;
