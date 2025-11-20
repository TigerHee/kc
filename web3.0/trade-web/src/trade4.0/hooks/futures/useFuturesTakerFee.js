/**
 * Owner: garuda@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getState } from 'helper';
import { multiply, plus } from 'utils/operation';

import { getSymbolInfo, useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { getUserFee, useUserFee } from '@/hooks/futures/useGetUserFuturesInfo';
import { FUTURES } from '@/meta/const';

export const useFuturesGetTaxFee = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const taxRate = useSelector((state) => state.futuresTax.taxRate);

  const getTaxFee = useCallback(() => {
    if (isLogin) {
      dispatch({ type: 'futuresTax/getTaxFee' });
    }
  }, [dispatch, isLogin]);

  return {
    getTaxFee,
    taxRate,
  };
};

export const useFuturesTakerFee = ({
  symbol,
  isTax = true, // 是否需要拼接税费
  isTrialFunds = false,
  isUser = false,
}) => {
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { taxRate } = useFuturesGetTaxFee();
  const { takerFeeRate } = useUserFee();

  const isLogin = useSelector((state) => state.user.isLogin);

  const userTakerFeeRate = useMemo(() => {
    return isUser && isLogin ? takerFeeRate : symbolInfo.takerFeeRate;
  }, [isUser, symbolInfo.takerFeeRate, takerFeeRate, isLogin]);

  const allTakerFeeRate = useMemo(() => {
    return multiply(userTakerFeeRate)(plus(1)(taxRate))?.toString();
  }, [taxRate, userTakerFeeRate]);

  // TODO: 体验金暂时不增加税费，后续 V3 是否需要收税待定
  if (isTrialFunds || !isTax) {
    return userTakerFeeRate;
  }

  return allTakerFeeRate;
};

// 低频更新
export const getFuturesTaxFee = () => {
  return getState((state) => state.futuresTax.taxRate);
};

export const getFuturesTakerFee = ({
  symbol,
  isTax = true,
  isTrialFunds = false,
  isUser = false,
}) => {
  const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
  const { takerFeeRate } = getUserFee();

  const isLogin = getState((state) => state.user.isLogin);

  const userTakerFeeRate = isUser && isLogin ? takerFeeRate : symbolInfo.takerFeeRate;
  // TODO:
  if (isTrialFunds || !isTax) {
    return userTakerFeeRate;
  }
  const taxRate = getFuturesTaxFee();
  return multiply(userTakerFeeRate)(plus(1)(taxRate))?.toString();
};
