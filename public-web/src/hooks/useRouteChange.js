/**
 * Owner: willen@kupotech.com
 */
import { nowPageUseWs } from 'config/base';
import React from 'react';

import { useLocation } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
// import { checkVersionReload } from 'services/version';
import Report from 'tools/ext/kc-report';
import initSocket from 'tools/initSocket';
import usePrevious from './usePrevious';

const getFullURL = (pathname) => {
  // const { origin, pathname } = window.location;
  if (pathname) {
    return `${window.location.origin}${pathname}`;
  }
  return window.location.href;
};

// 异步执行socket连接检测
const checkSocketConnect = async (to, user) => {
  await initSocket();
  const ws = await import('@kc/socket');
  const socket = ws.getInstance();
  if (!user) {
    // 公有socket，在部分页面不使用
    if (!nowPageUseWs(to)) {
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
  const location = useLocation();
  const prevLocation = usePrevious(location);

  const enterTime = React.useRef(null);
  const { user } = useSelector((state) => state.user);

  const reportStayTime = React.useCallback(() => {
    if (!enterTime.current) {
      enterTime.current = Date.now();
    } else {
      const stayTime = Date.now() - enterTime.current;
      Report.logStay(getFullURL(prevLocation.pathname), stayTime);
      enterTime.current = null;
    }
  }, [prevLocation]);

  React.useEffect(() => {
    reportStayTime();
  }, [reportStayTime]);

  React.useEffect(() => {
    // checkVersionReload();
    window.scrollTo(0, 0);
    Report.logAction(getFullURL(location.pathname), 'view');
  }, [location.pathname]);

  React.useEffect(() => {
    checkSocketConnect(location.pathname, user);
  }, [location.pathname, user]);
};
