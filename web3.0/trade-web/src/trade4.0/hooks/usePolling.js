/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useDispatch } from 'dva';
import { useRef, useCallback } from 'react';

/**
 * 通过 model efffect 轮训拉取后端接口
 * @param {String} pullEffectName 拉取后端接口的 effect
 * @param {String} registerEffectName 注册轮训的 effect
 * @example const { startPolling, cancelPolling } = usePolling('user_assets/pullTradeAccountCoins', 'user_assets/registerTradeAccountPolling')
 * startPolling({})
 */
const usePolling = (pullEffectName, registerEffectName) => {
  const dispatch = useDispatch();
  const pollingRef = useRef(false);

  const fetchData = useCallback(
    (payload) => {
      dispatch({
        type: `${pullEffectName}@polling`,
        payload,
      });
    },
    [pullEffectName],
  );

  const startPolling = useCallback(
    (payload) => {
      if (!pollingRef.current) {
        dispatch({
          type: registerEffectName,
        }).then(() => {
          fetchData(payload);
          pollingRef.current = true;
        });
      } else {
        fetchData(payload);
      }
    },
    [registerEffectName, fetchData],
  );

  const cancelPolling = useCallback(() => {
    dispatch({ type: `${pullEffectName}@polling:cancel` });
  }, [pullEffectName]);

  return {
    startPolling,
    cancelPolling,
    fetchData,
  };
};

export default usePolling;
