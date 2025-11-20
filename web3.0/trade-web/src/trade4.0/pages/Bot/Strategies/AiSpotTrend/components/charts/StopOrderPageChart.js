/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import CreatePageChartLazy from './CreatePageChartLazy';
import { useSelector, shallowEqual, useDispatch } from 'dva';
import moment from 'moment';
import { _t, _tHTML } from 'Bot/utils/lang';

export default React.memo(({ taskId, symbolInfo, modelName }) => {
  const dispatch = useDispatch();
  const { hourKline, arbitrageInfo, noMore } = useSelector(
    state => state[modelName].stopChart,
    shallowEqual,
  );

  const onFetchMore = useCallback(
    (endTime = Date.now()) => {
      if (noMore) return;
      dispatch({
        type: `${modelName}/getStopOrderPageChart`,
        payload: {
          taskId,
          endTime: moment(endTime).valueOf(),
        },
      });
    },
    [noMore],
  );

  useEffect(() => {
    onFetchMore();
  }, []);
  return (
    <CreatePageChartLazy
      autoSize={false}
      onScrollLeftFetch={onFetchMore}
      hourKline={hourKline}
      arbitrageInfo={arbitrageInfo}
      symbolInfo={symbolInfo}
      title={_t('runninghistory')}
      mb={10}
      mt={16}
    />
  );
});
