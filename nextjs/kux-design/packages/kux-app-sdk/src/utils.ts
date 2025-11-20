/**
 * noop function, for default callback
 */
export function noop () {}

/**
 * 全局对象
 */
export const globalObject =
  (
  (typeof global === "object" && global)
  || (typeof globalThis === 'object' && globalThis)
  || (typeof window === "object" && window)
  || (typeof self === "object" && self)
  || Function("return this")()) as (typeof global & Record<string, any>);

/**
 * 将查询查询字符串转换为json对象, **仅支持简单结构**
 * @description 获取queryString字符串转换为JSON对象
 * @param query 可选参数 无是自动获取浏览器后面的queryString
 * @returns parsed object
 */
export function searchToJson(query?: string) {
  let search = query || '';
  if (!search) {
    search = location.search.slice(1);
  } else {
    // remove hash
    search = String(search).split('#')[0]!;
    search = search.includes('?') ? search.split('?')[1]! : search;
  }
  search = search.trim();
  const temp: Record<string, string> = {};
  if (!search) return temp;
  try {
    search.split('&').forEach((item) => {
      if (!item) return;
      const [key, value] = item.split('=') as [string, string | undefined];
      temp[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    });
  } catch (e) {
    console.warn('[searchToJson] failed to decode query string', e);
  }
  return temp;
}

/**
 * 比较版本号
 *  * a > b 返回 1
 *  * a = b 返回 0
 *  * a < b 返回 -1
 *
 * 该方法只能比较简单的版本号，不支持复杂的版本号比较
 *  * 版本长度不一致的
 *  * 版本号中包含非数字字符(beta, alpha等)
 */
export function compareVersion(a: string, b: string) {
  return String(a).localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

// 避免在 ssr 环境下使用 requestAnimationFrame 未定义问题
const onIdle = globalObject.requestAnimationFrame || globalObject.setTimeout;

/**
 * 等待INP（Interaction to Next Paint）事件
 * ref: https://github.com/vercel-labs/await-interaction-response
 * blog: https://vercel.com/blog/demystifying-inp-new-tools-and-actionable-insights
 */
export function waitForINP() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100); // Fallback for the case where the animation frame never fires.
    onIdle(() => {
      setTimeout(resolve, 0);
    });
  });
}

const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Deep compare two values
 */
export function isDeepEqual(a: any, b: any) {
  if (a === b) return true;
  // for NaN
  if (a !== a && b !== b) return true;
  if (a == null || b == null) return false;
  const constructor = a.constructor;
  if (constructor !== b.constructor || constructor === Function) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (constructor === Set) {
    if (a.size !== b.size) return false;
    for (const value of a) {
      if (!b.has(value)) return false;
    }
    return true;
  }
  if (constructor === Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !isDeepEqual(value, b.get(key))) return false;
    }
    return true;
  }
  if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
    // @ts-expect-error a and b are TypedArray
    let length = a.length;
    // @ts-expect-error a and b are TypedArray
    if (length !== b.length) return false;
    // Compare the contents byte by byte
    for (let i = 0; i < length; i++) {
      // @ts-expect-error a and b are TypedArray
      if (a[i] !== b[i]) return false;
    }
    // If no differences found
    return true;
  }
  if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
  if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (const key in a) {
    if (
      !hasOwn.call(b, key) ||
      !isDeepEqual(a[key], b[key])
    )
      return false;
  }
  return true;
}

let cachedQuery: Record<string, any> = {};
let lastSearch = '';

/**
 * 获取当前地址栏url中的查询参数
 */
export function param(): Record<string, string>
export function param(key: string): string | undefined
export function param(key?: string): Record<string, string> | string | undefined {
  // 兼容SSR
  if ((globalObject.location && globalObject.location.search !== lastSearch)) {
    lastSearch = globalObject.location.search;
    cachedQuery = searchToJson(globalObject.location.search);
  }
  if (key) {
    return cachedQuery[key];
  }
  return {...cachedQuery};
}
