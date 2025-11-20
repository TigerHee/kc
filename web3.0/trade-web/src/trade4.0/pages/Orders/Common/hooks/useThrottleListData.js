/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-28 15:56:25
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-07-18 16:36:21
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/hooks/useThrottleListData.js
 * @Description:
 */
import { useCallback } from 'react';
import { throttle } from 'lodash';

export const useThrottleListData = (dispatch, namespace = '') => {
  const _throttleData = useCallback(
    (payload = {}) => {
      if (!namespace) return;
      dispatch({
        payload,
        type: `${namespace}/filter`,
      });
    },
    [dispatch, namespace],
  );
  return throttle(
    () => {
      _throttleData({
        triggerMethod: 'socket',
      });
    },
    5000,
    {
      leading: true, // 开始时立刻执行一次
      trailing: true, // 结束时立刻执行一次
    },
  );
};

export const useThrottleSummary = (dispatch) => {
  return throttle(
    () => {
      dispatch({
        type: 'orderCurrent/queryOrdersSummary',
      });
    },
    5000,
    {
      leading: true, // 开始时立刻执行一次
      trailing: true, // 结束时立刻执行一次
    },
  );
};
