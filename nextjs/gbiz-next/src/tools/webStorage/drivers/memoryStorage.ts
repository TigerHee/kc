/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-multi-assign */
/**
 * Owner: garuda@kupotech.com
 */
import { DriverFuncType } from '../types';
import executeCallback from '../utils/executeCallback';
import getCallback from '../utils/getCallback';
import hasOwnProperty from '../utils/hasOwnProperty';
import serializer from '../utils/serializer';

const storageRepository: any = {};

// Config the localStorage backend, using options set in the config.
function _initStorage(this: DriverFuncType, options: { [x: string]: any; }) {
  const self = this;
  const dbInfo: any = {};
  if (options) {
    Object.keys(options).forEach((k) => {
      dbInfo[k] = options[k];
    });
  }
  const database = (storageRepository[dbInfo.name] = storageRepository[dbInfo.name] || {});
  const table = (database[dbInfo.storeName] = database[dbInfo.storeName] || {});
  dbInfo.db = table;
  dbInfo.serializer = serializer;

  self._dbInfo = dbInfo;

  return Promise.resolve();
}

function iterate(this: DriverFuncType, iterator: any, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const { db } = self._dbInfo;
    let iterationNumber = 1;
    Object.keys(db).forEach((cKey) => {
      let value = db[cKey];
      if (value) {
        value = self._dbInfo.serializer.deserialize(value);
      }
      value = iterator(value, cKey, (iterationNumber += 1));
      // eslint-disable-next-line no-void
      if (value !== void 0) {
        return value;
      }
    });
  });
  executeCallback(promise, callback);
  return promise;
}

function key(this: DriverFuncType, n: number, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const { db } = self._dbInfo;
    let result: any = null;
    Object.keys(db).forEach((cKey, idx) => {
      if (n === idx) {
        result = cKey;
        return result;
      }
    });
    return result;
  });
  executeCallback(promise, callback);
  return promise;
}

function keys(this: DriverFuncType, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const { db } = self._dbInfo;
    let cKeys: any = [];
    cKeys = Object.keys(db).map((cKey) => cKey);
    return cKeys;
  });
  executeCallback(promise, callback);
  return promise;
}

function keyLength(this: DriverFuncType, callback: any) {
  const self = this;
  const promise = self.keys().then((cKeys) => {
    return cKeys.length;
  });
  executeCallback(promise, callback);
  return promise;
}

function length(this: DriverFuncType, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const { db } = self._dbInfo;
    const totalSize = JSON.stringify(db)?.length || 0;
    return totalSize;
  });
  executeCallback(promise, callback);
  return promise;
}

function getItem(this: DriverFuncType, getKey: string, callback: any) {
  const self = this;
  // Cast the getKey to a string, as that's all we can set as a getKey.
  if (typeof getKey !== 'string') {
    console.warn(`${getKey} used as a getKey, but it is not a string.`);
    getKey = String(getKey);
  }
  const promise = self.ready().then(() => {
    const { db } = self._dbInfo;
    let result = db[getKey];
    if (result) {
      result = self._dbInfo.serializer.deserialize(result);
    }
    return result;
  });
  executeCallback(promise, callback);
  return promise;
}

function removeItem(this: DriverFuncType, rmKey: string, callback: any) {
  const self = this;
  // Cast the rmKey to a string, as that's all we can set as a rmKey.
  if (typeof rmKey !== 'string') {
    console.warn(`${rmKey} used as a rmKey, but it is not a string.`);
    rmKey = String(rmKey);
  }
  const promise = self.ready().then(() => {
    const { db } = self._dbInfo;
    if (hasOwnProperty(db, rmKey)) {
      delete db[rmKey];
    }
  });
  executeCallback(promise, callback);
  return promise;
}

function setItem(this: DriverFuncType, setKey: string, value: null | undefined, callback: any) {
  const self = this;
  // Cast the setKey to a string, as that's all we can set as a setKey.
  if (typeof setKey !== 'string') {
    console.warn(`${setKey} used as a setKey, but it is not a string.`);
    setKey = String(setKey);
  }
  const promise = self.ready().then(() => {
    // Convert undefined values to null.
    if (value === undefined) {
      value = null;
    }
    // Save the original value to pass to the callback.
    const originalValue = value;
    function serializeAsync(cValue) {
      return new Promise((resolve, reject) => {
        self._dbInfo.serializer.serialize(cValue, (sValue, error) => {
          if (error) {
            reject(error);
          } else {
            resolve(sValue);
          }
        });
      });
    }
    return serializeAsync(value).then((iValue) => {
      const { db } = self._dbInfo;
      db[setKey] = iValue;
      return originalValue;
    });
  });
  executeCallback(promise, callback);
  return promise;
}

function clear(this: DriverFuncType, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    Object.keys(self._dbInfo.db || []).forEach((rKey) => delete self._dbInfo.db[rKey]);
  });
  executeCallback(promise, callback);
  return promise;
}

function dropInstance(this: DriverFuncType, options, callback) {
  // eslint-disable-next-line prefer-rest-params
  const args: any = arguments;
  // eslint-disable-next-line prefer-rest-params
  callback = getCallback.apply(this, args);
  options = (typeof options !== 'function' && options) || {};
  if (!options.name) {
    const currentConfig = this.config();
    options.name = options.name || currentConfig.name;
    options.storeName = options.storeName || currentConfig.storeName;
  }
  const self = this;
  let promise;
  if (!options.name) {
    promise = Promise.reject('Invalid arguments');
  } else {
    promise = new Promise((resolve) => {
      if (!options.storeName) {
        resolve(`${options.name}`);
      } else {
        resolve(`${options.name}/${options.storeName}`);
      }
    }).then(() => {
      Object.keys(self._dbInfo.db || []).forEach((rKey) => delete self._dbInfo.db[rKey]);
    });
  }
  executeCallback(promise, callback);
  return promise;
}

const memoryStorageDriver = {
  _driver: 'memoryStorageDriver',
  _initStorage,
  _supports: () => {
    return true;
  },
  iterate,
  getItem,
  setItem,
  removeItem,
  clear,
  keyLength,
  length,
  key,
  keys,
  dropInstance,
};
export default memoryStorageDriver;
