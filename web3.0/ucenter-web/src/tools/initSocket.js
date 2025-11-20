/**
 * Owner: willen@kupotech.com
 */
import config from 'config';
import { checkWsConnectError } from 'tools/sentry';
const { v2ApiHosts } = config;
const _API_HOST = v2ApiHosts.WEB;

let inited = false;

// socket 执行时长 50ms 在 global.js 执行会阻塞页面渲染，封装 init 方法在这里在建立连接之前执行
export default async () => {
  if (!inited) {
    // init socket
    const isChrome = /chrome/i.test(navigator.userAgent || '');
    const useSlowFlush = /safari/i.test(navigator.userAgent || '') && !isChrome;
    if (useSlowFlush) {
      console.log('use slow ws flush');
    }

    const ws = await import('@kc/socket');
    const socket = ws.getInstance();
    socket.outerEmitter.on('onReconnectError', () => {
      checkWsConnectError();
    });
    ws.setDelay(useSlowFlush ? 1000 : 200);
    ws.setHost(_API_HOST);

    /** ws debug output */
    window._x_ws_debug = ws.debug;

    inited = true;
  }
};
