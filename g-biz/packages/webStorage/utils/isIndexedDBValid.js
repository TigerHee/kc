/**
 * Owner: garuda@kupotech.com
 */
import idb from './idb';

const { openDatabase } = window || {};
function isIndexedDBValid() {
  try {
    // Check if IndexedDB is available
    if (!idb || typeof idb.open !== 'function') {
      return false;
    }
    // Check if the browser is Safari
    const isSafariBrowser =
      typeof openDatabase !== 'undefined' &&
      /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent) &&
      !/BlackBerry/.test(navigator?.platform);
    // Check if fetch is available and native
    const hasNativeFetch =
      typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;
    // Check if IndexedDB and IDBKeyRange are available
    const hasIndexedDB = typeof indexedDB !== 'undefined';
    const hasIDBKeyRange = typeof IDBKeyRange !== 'undefined';
    // Safari <10.1 does not meet our requirements for IDB support
    // (see: https://github.com/pouchdb/pouchdb/issues/5572).
    // Safari 10.1 shipped with fetch, we can use that to detect it.
    // Note: this creates issues with `window.fetch` polyfills and
    // overrides; see:
    // https://github.com/localForage/localForage/issues/856
    return (!isSafariBrowser || hasNativeFetch) && hasIndexedDB && hasIDBKeyRange;
  } catch (e) {
    return false;
  }
}
export default isIndexedDBValid;
