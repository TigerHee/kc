/**
 * Owner: borden@kupotech.com
 */
class EventBus {
  listeners = {};

  // creates an event that can be triggered any number of times
  on(eventName, callback) {
    this.registerListener(eventName, callback);
  }

  // creates an event that can be triggered only once. If it is emitted twice, the callback will only be executed once!
  once(eventName, callback) {
    this.registerListener(eventName, callback, 1);
  }

  // creates an event that can be triggered only a number of times. If it is emitted more than that, the callback will not be be executed anymore!
  exactly(eventName, callback, capacity) {
    this.registerListener(eventName, callback, capacity);
  }

  // kill an event with all it's callbacks
  die(eventName) {
    delete this.listeners[eventName];
  }

  // kill an event with all it's callbacks
  off(eventName) {
    this.die(eventName);
  }

  // removes the given callback for the given event
  detach(eventName, callback) {
    let listeners = this.listeners[eventName] || [];

    listeners = listeners.filter((value) => {
      return value.callback !== callback;
    });

    if (eventName in this.listeners) {
      this.listeners[eventName] = listeners;
    }
  }

  // removes all the events for the given name
  detachAll(eventName) {
    this.die(eventName);
  }

  emit(eventName, data, context) {
    let listeners = [];

    // name exact match
    if (this.hasListeners(eventName)) {
      listeners = this.listeners[eventName];
    } else if (eventName.includes('*')) {
      // wildcards support
      let newName = eventName.replace(/\*\*/, '([^.]+.?)+');
      newName = newName.replace(/\*/g, '[^.]+');

      const match = eventName.match(newName);

      // TODO: 这个地方写单测报错，后续需要修改改逻辑
      if (match && eventName === match[0]) {
        listeners = this.listeners[eventName] || [];
      }
    }

    listeners.forEach((listener, k) => {
      let { callback } = listener;

      if (context) {
        callback = callback.bind(context);
      }

      callback(data);

      if (listener.triggerCapacity !== undefined) {
        // eslint-disable-next-line no-plusplus
        listener.triggerCapacity--;
        listeners[k].triggerCapacity = listener.triggerCapacity;
      }

      if (this.checkToRemoveListener(listener)) {
        this.listeners[eventName].splice(k, 1);
      }
    });
  }

  registerListener(eventName, callback, triggerCapacity) {
    if (!this.hasListeners(eventName)) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push({ callback, triggerCapacity });
  }

  // eslint-disable-next-line class-methods-use-this
  checkToRemoveListener(eventInformation) {
    if (eventInformation.triggerCapacity !== undefined) {
      return eventInformation.triggerCapacity <= 0;
    }

    return false;
  }

  hasListeners(eventName) {
    return eventName in this.listeners;
  }
}

export const event = new EventBus();
if (process.env.NODE_ENV === 'development') {
  window.$_event = event;
}

export default EventBus;
