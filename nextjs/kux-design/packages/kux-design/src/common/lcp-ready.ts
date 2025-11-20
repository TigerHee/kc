
interface IWaitLCPOptions  {
  /**
   * 最大等待时间（默认 5000ms）
   */
  timeout?: number
}

let cachedPromise: Promise<void> | null = null
let isResolved = false

const isSupportPerformanceLCP = !(typeof PerformanceObserver === 'undefined' ||
typeof PerformanceObserver.supportedEntryTypes === 'undefined' ||
!PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint'))

/**
 * 等待 LCP（Largest Contentful Paint）就绪, 用于优化页面性能。
 * @description 该函数会等待页面的 LCP 事件触发，或者在指定的超时时间(默认5s)内完成。
 * @example
 *  比如首页首屏有lottie动画时, 需要等到页面LCP就绪后再渲染动画, 否则影响页面LCP数值
 */
export function waitLCPReady(options?: IWaitLCPOptions): Promise<void> {
  if (isResolved) return Promise.resolve()
  if (cachedPromise) return cachedPromise
  const timeout = options?.timeout || 5000

  // 检测浏览器是否已经触发过 LCP 事件
  // 如果浏览器支持 PerformanceObserver 且已经有 LCP 事件记录，则直接返回已解析的 Promise
  if (isSupportPerformanceLCP) {
    if (performance.getEntriesByType('largest-contentful-paint').length > 0) {
      isResolved = true
      return Promise.resolve()
    }
  } else {
    if (
      typeof document !== 'undefined' &&
      (document.readyState === 'complete' || document.readyState === 'interactive') &&
      performance.now() > timeout
    ) {
      // 如果不支持 PerformanceObserver 且文档已加载，则直接返回已解析的 Promise
      isResolved = true
      return Promise.resolve()
    }
  }

  cachedPromise = new Promise<void>((resolve) => {
    const done = () => {
      if (!isResolved) {
        isResolved = true
        resolve()
      }
    }

    // 不支持 PerformanceObserver 的情况
    if (!isSupportPerformanceLCP) {
      setTimeout(done, timeout)
      return
    }

    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByType('largest-contentful-paint')
        if (entries.length > 0) {
          observer.disconnect()
          done()
        }
      })

      observer.observe({ type: 'largest-contentful-paint', buffered: true })

      setTimeout(() => {
        observer.disconnect()
        done()
      }, timeout)
    } catch {
      setTimeout(done, timeout)
    }
  })

  return cachedPromise
}
