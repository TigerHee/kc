/**
 * @owner: vijay.zhou@kupotech.com
 * @description: 用于拦截浏览器历史记录的钩子，仅适用于 spa 模式
 */
import { useContext, useEffect, useRef } from 'react';
import { UNSAFE_NavigationContext, resolvePath, useLocation } from 'react-router-dom';

const useHistoryBlocker = (blocker, when = true) => {
  const navigationContext = useContext(UNSAFE_NavigationContext);
  const navigator = navigationContext?.navigator;
  const location = useLocation();
  const lastLocationRef = useRef(location);
  const skipRef = useRef(false);

  useEffect(() => {
    lastLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!when || !navigator) {
      return;
    }

    if (typeof navigator.block === 'function') {
      const unblock = navigator.block((tx) => {
        const retry = () => {
          unblock();
          tx.retry();
        };

        blocker({ ...tx, retry });
      });

      return unblock;
    }

    const originalPush = navigator.push.bind(navigator);
    const originalReplace = navigator.replace.bind(navigator);

    const createLocation = (to, state) => {
      if (to == null) {
        return lastLocationRef.current;
      }
      if (typeof to === 'number') {
        return lastLocationRef.current;
      }
      const resolved = resolvePath(to, lastLocationRef.current);
      return {
        pathname: resolved.pathname,
        search: resolved.search,
        hash: resolved.hash,
        state,
        key: Math.random().toString(36).slice(2, 10),
      };
    };

    const wrap = (action, original) => {
      return (...args) => {
        if (skipRef.current) {
          return original(...args);
        }
        const [to, state] = args;
        const nextLocation = createLocation(to, state);
        const retry = () => {
          skipRef.current = true;
          original(...args);
          skipRef.current = false;
        };
        blocker({ action, location: nextLocation, retry });
      };
    };

    navigator.push = wrap('PUSH', originalPush);
    navigator.replace = wrap('REPLACE', originalReplace);

    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [navigator, blocker, when]);
};

export default useHistoryBlocker;

