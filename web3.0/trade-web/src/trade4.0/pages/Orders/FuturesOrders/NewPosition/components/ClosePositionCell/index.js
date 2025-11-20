/**
 * Owner: clyne@kupotech.com
 */

import React, { memo } from 'react';
import { find } from 'lodash';
import Decimal from 'decimal.js';
import { Button, Tooltip } from '@kux/mui';
import { useSelector, useDispatch } from 'dva';
import { ICCloseOutlined } from '@kux/icons';
import {
  styled,
  fx,
  useUnit,
  useGetSymbolInfo,
  formatCurrency,
  useIsBattlePosition,
  useI18n,
  Maintenance,
  TextIndexTips,
  getDigit,
  thousandPointed,
} from '@/pages/Futures/import';
import { namespace as futuresPositionNameSpace } from '../../config';
import BrawlLabel from './BrawlLabel';
import { FUTURES } from 'src/trade4.0/meta/const';
import { formatNumber } from 'src/trade4.0/utils/format';
import { multiply } from 'src/utils/operation';
import {
  BIClick,
  OPEN_ORDER,
  POSITIONS,
  POSITIONS_PRD,
  getClosePosType,
  getOpenOrderType,
} from 'src/trade4.0/meta/futuresSensors/list';
// import { futuresSensors } from 'src/trade4.0/meta/sensors';

const ClosePositionCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  width: ${(props) => (props.noTitle ? '100%' : 'auto')};
  display: ${(props) => (props.noTitle ? 'flex' : 'block')};
  button {
    max-width: ${(props) => (props.noTitle ? '50%' : 'auto')};
    flex: 1;
    ${(props) => fx.color(props, 'text')}
    ${fx.fontWeight(400)}
  }
`;

const HasCloseWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.padding('4px 10px')}
  ${(props) => fx.backgroundColor(props, 'cover8')}
`;

const CloseIcon = styled(ICCloseOutlined)`
  ${fx.fontSize('14')}
  ${fx.cursor('pointer')}
`;

const ContentWrapper = styled.div`
  ${fx.flex('1')}
`;

const ClosePositionCell = ({ row, noTitle }) => {
  const { symbol, isTrialFunds, marginMode } = row;
  const { _t } = useI18n();
  const closeOrders = useSelector((state) => state[futuresPositionNameSpace].closeOrders);
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const tradingUnit = useUnit();
  const dispatch = useDispatch();
  const isBattlePosition = useIsBattlePosition({ symbol, isTrialFunds });
  const { status, tickSize, isInverse, multiplier = 0 } = contract;
  const priceFixedNum = getDigit(tickSize);

  const closeOrder = React.useMemo(() => {
    return find(
      closeOrders,
      (order) => order.symbol === symbol && !!order.isTrialFunds === !!isTrialFunds,
    );
  }, [closeOrders, isTrialFunds, symbol]);

  const closeOrderPriceToFixed = React.useMemo(() => {
    let { price } = closeOrder || {};
    if (price) {
      price = formatNumber(price, { fixed: priceFixedNum, dropZ: false, pointed: true });
    }
    return price;
  }, [closeOrder, priceFixedNum]);

  const handleCreateCloseOrder = React.useCallback(
    (type) => async () => {
      const sensorType = getClosePosType(row, type);
      BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_CLICK], { type: sensorType });
      BIClick(
        [
          POSITIONS_PRD.BLOCK_ID,
          type === 'limit' ? POSITIONS_PRD.LIMIT_CLOSE : POSITIONS_PRD.MARKET_CLOSE,
        ],
        { marginMode },
      );
      dispatch({
        type: `${futuresPositionNameSpace}/update`,
        payload: {
          liquidationVisible: true,
          positionItem: {
            ...row,
          },
          liquidationType: type,
        },
      });
    },
    [dispatch, marginMode, row],
  );

  const cancelCloseOrder = React.useCallback(() => {
    const sensorType = getOpenOrderType(row);
    BIClick([OPEN_ORDER.BLOCK_ID, OPEN_ORDER.CANCEL_CLICK], { type: sensorType });
    dispatch({
      type: `${futuresPositionNameSpace}/cancel`,
      payload: {
        orderId: closeOrder && closeOrder.id,
        isTrialFunds,
        order: true,
      },
    });
  }, [closeOrder, dispatch, isTrialFunds, row]);

  if (status === 'CancelOnly' || status === 'Paused') {
    return <Maintenance />;
  }

  // 全仓不显示乱斗
  if (isBattlePosition) {
    return <BrawlLabel />;
  }

  if (closeOrder) {
    const size = closeOrder.size - closeOrder.dealSize;
    const isTransfer = !isInverse && tradingUnit !== 'Quantity';
    const langKey = isTransfer ? 'partial.order.text.baseCurrency' : 'partial.order.text';
    const amountPrecision = isTransfer ? getDigit(multiplier, true) : 0;
    const v = isTransfer ? multiply(size)(multiplier) : size;
    const realSize = formatNumber(v.toString(), {
      pointed: true,
      dropZ: false,
      fixed: amountPrecision,
    });
    return (
      <Tooltip
        placement="top"
        title={
          <TextIndexTips
            langKey={langKey}
            contract={contract}
            langProps={{
              price: closeOrderPriceToFixed,
              size: thousandPointed(realSize),
              baseCurrency: isTransfer ? formatCurrency(contract.baseCurrency) : '',
            }}
          />
        }
      >
        <HasCloseWrapper>
          <ContentWrapper>
            <TextIndexTips
              langKey={langKey}
              contract={contract}
              langProps={{
                price: closeOrderPriceToFixed,
                size: thousandPointed(realSize),
                baseCurrency: isTransfer ? formatCurrency(contract.baseCurrency) : '',
              }}
            />
          </ContentWrapper>
          <CloseIcon onClick={cancelCloseOrder} type="ku-ic_close" />
        </HasCloseWrapper>
      </Tooltip>
    );
  }

  return (
    <ClosePositionCellWrapper noTitle={noTitle}>
      <Button
        onClick={handleCreateCloseOrder('limit')}
        variant="contained"
        type="default"
        size="mini"
        className="mr-4"
      >
        {_t('trade.order.limit')}
      </Button>
      <Button
        onClick={handleCreateCloseOrder('market')}
        variant="contained"
        type="default"
        size="mini"
      >
        {_t('trade.order.market')}
      </Button>
    </ClosePositionCellWrapper>
  );
};

export default memo(ClosePositionCell);
