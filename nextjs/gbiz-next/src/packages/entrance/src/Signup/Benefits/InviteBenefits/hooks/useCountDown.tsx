/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/hooks/biz/userNewCustomerTask/useLimitTask.js
 */
import { useMemo } from 'react';
import { useInviteBenefits } from '../store';

export const useCountDown = () => {
  const taskList = useInviteBenefits().taskList;
  const { tempTask: limitTask, now } = taskList || {};
  const { taskStartTime = 0, taskEndTime = 0 } = limitTask || {};
  const inRange = typeof now === 'number' && now >= taskStartTime && now <= taskEndTime;

  const data = useMemo(() => {
    return {
      leftTime:
        taskEndTime === 0
          ? 0
          : inRange
          ? taskEndTime - now
          : typeof now === 'number' && now <= taskStartTime
          ? taskStartTime - now
          : 0,
      taskStartTime,
      taskEndTime,
      now,
      inRange,
      isExpired: typeof now === 'number' && now > taskEndTime,
      isStart: typeof now === 'number' && now > taskStartTime,
    };
  }, [taskEndTime, inRange, now, taskStartTime]);

  return data;
};
