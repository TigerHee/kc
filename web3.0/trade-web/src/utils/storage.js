/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-02-13 22:43:13
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-04 17:39:30
 * @FilePath: /trade-web/src/utils/storage.js
 * @Description:
 */
import app from 'utils/createApp';
import { isABNew } from '@/meta/const';

const { localStorage } = window;

const genKey = (subKey, prefix) => {
  if (prefix) return `${prefix}_${subKey}`;
  if (isABNew()) {
    return `kc-trade-new.${subKey}`; // 区分新老交易大厅localstorage前缀
  }
  return `kc-trade.${subKey}`;
};

export const genKCKey = (subKey) => `kucoinv2_${subKey}`;

export default {
  getItem: (key, prefix) => {
    if (!localStorage) return;

    const data = localStorage.getItem(genKey(key, prefix));

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  },
  setItem: (key, data, prefix) => {
    if (!localStorage) return;
    return localStorage.setItem(genKey(key, prefix), JSON.stringify(data));
  },
  setDiffItem: (key, data, prefix) => {
    if (!localStorage) return;
    const itemKey = genKey(key, prefix);
    const str = JSON.stringify(data);
    const oldStr = localStorage.getItem(itemKey);
    const isDiff = str !== oldStr;
    if (isDiff) {
      localStorage.setItem(itemKey, str);
    }
    return isDiff;
  },
  setDiffStrItem: (key, str, prefix) => {
    if (!localStorage) return;
    const itemKey = genKey(key, prefix);
    const oldStr = localStorage.getItem(itemKey);
    const isDiff = str !== oldStr;
    if (isDiff) {
      localStorage.setItem(itemKey, str);
    }
    return isDiff;
  },
  removeItem: (key, prefix) => {
    if (!localStorage) return;
    try {
      return localStorage.removeItem(genKey(key, prefix));
    } catch (e) {
      if (app?._store?.dispatch) {
        app._store.dispatch({
          type: 'notice/feed',
          payload: {
            type: 'notification.warning',
            message: 'Sorry, the browser’s storage space is full.',
            extra: {
              description: `To ensure the normal usage, please visit Tools > Clear
              Recent History > Cookies and select All in Time Range to release the storage space.`,
            },
          },
        });
      }
    }
  },

  sessionGetItem: (key, isKc = false) => {
    if (!window.sessionStorage) {
      return null;
    }
    const getKey = isKc ? genKCKey(key) : genKey(key);
    const data = window.sessionStorage.getItem(getKey);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  },
  sessionSetItem: (key, data, isKc = false) => {
    if (!window.sessionStorage) return false;
    const getKey = isKc ? genKCKey(key) : genKey(key);
    return window.sessionStorage.setItem(getKey, JSON.stringify(data));
  },
  sessionRemoveItem: (key, isKc = false) => {
    if (!window.sessionStorage) return false;
    try {
      const getKey = isKc ? genKCKey(key) : genKey(key);
      window.sessionStorage.removeItem(getKey);
    } catch (e) {
      console.warn({
        message: 'Sorry, the browser’s storage space is full.',
        description: `To ensure the normal usage, please visit Tools > Clear
         Recent History > Cookies and select All in Time Range to release the storage space.`,
      });
      return e;
    }
  },
};
