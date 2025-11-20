/**
 * Owner: clyne@kupotech.com
 */

import React, { memo, useMemo, useCallback } from 'react';
import { useDispatch } from 'dva';
import { ICEdit2Outlined } from '@kux/icons';
import {
  useIsBattlePosition,
  useGetSymbolInfo,
  useShowWithdrawMargin,
  useOperatorMarginVisible,
  styled,
  fx,
  useGetPositionCalcData,
  PrettyCurrency,
  Decimal,
} from '@/pages/Futures/import';
import { CROSS, namespace } from '../../config';
import { FUTURES } from 'src/trade4.0/meta/const';
import { POS_MARGIN, useShowFallback } from '@/pages/Orders/FuturesOrders/hooks/useShowFallback';
import { BIClick, POSITIONS_PRD } from 'src/trade4.0/meta/futuresSensors/list';

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
  ${fx.marginRight('4')}
  ${fx.cursor('pointer')}
  ${(props) => fx.color(props, 'icon60')}
`;

const MarginCell = ({ row }) => {
  const { maintMargin, settleCurrency, isTrialFunds, symbol, marginMode } = row;
  const dispatch = useDispatch();
  const { status } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const isCross = marginMode === CROSS;
  // 合约暂停
  const isDisable = status === 'Paused' || isCross;

  const { totalMargin, crossPosMargin } = useGetPositionCalcData(symbol);
  const isolateMargin = isTrialFunds ? maintMargin : totalMargin || maintMargin;
  // 体验金的仓位不需要计算，有推送
  const value = isCross ? crossPosMargin : isolateMargin;
  const showWithdrawMargin = useShowWithdrawMargin();
  const { onChangeVisible } = useOperatorMarginVisible();
  const isBattlePosition = useIsBattlePosition({ symbol, isTrialFunds });

  // 不展示提取保证金，或者体验金仓位，或者乱斗，无法提取
  const notOperatorMargin = useMemo(() => {
    return !showWithdrawMargin || isTrialFunds || isBattlePosition;
  }, [isBattlePosition, isTrialFunds, showWithdrawMargin]);

  const marginText = useShowFallback({
    marginMode,
    value,
    type: POS_MARGIN,
  });

  const addMargin = useCallback(() => {
    BIClick([POSITIONS_PRD.BLOCK_ID, POSITIONS_PRD.MARGIN_ICON_CLICK], {
      marginMode,
      type: 'add',
    });
    dispatch({
      type: `${namespace}/update`,
      payload: {
        appendMarginVisible: true,
        appendMarginDetail: row,
      },
    });
  }, [dispatch, marginMode, row]);

  const operatorMargin = useCallback(() => {
    BIClick([POSITIONS_PRD.BLOCK_ID, POSITIONS_PRD.MARGIN_ICON_CLICK], {
      marginMode,
      type: 'oper',
    });
    dispatch({
      type: `${namespace}/update`,
      payload: {
        appendMarginDetail: {
          ...row,
          size: row.currentQty,
          margin: value,
        },
      },
    });
    onChangeVisible(true);
  }, [dispatch, marginMode, onChangeVisible, row, value]);

  return (
    <MarginCellWrapper className="text-color">
      <PrettyCurrency
        isShort
        value={marginText}
        currency={settleCurrency}
        placeholder="--"
        round={Decimal.ROUND_UP}
      />
      {isDisable ? null : (
        <div className="iconRtl">
          <EditIcon onClick={notOperatorMargin ? addMargin : operatorMargin} />
        </div>
      )}
    </MarginCellWrapper>
  );
};

export default memo(MarginCell);
