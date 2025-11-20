/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-02-13 22:43:13
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-07-04 12:02:10
 * @FilePath: /trade-web/src/utils/sessionStorage.js
 * @Description:
 */
import app from 'utils/createApp';

const { sessionStorage } = window;

const genKey = (subKey, prefix) => {
  if (prefix) return `${prefix}_${subKey}`;
  return `kc-trade.${subKey}`;
};

export default {
  getItem: (key, prefix) => {
    if (!sessionStorage) return;

    const data = sessionStorage.getItem(genKey(key, prefix));

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  },
  setItem: (key, data, prefix) => {
    if (!sessionStorage) return;
    return sessionStorage.setItem(genKey(key, prefix), JSON.stringify(data));
  },
  setDiffItem: (key, data, prefix) => {
    if (!sessionStorage) return;
    const itemKey = genKey(key, prefix);
    const str = JSON.stringify(data);
    const oldStr = sessionStorage.getItem(itemKey);
    const isDiff = str !== oldStr;
    if (isDiff) {
      sessionStorage.setItem(itemKey, str);
    }
    return isDiff;
  },
  setDiffStrItem: (key, str, prefix) => {
    if (!sessionStorage) return;
    const itemKey = genKey(key, prefix);
    const oldStr = sessionStorage.getItem(itemKey);
    const isDiff = str !== oldStr;
    if (isDiff) {
      sessionStorage.setItem(itemKey, str);
    }
    return isDiff;
  },
  removeItem: (key, prefix) => {
    if (!sessionStorage) return;
    try {
      return sessionStorage.removeItem(genKey(key, prefix));
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
};
