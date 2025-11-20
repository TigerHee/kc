/**
 * 链表实现队列
 * Owner: hanx.wei@kupotech.com
 */

class ListNode {
  constructor(data = null) {
    this.data = data;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = new ListNode();
    this.tail = this.head;
    this.count = 0;
  }

  push(data) {
    const node = new ListNode(data);
    this.tail.next = node;
    this.tail = node;
    this.count++;
  }

  pop() {
    if (this.count === 0) {
      return null;
    }
    const node = this.head.next;
    this.head.next = node.next;
    this.count--;
    if (this.count === 0) {
      this.tail = this.head;
    }
    return node.data;
  }

  peek() {
    if (this.count === 0) {
      return null;
    }
    return this.head.next.data;
  }

  len() {
    return this.count;
  }

  empty() {
    this.head.next = null;
    this.tail = this.head;
    this.count = 0;
  }

  remove(matcher) {
    let prev = this.head;
    let cur = this.head.next;
    while (cur !== null) {
      if (matcher(cur.data)) {
        if (this.tail === cur) {
          this.tail = prev;
        }
        prev.next = cur.next;
        cur = cur.next;
        this.count--;
        if (this.count === 0) {
          this.tail = this.head;
        }
      } else {
        prev = cur;
        cur = cur.next;
      }
    }
  }

  // 调试用方法
  _all() {
    const arr = [];
    let cur = this.head.next;
    while (cur !== null) {
      arr.push(cur.data);
      cur = cur.next;
    }
    return arr;
  }
}

module.exports = Queue;
