import {GlobalEventBusType} from 'constants/eventType';

/**
 * @class EventBus
 * @description 一个简单的事件总线工具，用于在不同组件或对象之间进行通信。
 */
class EventBus {
  /**
   * @constructor
   * 初始化一个新的EventBus实例。
   */
  constructor() {
    /**
     * @private
     * 使用Map来存储事件订阅者，键是事件名，值是一个数组，包含所有监听该事件的回调函数。
     * @type {Map<string, Array<Function>>}
     */
    this.eventMap = new Map();
  }

  /**
   * @method on
   * @param {string} eventName - 要订阅的事件名称。
   * @param {Function} listener - 当事件触发时执行的回调函数。
   * @returns {this} 返回当前EventBus实例以支持链式调用。
   * @description 订阅指定事件，当事件被触发时执行给定的回调函数。
   */
  on(eventName, listener) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, []);
    }
    this.eventMap.get(eventName).push(listener);
    return this;
  }

  /**
   * @method off
   * @param {string} eventName - 要取消订阅的事件名称。
   * @param {Function} [listener] - 可选参数，要移除的具体回调函数。如果不提供，则移除该事件的所有监听器。
   * @returns {this} 返回当前EventBus实例以支持链式调用。
   * @description 取消订阅指定事件或特定的回调函数。
   */
  off(eventName, listener) {
    if (this.eventMap.has(eventName)) {
      const listeners = this.eventMap.get(eventName);
      if (listener) {
        this.eventMap.set(
          eventName,
          listeners.filter(l => l !== listener),
        );
      } else {
        this.eventMap.delete(eventName);
      }
    }
    return this;
  }

  /**
   * @method once
   * @param {string} eventName - 要订阅的事件名称。
   * @param {Function} listener - 当事件触发时执行的回调函数。
   * @returns {this} 返回当前EventBus实例以支持链式调用。
   * @description 注册指定事件， 会覆盖
   */
  once(eventName, listener) {
    // 清除之前注册的处理器
    this.off(eventName);
    this.on(eventName, listener);
  }

  /**
   * @method emit
   * @param {string} eventName - 要触发的事件名称。
   * @param {...*} args - 传递给监听器回调函数的任意数量的参数。
   * @returns {boolean} 如果至少有一个监听器被执行，则返回true；否则返回false。
   * @description 触发指定名称的事件，并依次执行所有订阅该事件的监听器。
   */
  emit(eventName, ...args) {
    if (this.eventMap.has(eventName)) {
      const listeners = this.eventMap.get(eventName);
      listeners.forEach(listener => listener(...args));
      return true;
    }
    return false;
  }

  async emitWithReturn(eventName, ...args) {
    if (this.eventMap.has(eventName)) {
      const listeners = this.eventMap.get(eventName);
      const results = await Promise.all(
        listeners.map(async callback => {
          try {
            return await callback(...args);
          } catch (error) {
            console.error(`Error in event listener for ${eventName}:`, error);
            return undefined;
          }
        }),
      );

      const filteredResults = results.filter(result => result !== undefined);

      return filteredResults.length === 1
        ? filteredResults[0]
        : filteredResults;
    }
    return undefined;
  }
}

export const eventBus = new EventBus();

export {GlobalEventBusType};
