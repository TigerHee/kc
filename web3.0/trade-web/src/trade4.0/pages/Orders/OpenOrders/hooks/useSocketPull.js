/*
 * @Owner: jessie@kupotech.com
 */
import { useEffect } from 'react';
import {
  useThrottleListData,
  useThrottleSummary,
} from '@/pages/Orders/Common/hooks/useThrottleListData';
import { useDispatch } from 'dva';
import { evtEmitter } from 'helper';

const eventName = 'order.update';
const summaryEventName = 'order.summary.update';

export const event = evtEmitter.getEvt('ORDER_SOCKET');
export const pullOrderCurrent = (type) => event.emit(eventName, { type });
export const pullSummary = () => event.emit(summaryEventName);
export const useSocketPull = () => {
  const dispatch = useDispatch();
  const throttleCurrentFx = useThrottleListData(dispatch, 'orderCurrent');
  const throttleAdvanceFx = useThrottleListData(dispatch, 'orderStop');
  const throttleSummary = useThrottleSummary(dispatch);
  // 订单
  useEffect(() => {
    const handle = ({ type }) => {
      if (type === 'orderCurrent') {
        throttleCurrentFx();
      } else {
        throttleAdvanceFx();
      }
    };
    event.on(eventName, handle);
    return () => event.off(eventName, handle);
  }, []);

  // summary
  useEffect(() => {
    const handle = () => {
      throttleSummary();
    };
    event.on(summaryEventName, handle);
    return () => event.off(summaryEventName, handle);
  }, []);
};
