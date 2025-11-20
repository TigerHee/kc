/**
 * Owner: iron@kupotech.com
 */
/* eslint-disable */
type Callback = (...args: any[]) => void;

export default class EventEmitter {
  private events: Record<string, Callback[]> = {};

  on(event: string, cb: Callback): () => void {
    if (typeof cb !== 'function') {
      throw new Error('cb 必须是函数');
    }

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(cb);

    return () => this.off(event, cb);
  }

  off(event: string, cb: Callback): void {
    const listeners = this.events[event];
    if (listeners) {
      this.events[event] = listeners.filter(fn => fn !== cb);
    }
  }

  emit(event: string, ...args: any[]): void {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach(fn => fn(...args));
    }
  }
}
