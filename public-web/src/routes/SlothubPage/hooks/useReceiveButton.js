/*
 * @owner: borden@kupotech.com
 */
import { useSnackbar } from '@kux/mui/hooks';
import { useLockFn } from 'ahooks';
import useRequest from 'src/hooks/useRequest';
import {
  formatBackendTaskPointRewards,
  GAIN_PRIZE_TYPE,
  useOpenPrizeDialog,
} from 'src/routes/SlothubPage/Portal/PrizeDialog';
import { quickReceive } from 'src/services/slothub';
import { _t } from 'src/tools/i18n';

const useReceiveButton = ({ currency, taskId, projectId, callback }) => {
  const { message } = useSnackbar();
  const { open } = useOpenPrizeDialog();

  const { loading: receiveTaskRewardLoading, runAsync: runReceiveTaskReward } = useRequest(
    () => quickReceive({ taskId, projectId }),
    {
      manual: true,
      onSuccess: (res) => {
        const { items } = res;
        message.success(_t('2e68b5750b804000a958'));
        open(GAIN_PRIZE_TYPE.TASK_REWARD, formatBackendTaskPointRewards(items, currency));
        if (callback) callback(res);
      },
      onError: (error, errorHandler) => {
        if ([514008, 514014, 514015].includes(+error?.code)) {
          message.info(_t('644cfa8ff95d4000a645'));
        } else {
          errorHandler();
        }
      },
    },
  );

  // 领取加竞态锁
  const receiveReward = useLockFn(runReceiveTaskReward);

  return {
    onClick: receiveReward,
    loading: receiveTaskRewardLoading,
  };
};

export default useReceiveButton;
