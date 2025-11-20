// 没有 prefix 使用
import store from 'store2';

const StorageNoPrefix = {
  getItem: (key: string) => store(key),
  setItem: (key: string, data: string) => store(key, data),
  removeItem: (key: string) => store.remove(key),
};

export default StorageNoPrefix;
