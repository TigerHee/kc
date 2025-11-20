/**
 * Owner: mike@kupotech.com
 */
import { useEffect, useRef } from 'react';
import { countDownSeconds } from 'Bot/config';
import { useSelector } from 'dva';

const mergeDFT = (outOptions) => {
  const deft = {
    immediately: true,
    isTriggerByLogin: true,
    timer: countDownSeconds,
    isTrigger: true,
  };
  return Object.assign(deft, outOptions);
};
export default (callback = () => {}, options = {}) => {
  options = mergeDFT(options);
  const {
    immediately, // 是否立即首次触发
    // timer = countDownSeconds, // 轮训时间
    // isTrigger = true, // 轮训开关
    isTriggerByLogin, // 轮训开关是否被登录态控制
    timer,
  } = options;
  let { isTrigger } = options;
  const isLogin = useSelector((state) => state.user.isLogin);
  isTrigger = isTriggerByLogin ? isTrigger && isLogin : isTrigger;
  const ticker = useRef();
  const cancelTick = () => {
    clearInterval(ticker.current);
    ticker.current = null;
  };
  useEffect(() => {
    // 是否初始化就发起一个 相当于开关，设计在这里是因为 hooks不能放在判断中
    if (isTrigger) {
      if (immediately) {
        callback();
      }
      ticker.current = setInterval(() => {
        callback();
      }, timer);
    }
    return cancelTick;
  }, [callback, timer, isTrigger]);

  return cancelTick;
};
