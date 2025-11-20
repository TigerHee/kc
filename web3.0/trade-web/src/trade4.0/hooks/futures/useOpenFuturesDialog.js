/**
 * Owner: clyne@kupotech.com
 */
import { useDispatch, useSelector } from 'react-redux';
import storage from 'utils/storage';

import useOpenFuturesIsBonus from '@/pages/OpenFutures/hooks/useOpenFuturesIsBonus';

export default function useOpenFuturesDialog() {
  const dispatch = useDispatch();
  const isBonus = useOpenFuturesIsBonus();
  const userInfo = useSelector((state) => state.openFutures.userInfo);

  const handleOpenFuturesModal = () => {
    storage.setItem(`${userInfo?.uid}_openFuturesBonus`, true);
    let params = { openFuturesVisible: true };
    // 如果能领奖，则走领奖弹框
    if (isBonus) {
      params = { openFuturesBonusVisible: true };
    }
    dispatch({
      type: 'openFutures/update',
      payload: params,
    });
  };

  return [handleOpenFuturesModal, isBonus];
}
