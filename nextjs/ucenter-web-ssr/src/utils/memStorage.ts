/**
 * Owner: willen@kupotech.com
 */
/**
 * memStorage
 * runtime: next/browser
 */
/**
 * memStorage 内存中临时存储，结构和接口和 util/storage 保持相同
 * @type {{}}
 */

import { storagePrefix } from './constant';

const genKey = (subKey) => `${storagePrefix}_${subKey}`;

const storage = {};

const memoStorage = {
  getItem: (key) => {
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
  setItem: (key, data) => {
    storage[genKey(key)] = JSON.stringify(data);
  },
};

export default memoStorage;
