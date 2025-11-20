/**
 * Owner: garuda@kupotech.com
 */
/**
 * 该 hooks 用来监控页面是否可见 以及 页面不可见的累积时间
 */
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'dva';

import { debounce } from 'lodash';

import lifeCycle from 'page-lifecycle';

import { PAGE_ACTIVE, PAGE_PASSIVE, PAGE_NEED_RESET } from '@/meta/const';


const PAGE_VISIBLE = [PAGE_ACTIVE, PAGE_PASSIVE];
const DELAY_TIMER = 100;
let timer = null;
const LOOP_TIMER = 10000; // 间隔时间 10s
const LOOP_END_TIMER = 30000; // 不再累积的时间 30s

const useWatchPageHidden = () => {
  const dispatch = useDispatch();
  const pageHidden = useSelector((state) => state.futuresCommon.pageHidden);

  const onPageStateChange = debounce((event) => {
    if (event) {
      const { newState } = event;
      if (PAGE_NEED_RESET.includes(newState)) {
        dispatch({
          type: 'futuresCommon/update',
          payload: {
            pageHidden: true,
          },
        });
      } else if (PAGE_VISIBLE.includes(newState)) {
        dispatch({
          type: 'futuresCommon/update',
          payload: {
            pageHidden: false,
            pageExpiredTimer: false,
          },
        });
      }
    }
  }, DELAY_TIMER);

  // 监控页面不可见的累积时间, 累加 LOOP_END_TIMER 之后 倒计时停止
  useEffect(() => {
    if (pageHidden) {
      let countTime = 0;
      timer && clearInterval(timer);
      timer = setInterval(() => {
        countTime += LOOP_TIMER;
        if (countTime >= LOOP_END_TIMER) {
          clearInterval(timer);
          timer = null;
          dispatch({ type: 'futuresCommon/update', payload: { pageExpiredTimer: true } });
        }
      }, LOOP_TIMER);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [dispatch, pageHidden]);

  useEffect(() => {
    lifeCycle.addEventListener('statechange', onPageStateChange, false);
    return () => {
      lifeCycle.removeEventListener('statechange', onPageStateChange, false);
    };
  }, [onPageStateChange]);
};

export default useWatchPageHidden;
