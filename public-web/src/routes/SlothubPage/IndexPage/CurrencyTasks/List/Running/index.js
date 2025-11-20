/*
 * owner: borden@kupotech.com
 * desc: 进行中
 */
import { evtEmitter } from 'helper';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import useCanAttendActivity from 'routes/SlothubPage/hooks/useCanAttendActivity';
import { getInProgressTasks } from 'services/slothub';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import { useSelector } from 'src/hooks/useSelector';
import CommonTable from '../CommonTable';

const event = evtEmitter.getEvt();
// 用于新人引导展示静态模块
const mockFetch =
  ({ isH5, isPad, isPC }) =>
  () => {
    const length = isH5 ? 1 : isPad ? 2 : isPC ? 3 : 1;
    return new Promise((resolve) => {
      resolve({
        totalPage: 1,
        currentPage: 1,
        items: Array.from(new Array(length)).map((_, i) => {
          return {
            id: i + 1,
            status: 1,
            hot: 20000,
            myPoints: 0,
            myRewards: 0,
            isReserved: false,
            displayAmount: 100,
            currency: ['BTC', 'ETH', 'KCS'][i],
            endTime: Date.now() + 24 * 60 * 60 * 1000,
            startTime: Date.now() - 24 * 60 * 60 * 1000,
          };
        }),
      });
    });
  };

const Running = ({ guidePoints }) => {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const canAttendActivity = useCanAttendActivity();
  const deviceScreenStatus = useDeviceHelper();
  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    if (canAttendActivity) {
      const refresh = () => tableRef.current?.refresh();
      event.on('__GEMSLOT_CONVERT_SUCCESS__', refresh);
      return () => {
        event.off('__GEMSLOT_CONVERT_SUCCESS__', refresh);
      };
    }
  }, [canAttendActivity]);

  const onSuccess = useCallback((res) => {
    if (res?.totalNum >= 0) {
      dispatch({
        type: 'slothub/updateListStatistics',
        payload: {
          ongoingCount: res.totalNum,
        },
      });
    }
  }, []);

  return (
    <CommonTable
      ref={tableRef}
      rowKey={(v) => v.id}
      onSuccess={onSuccess}
      guidePoints={guidePoints}
      partitionFn={(v) => !v.isReserved}
      fetchFn={guidePoints ? mockFetch(deviceScreenStatus) : getInProgressTasks}
      requestOptions={{ refreshDeps: [isLogin] }}
    />
  );
};

export default React.memo(Running);
