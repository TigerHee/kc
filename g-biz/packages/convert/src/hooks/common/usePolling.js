/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useEventCallback } from '@kux/mui';

/**
 * 通过 model efffect 轮训拉取后端接口
 * @param {String} pullEffectName 拉取后端接口的 effect
 * @param {String} registerEffectName 注册轮训的 effect
 */
const usePolling = (pullEffectName, registerEffectName) => {
  const dispatch = useDispatch();
  const pollingRef = useRef(false);
  const isRunningRef = useRef(false);
  const preInterval = useRef();

  const refresh = useEventCallback((payload) => {
    dispatch({ type: `${pullEffectName}@polling:cancel` });
    dispatch({
      type: `${pullEffectName}@polling`,
      payload,
    });
    isRunningRef.current = true;
  });

  const run = useEventCallback((payload, interval) => {
    if (!pollingRef.current) {
      preInterval.current = interval;
      dispatch({
        interval,
        type: registerEffectName,
      }).then(() => {
        refresh(payload);
        pollingRef.current = true;
      });
    } else if (preInterval.current && interval && preInterval.current !== interval) {
      preInterval.current = interval;
      dispatch({ type: `${pullEffectName}@polling:cancel` });
      dispatch({
        type: `${pullEffectName}@polling:options`,
        payload: (v) => ({ ...v, interval }),
      });
      refresh(payload);
    } else {
      refresh(payload);
    }
  });

  const onlyCancel = useEventCallback(() => {
    dispatch({ type: `${pullEffectName}@polling:cancel` });
  });

  const cancel = useEventCallback(() => {
    onlyCancel();
    isRunningRef.current = false;
  });

  return {
    run,
    cancel,
    refresh,
    onlyCancel,
    isRunning: isRunningRef.current,
  };
};

export default usePolling;
