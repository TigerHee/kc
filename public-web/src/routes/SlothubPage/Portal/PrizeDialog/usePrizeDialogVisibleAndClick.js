/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-11 16:39:24
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 20:27:01
 */
import { useLockFn, useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SlotHubShareScene } from '../../components/Share/constant';
import { useOpenSlothubShare } from '../../components/Share/useOpenSlothubShare';
import { GAIN_PRIZE_TYPE } from './constant';
import { receiveSharedRewards } from './presenter';

const useDialogConfigHelper = () => {
  const dispatch = useDispatch();
  // 处于关闭动画态
  const [isCloseAnimating, setIsAnimating] = useState(false);

  const onCloseHandler = useMemoizedFn(() => {
    dispatch({
      type: 'slothub/updatePrizeDialogConfig',
      payload: {
        visible: false,
      },
    });
  });

  // 处理弹窗关闭的逻辑
  const handleClose = useMemoizedFn(() => {
    setIsAnimating(true);

    // 等待动画完成后调用setVisible(false)
    setTimeout(() => {
      onCloseHandler();
      setIsAnimating(false);
    }, 280); // 280ms与动画持续时间一致
  });

  return {
    handleClose,
    isCloseAnimating,
  };
};

export const usePrizeDialogVisibleAndClick = ({ prizes, prizeType }) => {
  const { handleClose, isCloseAnimating } = useDialogConfigHelper();
  const isSharedRewardType = prizeType === GAIN_PRIZE_TYPE.SHARED_REWARD;
  const { open: openShare } = useOpenSlothubShare();
  const enhanceShareRewards = useLockFn(receiveSharedRewards);

  const onShare = useMemoizedFn(async () => {
    try {
      if (isSharedRewardType) {
        await enhanceShareRewards(prizes);
      }
    } catch (error) {
      console.log('onShare ~ error:', error);
    } finally {
      // handleClose();
      if (isSharedRewardType) {
        openShare(SlotHubShareScene.recordHistory, { prizeList: prizes });
        return;
      }
      openShare(SlotHubShareScene.gainReward, prizes);
    }
  });

  const onReceive = useMemoizedFn(async () => {
    try {
      if (isSharedRewardType) {
        await enhanceShareRewards(prizes);
      }
    } catch (error) {
    } finally {
      handleClose();
    }
  });

  return {
    onShare,
    onReceive,
    isCloseAnimating,
  };
};
