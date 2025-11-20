/**
 * Owner: harry.lai@kupotech.com
 */
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { ACTIVITY_PROCESS_TYPE } from './constant';
import { usePollDataByBusinessStatus } from './usePollDataByBusinessStatus';

const pullAllNeededData = (dispatch) => {
  dispatch({ type: 'votehub/pullCurrentActivity' });
  dispatch({
    type: 'votehub/pullHistoricallyProjects',
    payload: {
      currentPage: 1,
    },
  });
  dispatch({ type: 'votehub/pullChainConfig' });
  dispatch({ type: 'votehub/pullBaseConfig' });
};

/** 收敛统一处理投币上票页面请求数据 */
export const usePullVoteData = () => {
  const dispatch = useDispatch();
  const activityStatus = useSelector((state) => state.votehub.activityStatus);
  const isActivityResultPublished = useSelector((state) => state.votehub.isActivityResultPublished);
  const user = useSelector((state) => state.user.user);

  // 业务状态
  const businessActivityStatus = useMemo(() => {
    // 活动已发布
    if (isActivityResultPublished) {
      return ACTIVITY_PROCESS_TYPE.ActivityArriveEndAndIsPub;
    }
    return activityStatus;
  }, [activityStatus, isActivityResultPublished]);

  usePollDataByBusinessStatus(businessActivityStatus, ACTIVITY_PROCESS_TYPE.ActivityInProgress);
  usePollDataByBusinessStatus(businessActivityStatus, ACTIVITY_PROCESS_TYPE.ActivityArriveEnd);
  usePollDataByBusinessStatus(
    businessActivityStatus,
    ACTIVITY_PROCESS_TYPE.ActivityArriveEndAndIsPub,
  );

  useEffect(() => {
    pullAllNeededData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    dispatch({
      type: 'votehub/pullAvailableVotes',
    });
  }, [dispatch, user]);

  useEffect(() => {
    // 投票结束且获胜项目未公布
    if (activityStatus === 3 && !isActivityResultPublished) {
      dispatch({
        type: 'votehub/pullActivityProjects',
      });
    }
  }, [dispatch, activityStatus, isActivityResultPublished]);
};
