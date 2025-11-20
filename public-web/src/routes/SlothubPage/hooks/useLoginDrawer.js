/*
 * @owner: borden@kupotech.com
 */
import * as tma from '@kc/telegram-biz-sdk';
import JsBridge from '@knb/native-bridge';
import { useDispatch } from 'dva';
import { useCallback } from 'react';
import { useSelector } from 'src/hooks/useSelector';

export default function useLoginDrawer() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const open = useCallback(() => {
    if (JsBridge.isApp()) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/login',
        },
      });
    } else if (tma.bridge.isTMA()) {
      tma.actions.accountLanding();
    } else {
      dispatch({
        type: 'entranceDrawer/update',
        payload: {
          loginOpen: true,
        },
      });
    }
  }, []);

  return { open, isLogin };
}
