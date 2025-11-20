/**
 * 增加千分位分隔符
 * @param n
 * @returns {string}
 */
const SeparateNumberPool = {
  pool: Object.create(null),
  poolCount: 0,
  has(k) {
    return !!this.pool[k];
  },
  get(k) {
    return this.pool[k];
  },
  set(k, v) {
    if (this.poolCount > 100000) {
      // 清理缓存
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};

const separateNumber = (n) => {
  if (typeof +n !== 'number') {
    return n;
  }
  const num = `${n}`;

  if (SeparateNumberPool.has(num)) {
    return SeparateNumberPool.get(num);
  }
  if (!/^[0-9.]+$/.test(num)) {
    return n;
  }

  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    [integer, floater] = arr;
  }
  const len = integer.length;
  let parser = '';
  if (len > 3) {
    let count = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      parser = integer[i] + parser;
      count += 1;
      if (count % 3 === 0 && i > 0) {
        parser = `,${parser}`;
      }
    }
  } else {
    parser = integer;
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  const r = `${parser}${floater}`;
  SeparateNumberPool.set(num, r);

  return r;
};

export default separateNumber;
