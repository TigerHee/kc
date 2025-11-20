import store from 'store2';

export const storePrefix = 'kucoinv2';
const kucoinStore = store.namespace(storePrefix, true, '_');

const Storage = {
  getItem: (key) => kucoinStore(key),
  setItem: (key, data) => kucoinStore(key, data),
  removeItem: (key) => kucoinStore.remove(key),
};

export default Storage;
