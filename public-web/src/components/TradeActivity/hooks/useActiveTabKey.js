/**
 * Owner: jessie@kupotech.com
 */

import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { POOL_STATUS } from '../GemPool/config';

const emptyObj = {};

// app 初始化hooks (包含)
const useActiveTabKey = () => {
  const dispatch = useDispatch();
  const [fristCurrency, setFristCurrency] = useState();
  const activeStakingToken = useSelector((state) => state.gempool.activeStakingToken);
  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);

  const { pools } = currentInfo || emptyObj;

  const getProjectStatus = useCallback((startAt, endAt) => {
    if (moment().isBefore(startAt)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(endAt)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, []);

  useEffect(() => {
    if (activeStakingToken && pools?.length) {
      // 第一个未结束的币种
      let _fristCurrency;
      pools?.map((item) => {
        if (item) {
          const status = getProjectStatus(item?.stakingStartTime, item?.stakingEndTime);
          item.poolStatus = status;
          if (status !== POOL_STATUS.COMPLETED) {
            if (activeStakingToken === item.stakingToken) {
              _fristCurrency = activeStakingToken;
            } else if (!_fristCurrency) {
              _fristCurrency = item.stakingToken;
            }
          }
        }
      });
      setFristCurrency(_fristCurrency);
      dispatch({ type: 'gempool/update', payload: { activeStakingToken: undefined } });
    }
  }, [activeStakingToken, pools, getProjectStatus, dispatch]);

  return fristCurrency;
};

export default useActiveTabKey;
