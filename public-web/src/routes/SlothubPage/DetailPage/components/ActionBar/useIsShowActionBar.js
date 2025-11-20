/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-19 15:27:20
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 20:52:13
 */
import { useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { PROJECT_ACTIVITY_STATUS } from 'src/routes/SlothubPage/constant';
import { useStore } from '../../store';

export const useIsShowActionBar = () => {
  const { state } = useStore();
  const { projectDetail, activityStatus } = state;
  const { isReserved } = projectDetail || {};
  const isLogin = useSelector((state) => state.user.isLogin);

  // 是否显示交互操作栏
  const isShowActionBar = useMemo(() => {
    const isUnJoin = !isReserved;
    // const isJoinAndActivityIsEnd =
    //   activityStatus === PROJECT_ACTIVITY_STATUS.activityEnded && isReserved;
    const isJoinAndActivityIsNotStarted =
      activityStatus === PROJECT_ACTIVITY_STATUS.activityNotStarted && isReserved;

    // 未登录 || 未参与 ||  已参与 && 活动未开始
    return [!isLogin, isUnJoin, isJoinAndActivityIsNotStarted].some((i) => !!i);
  }, [activityStatus, isReserved, isLogin]);

  return isShowActionBar;
};
