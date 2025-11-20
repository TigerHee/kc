/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useMemo } from 'react';
import { _t } from 'utils/lang';
import _ from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { futuresPositionNameSpace } from '../../config';
import { ICEdit2Outlined } from '@kux/icons';
import useStopProfitLoss from '../../hooks/positions/useStopProfitLoss';
import { styled, fx } from '@/style/emotion';
import { useIsBattlePosition } from '../../hooks/positions/useFuturesPositionData';
import FormatPriceCell from '../../components/FormatPriceCell';
import { useGetSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { FUTURES } from 'src/trade4.0/meta/const';

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
  ${(props) => fx.color(props, 'primary')}
`;

const StopCloseLoss = styled.div`
  ${(props) => fx.color(props, 'secondary')}
`;

const StopCloseCell = ({ row }) => {
  const { symbol, currentQty, isTrialFunds } = row;
  const { status } = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  const closeOrders = useSelector((state) => state[futuresPositionNameSpace].closeOrders);

  const hasCloseOrder = React.useMemo(() => {
    const closeOrderAt = _.findIndex(
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
    dispatch({
      type: 'futures_orders/update',
      payload: {
        PLVisible: true,
        positionItem: row,
      },
    });
  };

  return (
    <StopCloseCellWrapper>
      <StopCloseCellLeft>
        <StopCloseProfit>
          <FormatPriceCell
            value={stopProfit?.stopPrice}
            symbol={symbol}
            type={stopProfit?.stopPriceType}
          />
        </StopCloseProfit>
        <StopCloseLoss>
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
