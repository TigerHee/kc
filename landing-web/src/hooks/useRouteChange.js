/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { useHistory } from 'react-router';
import { checkPageIsUseWs } from 'config';

let socket = null;

// 异步执行socket连接检测
const checkSocketConnect = (to, user, ws) => {
  if (!socket) {
    socket = ws.getInstance();
  }
  if (!user) {
    // 公有socket，在部分页面不使用
    if (!checkPageIsUseWs(to)) {
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

export default () => {
  const history = useHistory();
  const { user } = useSelector((state) => state.user);

  React.useEffect(() => {
    import('@kc/socket').then(ws => {
      checkSocketConnect(history.location.pathname, user, ws);
    });
    return () => {
      if (socket) {
        socket = null;
      }
    }
  }, [history.location.pathname, user]);
};
