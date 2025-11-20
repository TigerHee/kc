/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-19 15:25:30
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:43:48
 */
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { PROJECT_ACTIVITY_STATUS, SENSORS } from 'src/routes/SlothubPage/constant';
import { useReserveOrEnrollProject } from '../../hooks/useClickEvent/useReserveOrEnrollProject';
import { useStore } from '../../store';
import { ACTIVITY_ACTION_BUTTON_CONFIG_BY_BUSINESS_MAP, BUSINESS_TYPE } from './constant';

const getBusinessType = ({ activityStatus, isLogin, isReserved }) => {
  const isStart = activityStatus === PROJECT_ACTIVITY_STATUS.activityOngoing;
  const isEnd = activityStatus === PROJECT_ACTIVITY_STATUS.activityEnded;
  const isBeforeStart = activityStatus === PROJECT_ACTIVITY_STATUS.activityNotStarted;
  if (!isLogin) {
    if (isBeforeStart) {
      return BUSINESS_TYPE.loginAndReserve;
    }
    if (isStart) {
      return BUSINESS_TYPE.loginAndApplication;
    }
    if (isEnd) {
      return BUSINESS_TYPE.loginAndViewResult;
    }
  }

  // 已登陆
  if (isBeforeStart) {
    return isReserved ? BUSINESS_TYPE.isReserved : BUSINESS_TYPE.canReserve;
  }
  if (isStart) {
    return isReserved ? undefined : BUSINESS_TYPE.canApply;
  }
  if (isEnd) {
    return isReserved ? undefined : BUSINESS_TYPE.isEndAndNotJoin;
  }

  return undefined;
};

export const useMakeButtonConfig = () => {
  const { state } = useStore();
  const { activityStatus, projectDetail } = state;
  const { isReserved, currency } = projectDetail || {};
  const isLogin = useSelector((state) => state.user.isLogin);
  const { reserve, enroll, loadings } = useReserveOrEnrollProject();
  const businessType = useMemo(
    () => getBusinessType({ activityStatus, isLogin, isReserved }),
    [activityStatus, isLogin, isReserved],
  );

  const config = useMemo(
    () => ACTIVITY_ACTION_BUTTON_CONFIG_BY_BUSINESS_MAP[businessType],
    [businessType],
  );

  const onClick = useMemoizedFn(() => {
    if (activityStatus === PROJECT_ACTIVITY_STATUS.activityNotStarted) {
      reserve();
      return;
    }
    if (activityStatus === PROJECT_ACTIVITY_STATUS.activityOngoing) {
      enroll();
    }
  });

  const onPreClick = useMemoizedFn(() => {
    if (activityStatus === PROJECT_ACTIVITY_STATUS.activityNotStarted) {
      SENSORS.reserve({ currency });

      return;
    }
    if (activityStatus === PROJECT_ACTIVITY_STATUS.activityOngoing) {
      SENSORS.enroll();
    }
  });

  return {
    config,
    onClick,
    onPreClick,
    loading: loadings.enrollCurrencyProjectLoading || loadings.reserveCurrencyProjectLoading,
  };
};
