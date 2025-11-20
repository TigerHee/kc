/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect } from 'react';
import { trackClick } from 'src/utils/ga';
import { inputEventNotify, clickEventNotify } from '@/utils/voice/trigger';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { isFromTMA } from 'utils/tma/isFromTMA';

export default (props) => {
  const { open, isLogin } = useLoginDrawer();

  useEffect(() => {
    // 注册click事件
    document.body.addEventListener('click', handleClick, true);
    // 注册input事件
    document.body.addEventListener('input', inputEventNotify, true);
  }, []);

  const handleClick = useMemoizedFn((e) => {
    if (e?.target) {
      if (!isLogin) {
        if (e.target.getAttribute('data-key') === 'login') {
          open();
          trackClick(['login', '1']);
        } else if (e.target.getAttribute('data-key') === 'register') {
          try {
            const postMessage = window?.parent?.bridge?.postMessage;
            if (isFromTMA() && postMessage) {
              if (e?.preventDefault && e?.stopPropagation) {
                e.preventDefault();
                e.stopPropagation();
              }
              postMessage({
                action: 'register',
              });
            }
            trackClick(['register', '1']);
          } catch (error) {
            console.error('Failed to register:', error);
          }
        }
      }
      clickEventNotify(e.target);
    }
  });

  return <React.Fragment>{props.children}</React.Fragment>;
};
