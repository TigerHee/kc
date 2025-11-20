/**
 * @Owner: larvide.peng@kupotech.com
 */

class SyncStorage {
  constructor(options) {
    this.namespace = options?.namespace;
    this.storage = {};
  }

  getItem(key) {
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
  }
}

module.exports = SyncStorage;