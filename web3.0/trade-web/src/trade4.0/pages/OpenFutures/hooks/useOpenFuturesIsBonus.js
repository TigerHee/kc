/**
 * Owner: clyne@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useLoginDrawer from '@/hooks/useLoginDrawer';

let isInit = false;
const useOpenFuturesIsBonus = (visible) => {
  const dispatch = useDispatch();
  const { isLogin } = useLoginDrawer();
  const openContract = useSelector((state) => state.openFutures.openContract);
  const isBonus = useSelector((state) => state.openFutures.isBonus);

  useEffect(() => {
    if (isLogin && openContract !== undefined && openContract === false && !isInit) {
      isInit = true;
      dispatch({
        type: `openFutures/getOpenFuturesIsBonus`,
      });
    }
  }, [dispatch, openContract, isLogin]);

  useEffect(() => {
    if (isLogin && openContract !== undefined && openContract === false && visible) {
      isInit = true;
      dispatch({ type: `openFutures/getOpenFuturesIsBonus` });
    }
  }, [dispatch, openContract, isLogin, visible]);

  return isBonus;
};

export default useOpenFuturesIsBonus;
