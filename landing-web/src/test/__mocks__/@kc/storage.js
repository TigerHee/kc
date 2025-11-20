/*
 * Owner: terry@kupotech.com
 */

export class SyncStorage {
  constructor(options) {
    this.namespace = options?.namespace;
    this.storage = {};
  }

  getItem(key) { // Add this method
    return this.storage[key]
  }


  setItem(key, value) {
    this.storage[key] = value;
  }

  removeItem(key) {
    delete this.storage[key];
  }

  clear() {
    this.storage = {};
    return Promise.resolve();
  }
}

export const namespace = 'kucoinv2_';