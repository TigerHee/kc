/* eslint-disable @typescript-eslint/no-this-alias */
/**
 * Owner: garuda@kupotech.com
 */
import { DriverFuncType } from '../types';
import checkStrLength from '../utils/checkSize';
import executeCallback from '../utils/executeCallback';
import getCallback from '../utils/getCallback';
import getKeyPrefix from '../utils/getKeyPrefix';
import isStorageValid from '../utils/isStorageValid';
import normalizeKey from '../utils/normalizeKey';
import Promise from '../utils/promise';
import sentryReport from '../utils/sentryReport';
import serializer from '../utils/serializer';
// Check if sessionStorage throws when saving an item
function checkIfSessionStorageThrows() {
  const sessionStorageTestKey = '_kc_storage_support_test';
  try {
    sessionStorage.setItem(sessionStorageTestKey, 'test');
    sessionStorage.removeItem(sessionStorageTestKey);
    return false;
  } catch (e) {
    sentryReport(`sessionStorage check error checkIfSessionStorageThrows`, e);
    return true;
  }
}
// Check if sessionStorage is usable and allows to save an item
// This method checks if sessionStorage is usable in Safari Private Browsing
// mode, or in any other case where the available quota for sessionStorage
// is 0 and there wasn't any saved items yet.
function _isSessionStorageUsable() {
  return !checkIfSessionStorageThrows() || sessionStorage.length > 0;
}
// Config the sessionStorage backend, using options set in the config.
function _initStorage(this: DriverFuncType, options: any) {
  const self = this;
  const dbInfo: any = {};
  if (options) {
    Object.keys(options).forEach((k) => {
      dbInfo[k] = options[k];
    });
  }
  dbInfo.keyPrefix = getKeyPrefix(options, self._defaultConfig);
  if (!_isSessionStorageUsable()) {
    sentryReport(`sessionStorage init error`, `_initStorage _isSessionStorageUsable`);
    return Promise.reject();
  }
  dbInfo.serializer = serializer;

  self._dbInfo = dbInfo;

  return Promise.resolve();
}

// Iterate over all items in the store.
function iterate(this: DriverFuncType, iterator: any, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    const { keyPrefix } = dbInfo;
    const keyPrefixLength = keyPrefix?.length || 0;
    const sLength = sessionStorage.length;
    // We use a dedicated iterator instead of the `i` variable below
    // so other keys we fetch in sessionStorage aren't counted in
    // the `iterationNumber` argument passed to the `iterate()`
    // callback.
    let iterationNumber = 1;
    for (let i = 0; i < sLength; i++) {
      const cKey = sessionStorage.key(i);
      if (cKey?.indexOf(keyPrefix || '') === 0) {
        let value = sessionStorage.getItem(cKey);
        // If a result was found, parse it from the serialized
        // string into a JS object. If result isn't truthy, the
        // key is likely undefined and we'll pass it straight
        // to the iterator.
        if (value) {
          value = dbInfo.serializer.deserialize(value);
        }
        value = iterator(value, cKey.substring(keyPrefixLength), (iterationNumber += 1));
        // eslint-disable-next-line no-void
        if (value !== void 0) {
          return value;
        }
      }
    }
  });
  executeCallback(promise, callback);
  return promise;
}

// Same as sessionStorage's key() method, except takes a callback.
function key(this: DriverFuncType, n: number, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    let result;
    try {
      result = sessionStorage.key(n);
    } catch (error) {
      result = null;
      sentryReport(`sessionStorage key error`, error);
    }
    // Remove the prefix from the key, if a key is found.
    if (result) {
      result = result.substring(dbInfo.keyPrefix.length);
    }
    return result;
  });
  executeCallback(promise, callback);
  return promise;
}

function keys(this: DriverFuncType, callback: any) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    const sLength = sessionStorage.length;
    const cKeys: any = [];
    for (let i = 0; i < sLength; i++) {
      const itemKey = sessionStorage.key(i);
      if (itemKey?.indexOf(dbInfo.keyPrefix) === 0) {
        cKeys.push(itemKey.substring(dbInfo.keyPrefix.length));
      }
    }
    return cKeys;
  });
  executeCallback(promise, callback);
  return promise;
}

