/**
 * Owner: iron@kupotech.com
 */
export default class Event {
  constructor() {
    this.cache = {};
  }

  // 绑定
  on(type, callback) {
    this.cache[type] = this.cache[type] || [];
    const fns = this.cache[type];
    if (fns.indexOf(callback) === -1) {
      fns.push(callback);
    }
    return this;
  }

  // 触发
  emit(type, ...data) {
    const fns = this.cache[type];
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn.apply(this, data);
      });
    }
    return this;
  }

  // 解绑
  off(type, callback) {
    const fns = this.cache[type];
    if (Array.isArray(fns)) {
      if (callback) {
        const index = fns.indexOf(callback);
        if (index !== -1) {
          fns.splice(index, 1);
        }
      } else {
        fns.length = 0;
      }
    }
    return this;
  }
}
