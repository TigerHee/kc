/**
 * Owner: iron@kupotech.com
 */
export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, cb) {
    if (typeof cb !== 'function') {
      throw new Error('cb必须是函数');
    }
    const eventList = this.events[event];
    if (eventList) {
      eventList.push(cb);
    } else {
      this.events[event] = [cb];
    }
    return () => {
      this.off(event, cb);
    };
  }

  off(event, cb) {
    const eventList = this.events[event];
    if (eventList) {
      this.events[event] = eventList.filter((ev) => ev !== cb);
    }
  }

  emit(event, ...data) {
    (this.events[event] || []).forEach((cb) => {
      if (typeof cb === 'function') {
        cb(...data);
      }
    });
  }
}
