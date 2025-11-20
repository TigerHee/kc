/**
 * Owner: clyne@kupotech.com
 */
import { useSelector } from 'react-redux';
import {
  AUTH_USER,
  AUTH_OPEN_FUTURES,
  AUTH_ORDER_PNL,
  AUTH_STOP_ORDER,
  AUTH_ADVANCED_INTRUST,
  AUTH_INDEX_PRICE,
  AUTH_ADVANCED_POSITION,
  AUTH_FUNDING_RATE,
} from '@/meta/futures';

const useAuthObject = () => {
  const userInfo = useSelector((state) => state.user.user);
  const openContract = useSelector((state) => state.openFutures.openContract);

  return {
    [AUTH_USER]: userInfo,
    [AUTH_OPEN_FUTURES]: openContract,
    [AUTH_ORDER_PNL]: true,
    [AUTH_STOP_ORDER]: true,
    [AUTH_ADVANCED_INTRUST]: true,
    [AUTH_INDEX_PRICE]: true,
    [AUTH_ADVANCED_POSITION]: true,
    [AUTH_FUNDING_RATE]: true,
  };
};

export default useAuthObject;
