/*
 * @owner: borden@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { trackClick } from 'utils/ga';
import { isFromTMA } from 'utils/tma/isFromTMA';

export default function useLoginDrawer() {
  const dispatch = useDispatch();
  const isXKucoin = isFromTMA(); // 是否在xkucoin里
  const isLogin = useSelector((state) => state.user.isLogin);

  const open = useCallback(() => {
    try {
      const postMessage = window?.parent?.bridge?.postMessage;
      if (isXKucoin && postMessage) {
        postMessage({
          action: 'login',
        });
      } else {
        dispatch({
          type: 'app/update',
          payload: {
            open: true,
          },
        });
      }
      trackClick(['login', '1']);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  }, [isXKucoin]);

  return { open, isLogin };
}
