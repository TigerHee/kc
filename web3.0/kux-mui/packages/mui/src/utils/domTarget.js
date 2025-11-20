/**
 * Owner: victor.ren@kupotech.com
 */
export default function getTargetElement(target, defaultElement) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!target) {
    return defaultElement;
  }

  let targetElement;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
