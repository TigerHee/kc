/**
 * Owner: willen@kupotech.com
 */
// func一般为耗时较长的任务，这样可以使用key作为键来缓存结果，作为参数传给cb
export class Task {
  next = null;
  constructor({ func = () => void 0, key = '', onSuccess = () => void 0, onError = () => void 0 }) {
    this.func = func;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.key = key;
  }
}

export class Schedule {
  last = null;
  current = null;
  keyResultMap = new Map();
  finishedKey = [];

  constructor(timeGap = 0, maxCache = 50) {
    this.timeGap = timeGap;
    this.maxCache = maxCache;
  }

  push(task) {
    if (!this.current) {
      this.last = task;
      this.current = task;
      this.exec();
    } else {
      const last = this.last;
      last.next = task;
      this.last = task;
    }
  }

  clear() {
    this.keyResultMap = new Map();
    this.finishedKey = [];
    this.last = null;
    this.current = null;
  }

  async exec() {
    const current = this.current;
    if (!current) {
      return;
    }
    let res = null;
    let cb = current.onSuccess;
    if (!this.keyResultMap.has(current.key)) {
      try {
        res = await current.func();
        this.keyResultMap.set(current.key, res);
        this.finishedKey.push(current.key);
      } catch (e) {
        res = e;
        cb = current.onError;
      }
    } else {
      res = this.keyResultMap.get(current.key);
    }
    await cb(current.key, res);
    // 缓存控制，最简单的顺序控制
    if (this.finishedKey.length === this.maxCache + 1) {
      const willDelKey = this.finishedKey.shift();
      this.keyResultMap.delete(willDelKey);
    }
    if (!current.next) {
      this.current = null;
      return;
    }
    this.current = current.next;
    setTimeout(() => this.exec(), this.timeGap);
  }
}