// Supply the number of keys in the datastore to the callback function.
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
    const dbInfo = self._dbInfo;
    const sLength = sessionStorage.length;
    let totalSize = 0;
    for (let i = 0; i < sLength; i++) {
      const itemKey = sessionStorage.key(i);
      if (itemKey?.indexOf(dbInfo.keyPrefix) === 0) {
        const value = sessionStorage.getItem(itemKey);
        // Calculate the byte size of the key and value
        totalSize += itemKey ? itemKey.length : 0;
        totalSize += value ? value.length : 0;
      }
    }
    return totalSize;
  });
  executeCallback(promise, callback);
  return promise;
}

// Retrieve an item from the store. Unlike the original async_storage
// library in Gaia, we don't modify return values at all. If a key's value
// is `undefined`, we pass that value to the callback function.
function getItem(this: DriverFuncType, rmKey: any, callback: any) {
  const self = this;
  rmKey = normalizeKey(rmKey);
  const promise = self
    .ready()
    .then(() => {
      const dbInfo = self._dbInfo;
      let result = sessionStorage.getItem(dbInfo.keyPrefix + rmKey);
      // If a result was found, parse it from the serialized
      // string into a JS object. If result isn't truthy, the key
      // is likely undefined and we'll pass it straight to the
      // callback.
      if (result) {
        result = dbInfo.serializer.deserialize(result);
      }
      return result;
    })
    .catch((err) => {
      sentryReport(`sessionStorage getItem catch`, err);
      throw err;
    });
  executeCallback(promise, callback);
  return promise;
}

// Remove an item from the store, nice and simple.
function removeItem(this: DriverFuncType, rmKey: any, callback: any) {
  const self = this;
  rmKey = normalizeKey(rmKey);
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    sessionStorage.removeItem(dbInfo.keyPrefix + rmKey);
  });
  executeCallback(promise, callback);
  return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem(this: DriverFuncType, sKey: any, value: any, callback: any) {
  const self = this;
  sKey = normalizeKey(sKey);
  const promise = self.ready().then(() => {
    // Convert undefined values to null.
    if (value === undefined) {
      value = null;
    }
    // Save the original value to pass to the callback.
    const originalValue = value;
    return new Promise((resolve, reject) => {
      // check size
      if (checkStrLength(value, self._dbInfo?.maxItemSize)) {
        sentryReport(
          `sessionStorage setItem maxLength`,
          `set key ${sKey} value: ${!!value} maxItem: ${self._dbInfo?.maxItemSize}`,
        );
        return reject(
          `The single storage limit does not exceed ${self._dbInfo?.maxItemSize ||
            150 * 1024} chart!`,
        );
      }
      const dbInfo = self._dbInfo;
      dbInfo.serializer.serialize(value, (sValue, error) => {
        if (error) {
          reject(error);
          sentryReport(`sessionStorage setItem serialize error`, error);
        } else {
          try {
            sessionStorage.setItem(dbInfo.keyPrefix + sKey, sValue);
            resolve(originalValue);
          } catch (e: any) {
            // sessionStorage capacity exceeded.
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              reject(e);
              sentryReport(`sessionStorage setItem QuotaExceededError error`, e);
            } else {
              reject(e);
              sentryReport(`sessionStorage setItem error`, e);
            }
          }
        }
      });
    });
  });
  executeCallback(promise, callback);
  return promise;
}

// Remove all keys from the datastore, effectively destroying all data in
// the app's key/value store!
function clear(this: DriverFuncType, callback: any) {
  const self = this;
  const promise = self
    .ready()
    .then(() => {
      const { keyPrefix } = self._dbInfo;
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const cKey = sessionStorage.key(i);
        if (cKey?.indexOf(keyPrefix || '') === 0) {
          sessionStorage.removeItem(cKey);
        }
      }
    })
    .catch((err) => {
      sentryReport(`sessionStorage clear catch`, err);
      throw err;
    });
  executeCallback(promise, callback);
  return promise;
}

function dropInstance(this: DriverFuncType, options: any, callback: any) {
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
        resolve(`${options.name}/`);
      } else {
        resolve(getKeyPrefix(options, self._defaultConfig));
      }
    }).then((keyPrefix) => {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const cKey: any = sessionStorage.key(i);
        if (cKey?.indexOf(keyPrefix) === 0) {
          sessionStorage.removeItem(cKey);
        }
      }
    });
  }
  executeCallback(promise, callback);
  return promise;
}
const sessionStorageDriver = {
  _driver: 'sessionStorageDriver',
  _initStorage,
  _support: isStorageValid(),
  iterate,
  getItem,
  setItem,
  removeItem,
  clear,
  keyLength,
  key,
  keys,
  dropInstance,
  length,
};
export default sessionStorageDriver;
