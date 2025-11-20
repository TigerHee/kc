/*
 * @owner: borden@kupotech.com
 * @desc: session自动续期
 *    session过期时间是4小时，期间有私有接口请求会自动续期，最长是7天。
 *    如果没有私有接口发出，4小时后不操作确实会过期。
 *    在用户登录态拿到某个时间后，会重新拉取user-info接口，以防止session过期
 */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';

// 3小时
const TIMEOUT = 3 * 60 * 60 * 1000;

export default function useRenewalSession() {
  const timer = useRef(null);
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.user.isLogin);

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (isLogin) {
      timer.current = setInterval(() => {
        dispatch({ type: 'user/renewalSession' });
      }, TIMEOUT);
    } else {
      clearTimer();
    }
  }, [isLogin]);
}
