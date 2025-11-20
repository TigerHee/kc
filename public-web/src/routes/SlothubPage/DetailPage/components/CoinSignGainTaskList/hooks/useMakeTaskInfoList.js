/*
 * @Date: 2024-06-17 15:37:13
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-24 10:46:34
 */
import useRequest from 'hooks/useRequest';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { BACKEND_TASK_TYPE } from 'src/routes/SlothubPage/constant';
import { getLearnEarnJumpUrl } from 'src/services/slothub';
import { useStore } from '../../../store';
import { makeTaskInfoList } from '../constant';

export const useMakeTaskInfoList = () => {
  const { state } = useStore();
  const { projectDetail } = state;
  const { tasks, redemptionLimit, currency, id } = projectDetail || {};
  const categories = useSelector((state) => state.categories);
  const { currencyName = '' } = categories[currency] || {};
  const { runAsync, loading, error, data } = useRequest(() => getLearnEarnJumpUrl(id), {
    manual: true,
    onError: () => {},
  });

  const taskInfoList = useMemo(() => {
    const depositTaskInfo = tasks?.find((i) => i.taskType === BACKEND_TASK_TYPE.DEPOSIT_TASK);
    const tradeTaskInfo = tasks?.find((i) => i.taskType === BACKEND_TASK_TYPE.TRADING_REWARD_TASK);
    const learnInfo = () => {
      if (data?.data && !loading && error?.code !== '404') {
        const info = tasks?.find((i) => i.taskType === BACKEND_TASK_TYPE.LEARN_TASK);
        return { ...info, learnJumpCode: data.data };
      }
      return null;
    };
    return makeTaskInfoList({
      depositTaskInfo,
      tradeTaskInfo,
      redemptionLimit,
      currencyName,
      learnInfo: learnInfo(),
    });
  }, [tasks, data, loading, error?.code, redemptionLimit, currencyName]);

  useEffect(() => {
    if (!id) return;
    runAsync();
  }, [id, runAsync]);

  return taskInfoList;
};
