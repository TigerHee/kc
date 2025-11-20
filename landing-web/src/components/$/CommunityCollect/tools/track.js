/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function getDomDataByKey(target, key) {
  if (!target) {
    console.warn('请传入 dom 对象')
    return '';
  }

  if (target.dataset) {
    return target.dataset[key];
  }

  return target.getAttribute(`data-${key}`);
}

export function track() {
  let _observer = null;

  function getObserver() {
    return _observer;
  }

  function createObserver(callback, options = {}) {
    const _options = {
      // element object, default is browser viewport
      root: null,
      rootMargin: '0px',
      /**
       * @type {0 | 0.25 | 0.75 | 1}
       */
      threshold: 0,
      ...(options || {}),
    }
    _observer = new IntersectionObserver(callback, _options);
  }

  function destroyObserver() {
    if (_observer) {
      _observer.disconnect();
      _observer = null;
    }
  }

  return {
    getObserver,
    createObserver,
    destroyObserver,
  };
}
