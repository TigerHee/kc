/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

let isInit = false;
const openNameSpace = 'open_futures';
const useOpenFuturesIsBonus = (visible) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.user);
  const openContract = useSelector((state) => state[openNameSpace].openContract);
  const isBonus = useSelector((state) => state[openNameSpace].isBonus);

  useEffect(() => {
    if (userInfo && openContract !== undefined && openContract === false && !isInit) {
      isInit = true;
      dispatch({
        type: `${openNameSpace}/getOpenFuturesIsBonus`,
      });
    }
  }, [dispatch, openContract, userInfo]);

  useEffect(() => {
    if (userInfo && openContract !== undefined && openContract === false && visible) {
      isInit = true;
      dispatch({ type: `${openNameSpace}/getOpenFuturesIsBonus` });
    }
  }, [dispatch, openContract, userInfo, visible]);

  return isBonus;
};

export default useOpenFuturesIsBonus;
