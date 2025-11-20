/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import { Button, Tooltip } from '@kux/mui';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { useIsBattlePosition } from '../../hooks/positions/useFuturesPositionData';
import { useSelector, useDispatch } from 'dva';
import { _t } from 'utils/lang';
import { FUTURES } from '@/meta/const';
import { styled, fx } from '@/style/emotion';
import { formatCurrency } from '@/utils/futures/formatCurrency';
import { useUnit } from '@/hooks/futures/useUnit';
import { ICCloseOutlined } from '@kux/icons';

import { futuresPositionNameSpace } from '../../config';
import Maintenance from '@/pages/Orders/FuturesOrders/components/Maintenance';
import BrawlLabel from './BrawlLabel';
import TextIndexTips from './TextIndexTips';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const ClosePositionCellWrapper = styled.div`
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  width: ${(props) => (props.noTitle ? '100%' : 'auto')};
  display: ${(props) => (props.noTitle ? 'flex' : 'block')};
  button {
    max-width: ${(props) => (props.noTitle ? '50%' : 'auto')};
    flex: 1;
    ${(props) => fx.color(props, 'text40')}
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

const ClosePositionCell = ({
  symbol,
  posCost,
  settleCurrency,
  currentQty,
  noTitle,
  isTrialFunds,
}) => {
  const closeOrders = useSelector((state) => state[futuresPositionNameSpace].closeOrders);
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const tradingUnit = useUnit();
  const dispatch = useDispatch();
  const isBattlePosition = useIsBattlePosition({ symbol, isTrialFunds });

  const { status } = contract;

  const closeOrder = React.useMemo(() => {
    return _.find(
      closeOrders,
      (order) => order.symbol === symbol && !!order.isTrialFunds === !!isTrialFunds,
    );
  }, [closeOrders, isTrialFunds, symbol]);

  const closeOrderPriceToFixed = React.useMemo(() => {
    let { price } = closeOrder || {};
    if (price) {
      price = new Decimal(price).toFixed();
    }
    return price;
  }, [closeOrder]);

  const handleCreateCloseOrder = React.useCallback(
    (type) => async () => {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          liquidationVisible: true,
          positionItem: {
            symbol,
            posCost,
            settleCurrency,
            currentQty,
            isTrialFunds,
          },
          liquidationType: type,
        },
      });
    },
    [dispatch, symbol, posCost, settleCurrency, currentQty, isTrialFunds],
  );

  const cancelCloseOrder = React.useCallback(() => {
    futuresSensors.activeOrder.cancel.click();
    dispatch({
      type: 'futures_orders/cancel',
      payload: {
        orderId: closeOrder && closeOrder.id,
        isTrialFunds,
        order: true,
      },
    });
  }, [closeOrder, dispatch, isTrialFunds]);

  if (status === 'CancelOnly' || status === 'Paused') {
    return <Maintenance />;
  }

  if (isBattlePosition) {
    return <BrawlLabel />;
  }

  if (closeOrder) {
    const size = closeOrder.size - closeOrder.dealSize;
    const isTransfer = !contract.isInverse && tradingUnit !== 'Quantity';
    const langKey = isTransfer ? 'partial.order.text.baseCurrency' : 'partial.order.text';
    const realSize = isTransfer ? Decimal(size).mul(contract.multiplier).toNumber() : size;
    return (
      <Tooltip
        placement="top"
        title={
          <TextIndexTips
            langKey={langKey}
            contract={contract}
            langProps={{
              price: closeOrderPriceToFixed,
              size: realSize,
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
                size: realSize,
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
