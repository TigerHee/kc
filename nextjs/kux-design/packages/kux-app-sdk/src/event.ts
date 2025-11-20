/**
 * event handler
 */
import { waitForINP } from './utils';
import type { BUILTIN_EVENT_NAMES } from './config';
import { is } from './is';

export type IFn = (...args: any[]) => any;
/**
 * 事件触发参数
 */
export interface IEventCfg<TName extends string = string> {
  /**
   * 事件名称
   */
  eventName: TName;
  /**
   * 是否立即触发, 默认将事件放到下一个事件循环
   *  * 仅内部事件开放改选项
   */
  immediate?: boolean;
}

export interface IEventHubOptions {
  /**
   * 是否立即触发事件
   */
  immediate?: boolean;
}



/**
 * 事件总线
 * * TNmae 事件类型
 */
export class EventHub<TName extends string = string> {
  /**
   * 事件监听
   */
  private eventsMap: Record<string, IFn[]>
  /**
   * 是否立即触发事件, 默认 true
   */
  private immediate: boolean;

  constructor (options: IEventHubOptions = { immediate: true }) {
    this.eventsMap = {};
    this.immediate = options.immediate || false
  }
  /**
   * 监听事件
   * @param eventName 事件名称
   * @param callback 回调
   */
  on(eventName: TName, callback: IFn) {
    if (!this.eventsMap[eventName]) {
      this.eventsMap[eventName] = [];
    }
    this.eventsMap[eventName]!.push(callback);
  }

  /**
   * 监听一次事件: 事件触发后, 会自动取消监听
   * @param eventName 事件名称
   * @param callback 回调
   */
  once(eventName: TName, callback: IFn) {
    const onceCallback: IFn = async (...args: any[]) => {
      await callback(...args);
      this.off(eventName, onceCallback);
    }
    this.on(eventName, onceCallback);
  }

  /**
   * 取消监听事件
   * @param eventName 事件名称, 支持数组
   * @param callback 回调
   */
  off(eventName: TName | TName[], callback?: IFn) {
    const events = Array.isArray(eventName) ? eventName : [eventName];
    events.forEach(evtName => {
      if (!callback) {
        delete this.eventsMap[evtName]
        return;
      }
      if (!this.eventsMap[evtName]) {
        return;
      }
      const newCallbacks = this.eventsMap[evtName]!.filter(cb => cb !== callback);
      if (newCallbacks.length === 0) {
        delete this.eventsMap[evtName];
      } else {
        this.eventsMap[evtName] = newCallbacks;
      }
    });
  }
  
  /**
   * 触发事件, 依次执行所有监听事件, 返回最后一个事件的返回值
   *  仅可触发用户自定义事件, 不能触发系统事件
   * @param eventName 事件名称
   * @param args 参数
   */
  async emit(evtCfg: TName | IEventCfg<TName>, ...args: any[]) {
    const cfg = Object.assign(
      { immediate: this.immediate},
      is(evtCfg, 'string') ? { eventName: evtCfg } : evtCfg
    );

    if (!cfg.immediate) {
      // 等待下一个事件循环, 将 emit 的回调变为异步, 避免阻塞原任务处理
      await waitForINP();
    }
    const eventName = cfg.eventName;
    const callbacks = this.eventsMap[eventName]
    if (!callbacks || !callbacks.length) {
      // 开发环境下, 未监听的事件会有警告
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[eventHub] event "${eventName}" has no listeners`, ...args);
      }
      return;
    }
    // 开发环境下, 打印事件
    if (process.env.NODE_ENV === 'development') {
      console.log(`[eventHub] builtin ${eventName}`, ...args);
    }
    const resp: { isSuccessful: boolean, result?: any } = {
      isSuccessful: true,
    }

    for (const cb of callbacks) {
      try {
        resp.result = await cb(...args);
        resp.isSuccessful = true;
      } catch (error) {
        resp.isSuccessful = false;
        resp.result = error;
        console.error(`[eventHub] ${eventName} error:`, error);
      }
    }
    if (!resp.isSuccessful) {
      throw resp.result;
    }
    return resp.result;
  }
}

/**
 * 内部事件名称
 */
export type IEventName = BUILTIN_EVENT_NAMES | string;

/**
 * 内部事件前缀
 */
const RESTRICT_EVENTS = [ 'app:' ]

/**
 * app 使用的事件总线
 */
const eventHub = new EventHub<IEventName>({
  immediate: false,
});

export const innerEmit = eventHub.emit.bind(eventHub);

/**
 * 重新导出 app 对象使用的事件总线, 用于外部使用, 同时限制 emit 仅能触发用户自定义事件
 */
export const eventBus = {
  on: eventHub.on.bind(eventHub),
  once: eventHub.once.bind(eventHub),
  off: eventHub.off.bind(eventHub),
  emit:(evtCfg: string | IEventCfg<IEventName>, ...args: any[]) => {
    const eventName = is(evtCfg, 'string') ? evtCfg : evtCfg.eventName;
    if (RESTRICT_EVENTS.some(p => eventName.startsWith(p))) {
      throw new Error(`[eventBus] can not emit inner event: ${eventName}`);
    }
    return innerEmit(evtCfg, ...args);
  }
}