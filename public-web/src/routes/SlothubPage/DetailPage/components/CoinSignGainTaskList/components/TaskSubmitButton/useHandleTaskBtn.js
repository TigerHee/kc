/**
 * Owner: harry.lai@kupotech.com
 */

import { useSnackbar } from '@kux/mui/hooks';
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';
import { PROJECT_ACTIVITY_STATUS } from 'src/routes/SlothubPage/constant';
import { useReceiveTaskReward } from 'src/routes/SlothubPage/DetailPage/hooks/useClickEvent/useReceiveTaskReward';
import { useStore } from 'src/routes/SlothubPage/DetailPage/store';
import useLoginDrawer from 'src/routes/SlothubPage/hooks/useLoginDrawer';
import { _t } from 'src/tools/i18n';
import { DEFAULT_SUBMIT_BTN_TEXT_KEY_CONFIG, SUBMIT_BTN_STYLE_TYPE_MAP } from './constant';

const generateBtnTextAndStyleType = (
  { activityStatus, isFinish, canReceiveTimes, children },
  textConfig = DEFAULT_SUBMIT_BTN_TEXT_KEY_CONFIG,
) => {
  let btnStyleType = SUBMIT_BTN_STYLE_TYPE_MAP.default;
  switch (activityStatus) {
    // 活动为开始 按钮样式与文案
    case PROJECT_ACTIVITY_STATUS.activityNotStarted:
      return { text: children, btnStyleType };
    // 活动进行中 按钮样式与文案
    case PROJECT_ACTIVITY_STATUS.activityOngoing:
      if (isFinish) {
        return {
          text: _t(textConfig.finishText),
          btnStyleType: SUBMIT_BTN_STYLE_TYPE_MAP.disabled,
        };
      }
      if (canReceiveTimes > 0) {
        return {
          text: _t(textConfig.receiveText),
          btnStyleType: SUBMIT_BTN_STYLE_TYPE_MAP.canReceive,
        };
      }
      return { text: children, btnStyleType };
    // 活动结束
    case PROJECT_ACTIVITY_STATUS.activityEnded:
      btnStyleType = SUBMIT_BTN_STYLE_TYPE_MAP.disabled;
      if (isFinish) return { text: _t(textConfig.finishText), btnStyleType };
      if (canReceiveTimes > 0) return { text: _t(textConfig.expiredText), btnStyleType };
      return { text: children, btnStyleType };

    default:
      return { text: children, btnStyleType };
  }

  // 活动已结束 按钮样式与文案
};

export const useHandleTaskBtn = (
  { toLink, isFinish, canReceiveTimes, children, taskId },
  textConfig,
) => {
  const { open, isLogin } = useLoginDrawer();
  const { state, dispatch: detailStoreDispatch } = useStore();
  const { activityStatus, projectDetail } = state;
  const { isReserved } = projectDetail || {};
  const { onReceive, loading } = useReceiveTaskReward();
  const { message } = useSnackbar();
  const { text, btnStyleType } = useMemo(
    () =>
      generateBtnTextAndStyleType(
        { activityStatus, isFinish, canReceiveTimes, children },
        textConfig,
      ),
    [activityStatus, canReceiveTimes, children, isFinish, textConfig],
  );

  const handleClick = useMemoizedFn((e) => {
    // 未登陆跳转登陆页面
    if (!isLogin) {
      open();
      return;
    }
    if (btnStyleType === SUBMIT_BTN_STYLE_TYPE_MAP.disabled) return;
    // 已登陆，活动未开始
    if (activityStatus === PROJECT_ACTIVITY_STATUS.activityNotStarted) {
      message.success(_t('9dd56ab3ade04000a2ed'));
      return;
    }

    if (activityStatus === PROJECT_ACTIVITY_STATUS.activityOngoing) {
      // 活动开始未报名时打开报名提示弹窗
      if (!isReserved) {
        detailStoreDispatch({ type: 'toggleEnrollPromptDialog' });
        return;
      }

      // 领取任务
      if (!!canReceiveTimes) {
        onReceive(taskId);
        return;
      }

      toLink?.();
    }
  });

  return {
    handleClick,
    loading,
    btnText: text,
    btnStyleType,
  };
};
