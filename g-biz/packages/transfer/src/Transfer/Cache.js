/**
 * Owner: solar@kupotech.com
 */
export default class Cache {
  constructor(expire) {
    this.cache = {};
    this.instance = null;
    // 默认过期时间为5min
    this.expire = Number.isNaN(expire * 1000) ? 5 * 60 * 1000 : expire * 1000;
  }

  static getInstance(expire) {
    if (!this.instance) {
      this.instance = new Cache(expire);
    }
    return this.instance;
  }

  set = (key, value) => {
    this.cache[key] = {
      value,
      timestamp: Date.now(),
    };
  };

  // 缓存数据存在且有效，则返回null
  get = (key) => {
    const now = Date.now();
    if (this.cache[key] && now - this.cache[key].timestamp <= this.expire) {
      return this.cache[key].value;
    }
    return null;
  };
}
