/**
 * Owner: jessie@kupotech.com
 */

export function isFromTMA() {
  return !!window?.parent?.bridge?.isTMA;
}
