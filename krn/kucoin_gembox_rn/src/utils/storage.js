/**
 * Owner: roger.chen@kupotech.com
 */
import {storagePrefix} from 'config';
import {AsyncStorage} from 'react-native';

const genKey = (subKey, prefix) => {
  const _prefix = prefix || storagePrefix;
  return `${_prefix}_${subKey}`;
};

export default {
  getItem: async (key, prefix) => {
    const data = await AsyncStorage.getItem(genKey(key, prefix));
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
    } else {
      return null;
    }
  },
  setItem: (key, data, prefix) => {
    try {
      return AsyncStorage.setItem(genKey(key, prefix), JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  },
  removeItem: (key, prefix) => {
    try {
      AsyncStorage.removeItem(genKey(key, prefix));
    } catch (e) {
      console.log(e);
    }
  },
  clear: () => {
    AsyncStorage.clear();
  },
};
