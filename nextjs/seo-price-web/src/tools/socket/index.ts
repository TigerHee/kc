/**
 * Owner: will.wang@kupotech.com
 */
import initSocket from '@/tools/socket/initSocket';
import { find, includes } from 'lodash-es';

export const noWsPageList = ['/news', '/ucenter'];

// 当前页面是否使用socket
export const nowPageUseWs = (pageUrl = '') => {
  // 校验当前页面是否使用socket
  const nowPageUrl = pageUrl || window.location.href || '';
  const _find = find(noWsPageList, (item) => includes(nowPageUrl, item));
  return !_find;
};


// user 用户信息
export const checkSocketConnect = async (pageUrl: string, user?: any) => {
  await initSocket();
  const ws = await import('@kc/socket');
  const socket = ws.getInstance();
  if (!user) {
    // 公有socket，在部分页面不使用
    if (!nowPageUseWs(pageUrl)) {
      if (socket.connected() && socket.socket) {
        // 断开无用连接
        socket.socket.disconnect();
      }
      return;
    }
  }
  // socket连接，公有/私有，先检查是否已经连接socket
  if (!socket.connected()) {
    // 未连接，开始连接
    const { uid = '' } = user || {};
    socket.connect({
      sessionPrivate: !!user,
      uid: uid || '',
    });
  }
};