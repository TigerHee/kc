/**
 * Owner: borden@kupotech.com
 */
/**
 * Created by chenlin on 2018/6/9.
 */
let listener = null;
const addEvent = ((window) => {
  const eventCompat = (event) => {
    const type = event.type;
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
      event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
    }
    if (event.srcElement && !event.target) {
      event.target = event.srcElement;
    }
    if (!event.preventDefault && event.returnValue !== undefined) {
      event.preventDefault = () => {
        event.returnValue = false;
      };
    }
    return event;
  };
  if (window.addEventListener) {
    return (el, type, fn, capture) => {
      if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll';
      }
      listener = (event) => {
        fn.call(this, eventCompat(event));
      };
      el.addEventListener(type, listener, capture || false);
    };
  } else if (window.attachEvent) {
    return (el, type, fn) => {
      listener = (event) => {
        event = event || window.event;
        fn.call(el, eventCompat(event));
      };
      el.attachEvent(`on${type}`, listener);
    };
  }
  return () => { };
})(window);

const removeEvent = ((window) => {
  if (window.removeEventListener) {
    return (el, type, capture) => {
      if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll';
      }
      el.removeEventListener(type, listener, capture || false);
    };
  } else if (window.detachEvent) {
    return (el, type) => {
      el.detachEvent(`on${type}`, listener);
    };
  }
  return () => { };
})(window);

export { addEvent, removeEvent };
