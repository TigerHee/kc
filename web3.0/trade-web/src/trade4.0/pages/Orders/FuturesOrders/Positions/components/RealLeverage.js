/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { styled } from '@kux/mui/emotion';
import { ICEdit2Outlined } from '@kux/icons';

import { formatNumber } from '@/utils/futures';

import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import {
  useShowWithdrawMargin,
  useChangeRealLeverageVisible,
} from '@/hooks/futures/useOperatorMargin';
import { useIsRTL } from '@/hooks/common/useLang';
import { useIsBattlePosition } from '../../hooks/positions/useFuturesPositionData';

const RealLeverageWrapper = styled.div`
  padding: 0 4px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.cover8};
  font-size: 12px;
  height: 16px;
  white-space: nowrap;
  > span {
    margin-right: 4px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text60};
  }
  > svg {
    color: ${(props) => props.theme.colors.icon60};
    transform: ${(props) => (props.isRtl ? 'scaleX(-1)' : 'unset')};
  }
  cursor: ${(props) => (props.operator ? 'pointer' : 'unset')};
`;

const RealLeverage = ({
  symbol,
  isTrialFunds,
  realLeverage: pLeverage,
  maintMargin,
  currentQty,
  ...other
}) => {
  const isRtl = useIsRTL();
  const dispatch = useDispatch();
  const showWithdrawMargin = useShowWithdrawMargin();
  const isBattlePosition = useIsBattlePosition(symbol, isTrialFunds);
  const calcData = useGetPositionCalcData(symbol);
  const { onChangeVisible } = useChangeRealLeverageVisible();

  // 体验金的仓位不需要计算，有推送
  const realLeverage = isTrialFunds ? pLeverage : calcData?.realLeverage || pLeverage;
  const value = isTrialFunds ? maintMargin : calcData?.totalMargin || maintMargin;

  // 不展示提取保证金，或者体验金仓位，或者乱斗，无法提取
  const notOperatorMargin = useMemo(() => {
    return !showWithdrawMargin || isTrialFunds || isBattlePosition;
  }, [isBattlePosition, isTrialFunds, showWithdrawMargin]);

  const handleOpenDialog = useCallback(() => {
    if (notOperatorMargin) return;
    onChangeVisible(true);

    dispatch({
      type: 'futures_orders/update',
      payload: {
        appendMarginDetail: {
          symbol,
          size: currentQty,
          margin: value,
          leverage: realLeverage,
          isTrialFunds,
          ...other,
        },
      },
    });
  }, [
    notOperatorMargin,
    onChangeVisible,
    dispatch,
    symbol,
    currentQty,
    value,
    realLeverage,
    isTrialFunds,
    other,
  ]);

  return (
    <RealLeverageWrapper onClick={handleOpenDialog} isRtl={isRtl} operator={!notOperatorMargin}>
      <span>{`${formatNumber(realLeverage, { fixed: 2, dropZ: false })}x`}</span>
      {notOperatorMargin ? null : <ICEdit2Outlined />}
    </RealLeverageWrapper>
  );
};

export default React.memo(RealLeverage);
