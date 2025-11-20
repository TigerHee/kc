/**
 * Owner: eli.xiang@kupotech.com
 */

import storage from '@utils/storage';

function checkIndexedDBSupport() {
  return typeof window?.indexedDB !== 'undefined';
}
export default class DataStorage {
  constructor(databaseName, storeName) {
    this.databaseName = databaseName;
    this.storeName = storeName;
    this.isIndexedDBSupported = checkIndexedDBSupport();
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      if (!this.isIndexedDBSupported) {
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(this.databaseName, 1);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      if (!this.isIndexedDBSupported) {
        const value = storage.getItem(key);
        resolve(value);
        return;
      }

      this.openDatabase()
        .then((db) => {
          if (!db) {
            const value = storage.getItem(key);
            resolve(value);
            return;
          }

          const transaction = db.transaction([this.storeName], 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.get(key);

          request.onsuccess = () => {
            resolve(request.result);
          };

          request.onerror = () => {
            reject(request.error);
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      if (!this.isIndexedDBSupported) {
        storage.setItem(key, value);
        resolve();
        return;
      }

      this.openDatabase()
        .then((db) => {
          if (!db) {
            storage.setItem(key, value);
            resolve();
            return;
          }

          const transaction = db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.put({ id: key, ...value });

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = () => {
            reject(request.error);
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      if (!this.isIndexedDBSupported) {
        storage.removeItem(key);
        resolve();
        return;
      }

      this.openDatabase()
        .then((db) => {
          if (!db) {
            storage.removeItem(key);
            resolve();
            return;
          }

          const transaction = db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.delete(key);

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = () => {
            reject(request.error);
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
