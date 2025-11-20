/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/hooks/biz/userNewCustomerTask/useLimitTask.js
 */
import { useMemo } from 'react';
import { useCtx } from '../components/Context';

export const useCountDown = () => {
  const { taskList } = useCtx();
  const { tempTask: limitTask, now } = taskList || {};
  const { taskStartTime = 0, taskEndTime = 0 } = limitTask || {};
  const inRange = now >= taskStartTime && now <= taskEndTime;

  const data = useMemo(() => {
    return {
      leftTime:
        taskEndTime === 0
          ? 0
          : inRange
          ? taskEndTime - now
          : now <= taskStartTime
          ? taskStartTime - now
          : 0,
      taskStartTime,
      taskEndTime,
      now,
      inRange,
      isExpired: now > taskEndTime,
      isStart: now > taskStartTime,
    };
  }, [taskEndTime, inRange, now, taskStartTime]);

  return data;
};
