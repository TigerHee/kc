/**
 * Owner: lucas.l.lu@kupotech.com
 * telegram 相关的工具函数
 */
/**
 * tma 应用中会写入 bridge 对象
 * @return {{
 *   isTMA?: boolean,
 * }}
 */
export function getBridge() {
  return window.parent?.bridge;
}

export function isTMA() {
  const bridge = getBridge();

  if (!bridge) {
    return false;
  }

  return !!bridge.isTMA;
}
