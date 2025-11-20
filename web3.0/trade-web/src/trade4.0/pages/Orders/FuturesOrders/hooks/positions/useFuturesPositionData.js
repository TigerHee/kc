/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { SYMBOL_FILTER_ENUM, futuresPositionNameSpace } from '../../config';
import { useSelector } from 'react-redux';
import { getCurrentSymbol, useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { filter, get } from 'lodash';
import { getStore } from 'src/utils/createApp';

export default () => {
  const positions = useSelector((state) => state[futuresPositionNameSpace].positions);
  const symbol = useGetCurrentSymbol();
  const isCurrentSymbolOnly = useSelector(
    (state) => state.fund[SYMBOL_FILTER_ENUM.FUTURES_POSITION],
  );
  const openPositions = React.useMemo(
    () =>
      filter(positions, (p) => {
        // 过滤当前symbol
        if (isCurrentSymbolOnly) {
          return p.isOpen && p.symbol === symbol;
        }
        // 过滤开了的仓
        return p.isOpen;
      }),
    [positions, isCurrentSymbolOnly, symbol],
  );

  return openPositions;
};

export const getPositions = () => {
  const state = getStore().getState();
  const positions = get(state, `${futuresPositionNameSpace}.positions`);
  const isCurrentSymbolOnly = get(state, `fund.${SYMBOL_FILTER_ENUM.FUTURES_POSITION}`);
  const currentSymbol = getCurrentSymbol();
  return filter(positions, (p) => {
    if (isCurrentSymbolOnly) {
      // 过滤体验金资金
      return p.isOpen && p.symbol === currentSymbol;
    }
    // 过滤体验金资金
    return p.isOpen;
  });
};

/**
 * 获取是否为乱斗仓位hooks
 */
export const useIsBattlePosition = (symbol, isTrialFunds) => {
  const battleInProgress = useSelector((state) => state[futuresPositionNameSpace].battleInProgress);
  return battleInProgress && symbol === 'XBTUSDTM' && !isTrialFunds;
};
