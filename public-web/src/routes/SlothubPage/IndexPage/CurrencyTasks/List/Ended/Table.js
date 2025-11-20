/*
 * owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getPastTasks } from 'services/slothub';
import CommonTable from '../CommonTable';

const Table = (props) => {
  const dispatch = useDispatch();

  const onSuccess = useCallback((res) => {
    if (res?.totalNum >= 0) {
      dispatch({
        type: 'slothub/updateListStatistics',
        payload: {
          completedCount: res.totalNum,
        },
      });
    }
  }, []);

  return (
    <CommonTable
      rowKey={(v) => v.id}
      onSuccess={onSuccess}
      fetchFn={getPastTasks}
      partitionFn={(v) => v.isReserved}
      {...props}
    />
  );
};

export default React.memo(Table);
