/*
 * owner: borden@kupotech.com
 * desc: 即将开始
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

import { getUpcomingTasks } from 'services/slothub';
import CommonTable from '../CommonTable';

const NotLaunched = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const onSuccess = useCallback((res) => {
    if (res?.totalNum >= 0) {
      dispatch({
        type: 'slothub/updateListStatistics',
        payload: {
          upcomingCount: res.totalNum,
        },
      });
    }
  }, []);

  return (
    <CommonTable
      rowKey={(v) => v.id}
      onSuccess={onSuccess}
      fetchFn={getUpcomingTasks}
      requestOptions={{ refreshDeps: [isLogin] }}
    />
  );
};

export default React.memo(NotLaunched);
