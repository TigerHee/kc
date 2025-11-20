/**
 * Owner: terry@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import remoteEvent from '@tools/remoteEvent';
import { compliantHelper } from './compliantHelper';
import remoteEventLocal from './remoteEvent';

// 执行主逻辑
main();

function listenRoute() {
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function pushState(...args) {
    // 这里需要等originalPushState执行完毕，才能拿到最新的pathname
    const result = originalPushState.apply(this, args);
    compliantHelper.checkPageForbidden();
    return result;
  };

  window.history.replaceState = function replaceState(...args) {
    // 这里需要等originalReplaceState执行完毕，才能拿到最新的pathname
    const result = originalReplaceState.apply(this, args);
    compliantHelper.checkPageForbidden();
    return result;
  };
}

function listenEvents() {
  const inApp = JsBridge.isApp();
  // App 中存在登录后不刷新页面行为，但是会触发一个 onLogin 事件
  if (inApp) {
    JsBridge.listenNativeEvent.on('onLogin', () => {
      compliantHelper.init();
    });
  } else {
    // 监听部分项目如果没有刷新，但是依赖了 g-biz setCsrf 回调的情况
    remoteEvent.on(remoteEvent.evts.ON_GET_CSRF, () => {
      compliantHelper.init();
    });
  }
}

export function main() {
  // ssr server模式不执行
  if (typeof window === 'undefined') return;
  // 保证只有一边的gbiz在执行
  if (!window.__COMPLIANCE_START__) {
    window.__COMPLIANCE_START__ = true;
    window.__COMPLIANCE_EVENT = remoteEventLocal;
    compliantHelper.init();
    listenRoute();
    listenEvents();
  }
}
