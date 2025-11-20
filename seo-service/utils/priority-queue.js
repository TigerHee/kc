/**
 * 优先队列
 * Owner: hanx.wei@kupotech.com
 */

class MinHeap {
  constructor() {
    this.values = [];
  }

  swap(a, b) {
    [ this.values[a], this.values[b] ] = [ this.values[b], this.values[a] ];
  }

  push(v) {
    this.values.push(v);
    if (this.values.length > 1) {
      let r = this.values.length - 1;
      let m = Math.floor((r - 1) / 2);
      while (m >= 0) {
        if (this.values[r].priority < this.values[m].priority) {
          this.swap(r, m);
          r = m;
          m = Math.floor((r - 1) / 2);
        } else {
          break;
        }
      }
    }
  }

  pop() {
    if (this.values.length === 0) return null;
    if (this.values.length === 1) return this.values.pop();
    const ret = this.values[0];
    this.values[0] = this.values.pop();
    this.adjust(0, this.values.length);
    return ret;
  }

  adjust(i, len) {
    for (let j = i * 2 + 1; j < len; j = j * 2 + 1) {
      if (j + 1 < len && this.values[j + 1].priority < this.values[j].priority) {
        j++;
      }
      if (this.values[i].priority > this.values[j].priority) {
        this.swap(i, j);
        i = j;
      } else {
        break;
      }
    }
  }

  build() {
    const l = this.values.length;
    if (l <= 1) return;
    for (let i = Math.floor(l / 2 - 1); i >= 0; i--) {
      this.adjust(i, l);
    }
  }

  size() {
    return this.values.length;
  }

  peek() {
    return this.values[0] || null;
  }

  empty() {
    this.values.length = 0;
  }
}

class PriorityQueue {
  constructor() {
    this.heap = new MinHeap();
  }

  push(data, priority = 0) {
    this.heap.push({
      priority,
      value: data,
    });
  }

  pop() {
    const ret = this.heap.pop();
    return ret ? ret.value : null;
  }

  peek() {
    const ret = this.heap.peek();
    return ret ? ret.value : null;
  }

  len() {
    return this.heap.size();
  }

  empty() {
    this.heap.empty();
  }

  remove(matcher) {
    this.heap.values = this.heap.values.filter(v => !matcher(v));
    this.heap.build();
  }
}

module.exports = PriorityQueue;
