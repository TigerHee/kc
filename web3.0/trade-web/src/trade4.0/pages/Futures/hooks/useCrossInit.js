/**
 * Owner: garuda@kupotech.com
 */
import { useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useInitOrderChange } from '@/hooks/futures/useCalcData';
import useCheckFuturesCrossInterface from '@/hooks/futures/useCheckFuturesCrossInterface';
import { useCrossGrayScale, useCrossGrayScaleReady } from '@/hooks/futures/useCrossGrayScale';
import useFuturesReady from '@/hooks/futures/useFuturesReady';
import { useLeverageDialog } from '@/hooks/futures/useLeverage';
import useWorkerCrossSubscribe from '@/hooks/futures/useWorkerCrossSubscribe';
import { MARGIN_MODE_CROSS } from '@/meta/futures';
import { useMarginMode } from '@/pages/Futures/components/MarginMode/hooks';

const useCrossCommonAuth = () => {
  const userInfo = useSelector((state) => state.user.isLogin);
  const currentSymbol = useGetCurrentSymbol();
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);
  const futuresReady = useFuturesReady();
  const openContract = useSelector((state) => state.openFutures.openContract);

  const commonCrossAuth = useMemo(
    () => userInfo && futuresReady && !isSpotSymbol && openContract,
    [futuresReady, isSpotSymbol, openContract, userInfo],
  );
  return commonCrossAuth;
};

export const useCrossInit = () => {
  const dispatch = useDispatch();

  const currentSymbol = useGetCurrentSymbol();

  const { getMarginModes, getMarginModeForSymbol } = useMarginMode();

  const { getV2UserMaxLeverage } = useLeverageDialog();

  const commonCrossAuth = useCrossCommonAuth();

  const isCross = useMemo(
    () => getMarginModeForSymbol(currentSymbol) === MARGIN_MODE_CROSS,
    [currentSymbol, getMarginModeForSymbol],
  );

  // 监听订单变化，拉去订单占用
  useInitOrderChange();

  // 订阅全仓-杠杆/保证金模式
  useWorkerCrossSubscribe();

  // 监听核心接口事件
  useCheckFuturesCrossInterface();

  // 获取当前的仓位模式
  useEffect(() => {
    if (commonCrossAuth) {
      getMarginModes('ALL');
      // 开启模式轮询check
      dispatch({
        type: `futuresMarginMode/checkMarginModeSocket@polling`,
      });
      return () => {
        dispatch({
          type: `futuresMarginMode/checkMarginModeSocket@polling:cancel`,
        });
      };
    }
  }, [commonCrossAuth, dispatch, getMarginModes]);

  // 获取全仓请求
  useEffect(() => {
    // 请求全仓的最大杠杆值
    if (commonCrossAuth && currentSymbol && isCross) {
      getV2UserMaxLeverage(currentSymbol);
    }
  }, [commonCrossAuth, currentSymbol, getV2UserMaxLeverage, isCross]);

  // 请求全仓的杠杆值
  useEffect(() => {
    if (commonCrossAuth) {
      dispatch({
        type: 'futuresCommon/getCrossLeverageConfig',
        payload: {
          symbol: 'ALL',
        },
      });
      // 开启杠杆 check
      dispatch({
        type: `futuresCommon/checkCrossLeverageSocket@polling`,
      });
      return () => {
        dispatch({
          type: `futuresCommon/checkCrossLeverageSocket@polling:cancel`,
        });
      };
    }
  }, [commonCrossAuth, dispatch]);
};

export const useCrossGrayInit = () => {
  const currentSymbol = useGetCurrentSymbol();
  const { getCrossGrayScale } = useCrossGrayScale();
  const commonCrossAuth = useCrossCommonAuth();

  useEffect(() => {
    if (commonCrossAuth && currentSymbol) {
      // 全仓灰度请求
      getCrossGrayScale(currentSymbol);
    }
  }, [commonCrossAuth, currentSymbol, getCrossGrayScale]);
};
