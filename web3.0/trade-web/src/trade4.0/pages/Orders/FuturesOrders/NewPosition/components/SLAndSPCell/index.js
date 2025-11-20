/**
 * Owner: clyne@kupotech.com
 */

import React, { memo, useMemo } from 'react';
import { findIndex } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { ICEdit2Outlined } from '@kux/icons';
import { styled, fx, useIsBattlePosition, useGetSymbolInfo } from '@/pages/Futures/import';
import FormatPriceCell from '@/pages/Orders/FuturesOrders/components/FormatPriceCell';
import useStopProfitLoss from '../../hooks/useStopProfitLoss';
import { namespace as futuresPositionNameSpace, namespace } from '../../config';
import { FUTURES } from 'src/trade4.0/meta/const';
import {
  BIClick,
  POSITIONS,
  POSITIONS_PRD,
  getSLAndSPPosType,
} from 'src/trade4.0/meta/futuresSensors/list';

const StopCloseCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${fx.display('flex')}
`;

const StopCloseCellLeft = styled.div``;

const StopCloseCellRight = styled.div`
  ${fx.cursor('pointer')}
  ${fx.width('16', 'px')}
  ${fx.fontSize(16)}
  margin-left: 4px;
`;

const StopCloseProfit = styled.div`
  ${(props) => fx.color(props, !props.hasPrice ? 'text30' : 'primary')}
`;

const StopCloseLoss = styled.div`
  ${(props) => fx.color(props, !props.hasPrice ? 'text30' : 'secondary')}
`;

const StopCloseCell = ({ row }) => {
  const { symbol, currentQty, isTrialFunds, marginMode } = row;
  const { status } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const closeOrders = useSelector((state) => state[namespace].closeOrders);
  const sensorType = getSLAndSPPosType(row);

  const hasCloseOrder = React.useMemo(() => {
    const closeOrderAt = findIndex(
      closeOrders,
      (order) => order.symbol === symbol && !!order.isTrialFunds === !!isTrialFunds,
    );
    return closeOrderAt !== -1;
  }, [closeOrders, isTrialFunds, symbol]);

  const _battleInProgress = useIsBattlePosition({ symbol, isTrialFunds });

  const showButton = useMemo(() => {
    const disabled = status === 'CancelOnly' || status === 'Paused';
    return !disabled && !hasCloseOrder && !_battleInProgress;
  }, [status, hasCloseOrder, _battleInProgress]);

  const dispatch = useDispatch();

  const { stopProfit, stopLoss } = useStopProfitLoss({ symbol, currentQty, isTrialFunds });

  const handleOpenStopDialog = () => {
    BIClick([POSITIONS_PRD.BLOCK_ID, POSITIONS_PRD.SL_SP_CLICK], { type: sensorType, marginMode });
    dispatch({
      type: `${futuresPositionNameSpace}/update`,
      payload: {
        PLVisible: true,
        positionItem: row,
      },
    });
  };

  return (
    <StopCloseCellWrapper className="text-color">
      <StopCloseCellLeft>
        <StopCloseProfit hasPrice={stopProfit?.stopPrice}>
          <FormatPriceCell
            value={stopProfit?.stopPrice}
            symbol={symbol}
            type={stopProfit?.stopPriceType}
          />
        </StopCloseProfit>
        <StopCloseLoss hasPrice={stopLoss?.stopPrice}>
          <FormatPriceCell
            value={stopLoss?.stopPrice}
            symbol={symbol}
            type={stopLoss?.stopPriceType}
          />
        </StopCloseLoss>
      </StopCloseCellLeft>
      {showButton && (
        <StopCloseCellRight onClick={handleOpenStopDialog} className="iconRtl">
          <ICEdit2Outlined />
        </StopCloseCellRight>
      )}
    </StopCloseCellWrapper>
  );
};

export default memo(StopCloseCell);
