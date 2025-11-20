/**
 * @Owner: borden@kupotech.com
 * @Date: 2021-05-25 14:32:08
 * @Description: 杠杆(逐仓/全仓)数据处理
 */
import { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'dva';
import { throttle } from 'lodash';
import useMarginModel from '@/hooks/useMarginModel';
import { MARGIN_TRADE_TYPE } from '@/meta/tradeTypes';

export default memo(() => {
  const dispatch = useDispatch();
  const { tradeType, currentSymbol } = useSelector(state => state.trade);
  const { crossCurrencies, loanCurrencies } = useSelector(state => state.marginMeta);
  const { targetPriceMap } = useSelector(state => state.isolated);
  const { userLeverage, totalBalance, totalLiability, position } = useMarginModel([
    'userLeverage', 'totalBalance', 'totalLiability', 'position',
  ]);

  const [base, quote] = currentSymbol.split('-');
  const isLegalPosition = !!(position[base] && position[quote]);
  const isLegalMarkPrice = !!(targetPriceMap[`${base}-BTC`] && targetPriceMap[`${quote}-BTC`]);
  const isLegalCoins =
    tradeType === MARGIN_TRADE_TYPE.MARGIN_TRADE.key
      ? !!(crossCurrencies.length && loanCurrencies.length)
      : !!loanCurrencies.length;

  const throttleGetBorrowSize = useMemo(() => throttle(() => {
    dispatch({
      type: MARGIN_TRADE_TYPE[tradeType].borrowSizeEffect,
    });
  }, 2000, { leading: true }), [tradeType]);

  useEffect(() => {
    // 拉取杠杆借贷配置和全仓配置，全局只拉一遍，在model层做的处理
    dispatch({ type: 'marginMeta/pullLoanCurrencies' });
    dispatch({ type: 'marginMeta/pullCrossCurrencies' });
  }, []);

  useEffect(() => {
    if (isLegalMarkPrice && isLegalPosition && isLegalCoins && userLeverage) {
      throttleGetBorrowSize();
    }
  }, [
    tradeType,
    isLegalCoins,
    userLeverage,
    totalBalance,
    currentSymbol,
    totalLiability,
    isLegalPosition,
    isLegalMarkPrice,
  ]);

  return null;
});
