/*
 * owner: borden@kupotech.com
 */
import useRequest from 'hooks/useRequest';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getPastTasks } from 'services/slothub';
import InfiniteScrollList from '../../../../components/InfiniteScrollList';
import Item from '../../Item';

const MEndedTable = ({ fetchParams, ...otherProps }) => {
  const dispatch = useDispatch();

  const { data, run, loading } = useRequest(
    (params) =>
      getPastTasks({
        pageSize: 10,
        ...params,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res?.totalNum >= 0) {
          dispatch({
            type: 'slothub/updateListStatistics',
            payload: {
              completedCount: res.totalNum,
            },
          });
        }
      },
    },
  );

  useEffect(() => {
    run({
      page: 1,
      ...fetchParams,
    });
  }, [fetchParams]);

  const handleChange = useCallback(
    (v) => {
      run({
        page: v,
        ...fetchParams,
      });
    },
    [fetchParams],
  );

  const renderItem = useCallback(({ id, ...item }) => {
    return <Item key={id} id={id} {...item} />;
  }, []);

  return (
    <InfiniteScrollList
      key={fetchParams.mySelf}
      {...data}
      rowKey="id"
      loading={loading}
      onChange={handleChange}
      renderItem={renderItem}
      {...otherProps}
    />
  );
};

export default React.memo(MEndedTable);
