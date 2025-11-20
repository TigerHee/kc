/**
 * Owner: victor.ren@kupotech.com
 */
import ResizeObserver from 'resize-observer-polyfill';

const elementListeners = new Map();

function onResize(entities) {
  entities.forEach((entity) => {
    const { target } = entity;
    elementListeners.get(target)?.forEach((listener) => listener(target));
  });
}

const resizeObserver = new ResizeObserver(onResize);

export function observe(element, callback) {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Set());
    resizeObserver.observe(element);
  }

  elementListeners.get(element).add(callback);
}

export function unobserve(element, callback) {
  if (elementListeners.has(element)) {
    elementListeners.get(element).delete(callback);
    if (!elementListeners.get(element).size) {
      resizeObserver.unobserve(element);
      elementListeners.delete(element);
    }
  }
}
