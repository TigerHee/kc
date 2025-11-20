/**
 * Owner: iron@kupotech.com
 */
/** 进入页面
 *  load 事件，首次进入刷新进入
 *  页面跳转事件 pushstate replacestate
 *  前进后端按钮事件 popstate
 */

/** 离开页面
 *  beforeunload 事件，关闭窗口，刷新离开
 *  页面跳转 pushstate replacestate
 *  前进后退按钮 popstate
 */

// 封装页面进入事件
import EventEmitter from './EventEmitter';

// FireFox 中， 离开站点会触发 beforeunload, 也会触发 visibilitychange 记录上报状态，避免重复上报

let reportedByUnload = false;

const pageEvent = new EventEmitter();

// 重写 history api 实现 pushstate 事件， replacestate 事件
function wrap(type) {
  const origin = window.history[type];

  return function (...rest) {
    const rv = origin.apply(this, rest);
    const e = new window.Event(type.toLowerCase());
    e.arguments = rest;
    window.dispatchEvent(e);
    return rv;
  };
}

window.history.pushState = wrap('pushState');
window.history.replaceState = wrap('replaceState');

window.addEventListener('load', (event) => {
  pageEvent.emit('$enter', event);
});
window.addEventListener('beforeunload', (event) => {
  reportedByUnload = true;
  pageEvent.emit('$leave', event);
});
// 兼容 safari < 14 使用 document.addEventListener 绑定
document.addEventListener('visibilitychange', (event) => {
  if (document.visibilityState === 'visible') {
    pageEvent.emit('$enter', event);
  }

  if (document.visibilityState === 'hidden') {
    if (!reportedByUnload) {
      pageEvent.emit('$leave', event);
    }
  }
});

const historyEvents = ['pushstate', 'popstate', 'replacestate'];

historyEvents.forEach((name) => {
  window.addEventListener(name, (event) => {
    pageEvent.emit('$leave', event);
    pageEvent.emit('$enter', event);
  });
});

export default pageEvent;
