/**
 * Owner: garuda@kupotech.com
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';

export default function useWorkerSnapshotSubscribe() {
  // const connectTimes = useSelector((state) => state.socket.connectTimes);
  // const connected = useSelector((state) => state.socket.connected);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   if (connectTimes > 1 && connected) {
  //     dispatch({
  //       type: 'futuresCommon/pullDetail',
  //     });
  //   }
  // }, [connectTimes, connected, dispatch]);
  // useFuturesWorkerSubscribe('/contractMarket/snapshot:ALL', false);
}
