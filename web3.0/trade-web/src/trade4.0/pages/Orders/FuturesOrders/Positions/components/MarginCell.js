/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useMemo, useCallback } from 'react';
import { _t } from 'utils/lang';
import { useDispatch } from 'react-redux';
import { ICEdit2Outlined } from '@kux/icons';
import { styled, fx } from '@/style/emotion';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import PrettyCurrency from 'src/trade4.0/components/PrettyCurrency';
import { FUTURES } from '@/meta/const';
import { useShowWithdrawMargin, useOperatorMarginVisible } from '@/hooks/futures/useOperatorMargin';
import { useIsBattlePosition } from '../../hooks/positions/useFuturesPositionData';
import { useGetSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';

const MarginCellWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
`;

const EditIcon = styled(ICEdit2Outlined)`
  ${fx.fontSize('16')}
  ${fx.marginLeft('4')}
  ${fx.cursor('pointer')}
`;

const MarginCell = ({ row }) => {
  const { maintMargin, settleCurrency, isTrialFunds, symbol } = row;
  const dispatch = useDispatch();
  const { status } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  // 合约暂停
  const isDisable = status === 'Paused';

  const calcData = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const value = useMemo(
    () => (isTrialFunds ? maintMargin : calcData?.totalMargin || maintMargin),
    [calcData, isTrialFunds, maintMargin],
  );
  const showWithdrawMargin = useShowWithdrawMargin();
  const { onChangeVisible } = useOperatorMarginVisible();
  const isBattlePosition = useIsBattlePosition(symbol, isTrialFunds);

  // 不展示提取保证金，或者体验金仓位，或者乱斗，无法提取
  const notOperatorMargin = useMemo(() => {
    return !showWithdrawMargin || isTrialFunds || isBattlePosition;
  }, [isBattlePosition, isTrialFunds, showWithdrawMargin]);

  const addMargin = useCallback(() => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        appendMarginVisible: true,
        appendMarginDetail: row,
      },
    });
  }, [dispatch, row]);

  const operatorMargin = useCallback(() => {
    dispatch({
      type: 'futures_orders/update',
      payload: {
        appendMarginDetail: {
          ...row,
          size: row.currentQty,
          margin: value,
        },
      },
    });
    onChangeVisible(true);
  }, [dispatch, onChangeVisible, row, value]);

  return (
    <MarginCellWrapper>
      <PrettyCurrency isShort value={value} currency={settleCurrency} />
      {isDisable ? null : (
        <div className="iconRtl">
          <EditIcon onClick={notOperatorMargin ? addMargin : operatorMargin} />
        </div>
      )}
    </MarginCellWrapper>
  );
};

export default memo(MarginCell);
