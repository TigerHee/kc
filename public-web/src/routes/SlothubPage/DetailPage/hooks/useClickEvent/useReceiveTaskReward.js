/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-21 12:37:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-19 16:06:52
 */
import { useSnackbar } from '@kux/mui/hooks';
import { useLockFn, useMemoizedFn } from 'ahooks';
import useRequest from 'src/hooks/useRequest';
import { useStore } from 'src/routes/SlothubPage/DetailPage/store';
import {
  formatBackendTaskPointRewards,
  GAIN_PRIZE_TYPE,
  useOpenPrizeDialog,
} from 'src/routes/SlothubPage/Portal/PrizeDialog';
import { quickReceive } from 'src/services/slothub';
import { _t } from 'src/tools/i18n';

export const useReceiveTaskReward = () => {
  const { state } = useStore();
  const { refreshProjectDetail, projectDetail } = state;
  const { currency, id } = projectDetail || {};

  const { message } = useSnackbar();
  const { open } = useOpenPrizeDialog();

  const { loading: receiveTaskRewardLoading, runAsync: runReceiveTaskReward } = useRequest(
    quickReceive,
    {
      manual: true,
      onError: (error, errorHandler) => {
        if ([514008, 514014, 514015].includes(error?.code)) {
          message.info(_t('644cfa8ff95d4000a645'));
        } else {
          errorHandler();
        }
      },
    },
  );
  // 竞态锁
  const receiveTaskReward = useLockFn(runReceiveTaskReward);

  // 领取奖励
  const handleReceiveByTaskId = useMemoizedFn((taskId) => {
    try {
      receiveTaskReward({ taskId, projectId: id }).then((res) => {
        const { items } = res || {};
        if (!items) {
          message.info(_t('644cfa8ff95d4000a645'));
          return;
        }
        // 刷新详情
        refreshProjectDetail();
        open(GAIN_PRIZE_TYPE.TASK_REWARD, formatBackendTaskPointRewards(items, currency));
      });
    } catch (error) {
      console.log('handleReceiveByTaskId ~ error:', error);
    }
  });

  return {
    onReceive: handleReceiveByTaskId,
    loading: receiveTaskRewardLoading,
  };
};
