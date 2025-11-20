/**
 * IntersectionObserverManager
 * * 只使用一个 IntersectionObserver 实例，管理多个目标元素的交叉观察
 * * 若不支持 IntersectionObserver，则直接触发回调
 * * 默认使用 shared 实例, 用于全局共享(threshold: 0.1)
 * * 若有特殊需求, 可以自行创建实例
 */

/**
 * 交叉观察的回调
 * @param isIntersecting 是否交叉
 */
export type IntersectionCallback = (isIntersecting: boolean) => void;

// 全局共享的 IntersectionObserverManager 实例
let sharedManager: IntersectionObserverManager | null = null;

/**
 * 是否支持 IntersectionObserver
 * * Map, Set, WeakMap, 兼容性均优于 IntersectionObserver, 故仅检测 IntersectionObserver
 */
const isSupported = !!app.global.IntersectionObserver

export class IntersectionObserverManager {
  private observer: IntersectionObserver | null;
  // 保存每个目标元素的监听器(可能对同一个元素添加多个监听器)
  private targets: Map<Element, Set<IntersectionCallback>>;
  // 保存每个目标元素的交叉状态, 用于在添加监听时立即触发回调
  // 弱引用, 防止内存泄漏
  private intersectionStates: WeakMap<Element, boolean>;
  // 保存配置, 便于重新初始化
  private observerOptions: IntersectionObserverInit | undefined;
  constructor(options?: IntersectionObserverInit) {
    this.observerOptions = options;
    this.targets = new Map();
    this.intersectionStates = new WeakMap();
    // 没有目标元素时, 不初始化 IntersectionObserver
    this.observer = null;
  }

  /**
   * 处理交叉观察的回调
   */
  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const listeners = this.targets.get(entry.target);
      if (!listeners) return
      const isIntersecting = entry.isIntersecting;
      this.intersectionStates.set(entry.target, isIntersecting);
      listeners.forEach((listener) => listener(isIntersecting));
    });
  }

  // 初始化 IntersectionObserver
  private ensureObserver() {
    if (!this.observer && isSupported) {
      this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.observerOptions);
    }
  }

  /**
   * 观察目标元素, 并提供回调; 返回一个函数，用于停止观察
   * @param target 观察的目标元素
   * @param callback 交叉观察的回调, 传入是否交叉
   * @returns 返回一个函数，用于停止观察
   */
  observe(target: Element, callback: IntersectionCallback): () => void {
    // 若不支持 IntersectionObserver, 则直接触发回调, 交叉状态为 true, 保证行为符合预期
    if (!isSupported) {
      callback(true);
      return () => {};
    }
    // 确保已经初始化 IntersectionObserver, 避免 disconnect 后无法重新 observe
    this.ensureObserver();
    // 确保统一个元素不会被多次 observe
    if (!this.targets.has(target)) {
      this.targets.set(target, new Set());
      this.observer?.observe(target);
    }

    const listeners = this.targets.get(target)!;
    // 保证同一个回调只监听一次
    if (!listeners.has(callback)) {
      listeners.add(callback);
    }

    // 存储过的交叉状态, 即已经监听过当前元素, 立即触发回调, 保证与 IntersectionObserver 行为一致
    if (this.intersectionStates.has(target)) {
      callback(this.intersectionStates.get(target)!);
    }

    return () => this.unobserve(target, callback);
  }

  /**
   * 取消监听目标元素
   * @param target 元素
   * @param callback 监听的回调
   */
  unobserve(target: Element, callback: IntersectionCallback): void {
    // 不支持 或者 目标元素不存在时, 直接返回
    if (!isSupported || !this.targets.has(target)) return;

    const listeners = this.targets.get(target)!;
    listeners.delete(callback);

    // 当前元素没有监听器时, 移除元素监听, 清理缓存的交叉状态
    if (listeners.size === 0) {
      this.targets.delete(target);
      this.intersectionStates.delete(target);
      this.observer?.unobserve(target);
    }

    // 没有监听任何元素时, 断开 IntersectionObserver
    if (this.targets.size === 0) {
      this.observer?.disconnect();
      // 释放资源, 标记已断开
      this.observer = null;
    }
  }

  /**
   * 提供一个计算(只读)属性，用于判断当前环境是否支持 IntersectionObserver
   */
  static get isSupported(): boolean {
    return isSupported;
  }

  /**
   * 默认的 IntersectionObserverManager 实例, 用于全局共享, 单例模式
   * * 默认交叉阈值为 10%
   */
  static get shared ()  {
    if (!sharedManager) {
      sharedManager = new IntersectionObserverManager({ threshold: 0.1 });
    }
    return sharedManager;
  }
}
