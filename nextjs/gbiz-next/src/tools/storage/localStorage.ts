/**
 * Owner: iron@kupotech.com
 */
/**
 * runtime: browser
 */
const { localStorage } = typeof window !== 'undefined' ? window :  {};

export default {
  getItem: (key) => {
    if (!localStorage) return null;
    const data = localStorage.getItem(key);
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
  setItem: (key, data) => {
    if (!localStorage) return null;
    try {
      return localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.log('Sorry, the browser’s storage space is full.');
      return null;
    }
  },
  removeItem: (key) => {
    if (!localStorage) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  },
  setItemWithExpire(key, data, ttl = 0 /* 单位：ms */) {
    const now = new Date();
    const item = {
      value: data,
      expire: now.getTime() + ttl,
    };
    this.setItem(key, item);
  },
  getItemWithExpire(key) {
    const item = this.getItem(key);
    if (!item) return null;
    const now = new Date();
    if (now.getTime() > (item.expire || 0)) {
      this.removeItem(key);
      return null;
    }
    return item.value;
  },
};
