/**
 * Owner: harry.lai@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  CANCEL_POLL_ACTIONS_BY_ACTIVITY_STATUS,
  POLL_ACTIONS_BY_ACTIVITY_STATUS,
} from './constant';

const makeDispatchList = (data, dispatch) => {
  const list = Array.isArray(data) ? data : [data];
  return list.map((type) => () => dispatch({ type }));
};

/** 轮训上票相关活动数据 根据activityStatus  */
export const usePollDataByBusinessStatus = (activityStatus, type) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let cleanupFunction;

    if (activityStatus === type) {
      const [pollList, cancelList] = [
        makeDispatchList(POLL_ACTIONS_BY_ACTIVITY_STATUS[type], dispatch),
        makeDispatchList(CANCEL_POLL_ACTIONS_BY_ACTIVITY_STATUS[type], dispatch),
      ];
      pollList.forEach((dispatchAction) => dispatchAction());

      cleanupFunction = () => {
        cancelList.forEach((dispatchAction) => dispatchAction());
      };
    }

    return cleanupFunction;
  }, [activityStatus, dispatch, type]);
};
