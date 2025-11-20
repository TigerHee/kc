/**
 * Owner: jessie@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

// app 初始化hooks (包含)
const useAppInit = () => {
  const timerRef = useRef();
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();

  // 如果在app内，从app登录返回时，应再次触发init，获取登录信息
  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });
    }
  }, [dispatch, isInApp]);

  // 页面加载完调用onPageMount，可用来计算加载时长
  useEffect(() => {
    if (isInApp) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'onPageMount',
            dclTime: window.DCLTIME,
            pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
          },
        });
      }, 200);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isInApp]);
};

export default useAppInit;
