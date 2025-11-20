/**
 * Owner: garuda@kupotech.com
 */
import { useCallback, useEffect } from 'react';
import { throttle } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useGetPosition } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

// 初始化抵扣券请求
const useCouponInit = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const symbol = useGetCurrentSymbol();
  const isSpotSymbol = isSpotTypeSymbol(symbol);

  const positions = useGetPosition({
    condition: ({ isOpen, isTrialFunds }) => {
      return isOpen && !isTrialFunds;
    },
  });

  const getCurrentUserCoupon = useCallback(() => {
    dispatch({
      type: 'futuresTrialFund/getCurrentUserCoupon',
      payload: {
        symbol,
      },
    });
  }, [dispatch, symbol]);

  const throttleGetCurrentUserCoupon = useCallback(throttle(getCurrentUserCoupon, 60000), [
    getCurrentUserCoupon,
  ]);

  // 仓位变化60s 请求一次抵扣券的接口
  useEffect(() => {
    if (isLogin && symbol && !isSpotSymbol) {
      throttleGetCurrentUserCoupon();
    }
  }, [throttleGetCurrentUserCoupon, positions, isLogin, symbol, isSpotSymbol]);
};

export default useCouponInit;
