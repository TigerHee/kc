/**
 * Owner: garuda@kupotech.com
 */
import checkStrLength from '../utils/checkSize';
import executeCallback from '../utils/executeCallback';
import getCallback from '../utils/getCallback';
import getKeyPrefix from '../utils/getKeyPrefix';
import isStorageValid from '../utils/isStorageValid';
import normalizeKey from '../utils/normalizeKey';
import Promise from '../utils/promise';
import sentryReport from '../utils/sentryReport';
import serializer from '../utils/serializer';
import { _isQuotaExceeded, _handleQuotaExceeded } from '../utils/storageClean';

// Check if localStorage throws when saving an item
function checkIfLocalStorageThrows() {
  const localStorageTestKey = '_kc_storage_support_test';
  try {
    localStorage.setItem(localStorageTestKey, 'test');
    localStorage.removeItem(localStorageTestKey);
    return false;
  } catch (e) {
    sentryReport(`localStorage check error checkIfLocalStorageThrows`, e);
    return true;
  }
}
// Check if localStorage is usable and allows to save an item
// This method checks if localStorage is usable in Safari Private Browsing
// mode, or in any other case where the available quota for localStorage
// is 0 and there wasn't any saved items yet.
function _isLocalStorageUsable() {
  return !checkIfLocalStorageThrows() || localStorage.length > 0;
}

// Config the localStorage backend, using options set in the config.
function _initStorage(options) {
  const self = this;
  const dbInfo = {};
  if (options) {
    Object.keys(options).forEach((k) => {
      dbInfo[k] = options[k];
    });
  }
  dbInfo.keyPrefix = getKeyPrefix(options, self._defaultConfig);
  if (!_isLocalStorageUsable()) {
    sentryReport(`localStorage init error`, `_initStorage _isLocalStorageUsable`);
    return Promise.reject();
  }
  dbInfo.serializer = serializer;
  self._dbInfo = dbInfo;
  return Promise.resolve();
}

// Iterate over all items in the store.
function iterate(iterator, callback) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    const { keyPrefix } = dbInfo;
    const keyPrefixLength = keyPrefix?.length || 0;
    const sLength = localStorage.length;
    // We use a dedicated iterator instead of the `i` variable below
    // so other keys we fetch in localStorage aren't counted in
    // the `iterationNumber` argument passed to the `iterate()`
    // callback.
    let iterationNumber = 1;
    for (let i = 0; i < sLength; i++) {
      const cKey = localStorage.key(i);
      if (cKey?.startsWith(keyPrefix || '') === 0) {
        let value = localStorage.getItem(cKey);
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

// Same as localStorage's key() method, except takes a callback.
function key(n, callback) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    let result;
    try {
      result = localStorage.key(n);
    } catch (error) {
      result = null;
      sentryReport(`localStorage key error`, error);
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

function keys(callback) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    const sLength = localStorage.length;
    const cKeys = [];
    for (let i = 0; i < sLength; i++) {
      const itemKey = localStorage.key(i);
      if (itemKey?.startsWith(dbInfo.keyPrefix) === 0) {
        cKeys.push(itemKey.substring(dbInfo.keyPrefix.length));
      }
    }
    return cKeys;
  });
  executeCallback(promise, callback);
  return promise;
}

// Supply the number of keys in the datastore to the callback function.
function keyLength(callback) {
  const self = this;
  const promise = self.keys().then((cKeys) => {
    return cKeys.length;
  });
  executeCallback(promise, callback);
  return promise;
}

function length(callback) {
  const self = this;
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    const sLength = localStorage.length;
    let totalSize = 0;
    for (let i = 0; i < sLength; i++) {
      const itemKey = localStorage.key(i);
      if (itemKey?.startsWith(dbInfo.keyPrefix) === 0) {
        const value = localStorage.getItem(itemKey);
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
function getItem(rmKey, callback) {
  const self = this;
  rmKey = normalizeKey(rmKey);
  const promise = self
    .ready()
    .then(() => {
      const dbInfo = self._dbInfo;
      let result = localStorage.getItem(dbInfo.keyPrefix + rmKey);
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
      sentryReport(`localStorage getItem catch`, err);
      throw err;
    });
  executeCallback(promise, callback);
  return promise;
}

// Remove an item from the store, nice and simple.
function removeItem(rmKey, callback) {
  const self = this;
  rmKey = normalizeKey(rmKey);
  const promise = self.ready().then(() => {
    const dbInfo = self._dbInfo;
    localStorage.removeItem(dbInfo.keyPrefix + rmKey);
  });
  executeCallback(promise, callback);
  return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem(sKey, value, callback) {
  const self = this;
  sKey = normalizeKey(sKey);
  const promise = self.ready().then(() => {
    // Convert undefined values to null.
    if (value === undefined) {
      value = null;
    }
    // Save the original value to pass to the callback.
    // const originalValue = value;
    return new Promise((resolve, reject) => {
      // check size
      if (checkStrLength(value, self._dbInfo?.maxItemSize)) {
        sentryReport(
          `localStorage setItem maxLength`,
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
          sentryReport(`localStorage setItem serialize error`, error);
        } else {
          const saveKey = dbInfo.keyPrefix + sKey;
          try {
            localStorage.setItem(saveKey, sValue);
            resolve(sValue);
          } catch (e) {
            // retry exceeded operation
            if (_isQuotaExceeded(e)) {
              _handleQuotaExceeded({
                type: 'localStorage',
                prefix: dbInfo.keyPrefix,
                key: saveKey,
                saveValue: sValue,
                reporter: sentryReport,
                resolve,
                reject,
              });
            } else {
              sentryReport(`webStorage localStorage setItem error for unknown`, e);
              reject(e);
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
function clear(callback) {
  const self = this;
  const promise = self
    .ready()
    .then(() => {
      const { keyPrefix } = self._dbInfo;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const cKey = localStorage.key(i);
        if (cKey?.startsWith(keyPrefix || '') === 0) {
          localStorage.removeItem(cKey);
        }
      }
    })
    .catch((err) => {
      sentryReport(`localStorage clear catch`, err);
      throw err;
    });
  executeCallback(promise, callback);
  return promise;
}

function dropInstance(options, callback) {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
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
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const cKey = localStorage.key(i);
        if (cKey?.startsWith(keyPrefix) === 0) {
          localStorage.removeItem(cKey);
        }
      }
    });
  }
  executeCallback(promise, callback);
  return promise;
}

const localStorageDriver = {
  _driver: 'localStorageDriver',
  _initStorage,
  _support: isStorageValid(),
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

export default localStorageDriver;
