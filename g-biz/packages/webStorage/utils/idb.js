/**
 * Owner: garuda@kupotech.com
 */
const { webkitIndexedDB, mozIndexedDB, OIndexedDB, msIndexedDB } = window || {};
function getIDB() {
  try {
    if (typeof indexedDB !== 'undefined') {
      return indexedDB;
    }
    if (typeof webkitIndexedDB !== 'undefined') {
      return webkitIndexedDB;
    }
    if (typeof mozIndexedDB !== 'undefined') {
      return mozIndexedDB;
    }
    if (typeof OIndexedDB !== 'undefined') {
      return OIndexedDB;
    }
    if (typeof msIndexedDB !== 'undefined') {
      return msIndexedDB;
    }
  } catch (e) {
    return null;
  }
}
const idb = getIDB();
export default idb;
