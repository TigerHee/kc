import { type ReactNode, isValidElement, Children } from 'react'
/**
 * 挑选对象的属性, 返回新对象
 * @param obj 对象
 * @param keys key数组
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: any = {}
  keys.forEach(key => {
    if (obj[key] !== undefined) {
      result[key] = obj[key]
    }
  })
  return result
}


/**
 * 获取对象的属性, 支持 keyPath 形式的路径, 若路径不存在则返回 undefined
 * @param obj 对象
 * @param keyPath key路径, 如: 'a.b.c', 'a.0.c'. 数组下标用数字表示
 */
export function getProp(obj: Record<string, any>, keyPath: string) {
  const keys = keyPath.split('.')
  let result = obj
  for (const key of keys) {
    if (!result || typeof result !== 'object') {
      return
    }
    result = result[key]
  }
  return result
}

export function debounce(func: Function, wait: number = 100) {
  let timeout: any
  return function (...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 从 ReactNode 中提取文本内容
 */
export function extractTextFromNode(node: ReactNode): string {
  if (app.is(node, 'nullable')) return '';
  if (typeof node !== 'object') return String(node);
  let text = '';
  Children.forEach(node, child => {
    if (typeof child === 'string') {
      text += child;
    } else if (isValidElement(child)) {
      // Recursively process child elements
      text += extractTextFromNode(child.props.children);
    }
  });
  return text;
}

/**
 * promise delay
 * @param wait ms
 */
export function delay(wait = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  })
}

/**
 * requestIdleCallback with setTimeout fallback
 */
export const onIdle = app.global.requestIdleCallback || app.global.setTimeout;

/**
 * 判断val在 react 中是否会被渲染
 */
export function isRenderable(val: any) {
  return !(app.is(val, 'nullable') || val === '' || app.is(val, 'boolean'));
}

export const DIR_ATTRIBUTE_NAME = 'dir';

export type IDir = 'rtl' | 'ltr';

export function getDocumentDir(): IDir {
  // 兼容SSR, server 环境中使用 app.isRTL 判断
  if (!app.global.document) return app.isRTL ? 'rtl' : 'ltr';
  return document.documentElement.getAttribute(DIR_ATTRIBUTE_NAME) as IDir || 'ltr';
}

/**
 * 将字符串中间截断为带省略号形式，如：abcdefg → ab…fg
 * @param str 原始字符串
 * @param maxLen 显示最大长度（包含省略号）
 */
export function middleEllipsis(str: string, maxLen: number): string {
  if (!str || str.length <= maxLen) return str;
  const ellipsis = '…';
  if (maxLen <= 3) return ellipsis; // 最少保留“...”

  const partLen = Math.floor((maxLen - 1) / 2);
  const start = str.slice(0, partLen);
  const end = str.slice(-partLen);

  return `${start}${ellipsis}${end}`;
}
