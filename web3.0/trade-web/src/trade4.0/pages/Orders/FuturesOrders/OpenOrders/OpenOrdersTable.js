/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useContext, useMemo } from 'react';
import Table from '@/components/VirtualizedTable';
import Text from '@/components/Text';
import PrettyValue from '@/components/PrettyValue';
import { _t } from 'utils/lang';
import { moment2Intl } from 'helper';
import { WrapperContext } from '@/pages/Orders/OpenOrders/config';
import { isOpenFuturesCross } from '@/meta/const';

import HiddenSize from '../components/HiddenSize';
import useActiveOrder, { useActiveOrderListData } from '@/hooks/futures/useActiveOrder';
import SymbolCell from '../components/NewSymbolCell';
import TypeCell from '../components/TypeCell';
import PrettySize from '../components/PrettySize';
import { styled, fx } from '@/style/emotion';
import { LineCancelWrapper, ProfitSpan, LossSpan, PnlWrapper } from '../style';
import FormatPriceCell from '../components/FormatPriceCell';
import CancelCell from './components/CancelCell';
import { useGetLeverage } from 'src/trade4.0/hooks/futures/useLeverage';
import { CROSS } from '../NewPosition/config';
import { POS_LEVERAGE, useShowFallback } from '@/pages/Orders/FuturesOrders/hooks/useShowFallback';
import { ACTIVE_ORDER_COUNT } from '../config';
import LinkAll from '../components/LinkAll';
import { minus } from 'src/utils/operation';

const PointerText = styled.a`
  ${fx.cursor('pointer')}
  >span {
    ${(props) => fx.color(props, 'primary')}
    cursor: inherit;
  }
`;

const SymbolCellRender = memo(({ row, screen, isMobile }) => {
  const { symbol, marginMode, isTrialFunds, leverage: lev } = row;
  const isCross = marginMode === CROSS;
  const leverage = useGetLeverage({ symbol, marginMode });
  const _leverage = useShowFallback({
    marginMode,
    value: leverage,
    type: POS_LEVERAGE,
  });
  const props = {
    symbol,
    isTrialFunds,
    marginMode,
    // 全仓那全局杠杆
    leverage: isCross ? _leverage : lev,
    screen,
    isShowTrialFundsTips: true,
  };

  if (isMobile) {
    const comp = <TypeCell isMobile={isMobile} {...row} showOrderType="active" />;
    return (
      <LineCancelWrapper className={screen}>
        <SymbolCell {...props} comp={comp} wrap={screen === 'md'} />
        {screen === 'md' ? null : <CancelCell row={row} />}
      </LineCancelWrapper>
    );
  }
  return <SymbolCell {...props} />;
});

const OpenOrdersTable = () => {
  const screen = useContext(WrapperContext);
  const dataSource = useActiveOrderListData();
  const { showCancelConfirm } = useActiveOrder();
  const isMd = screen === 'md';
  const isMobile = isMd || screen === 'lg' || screen === 'lg1';

  const columns = useMemo(() => {
    /**
     * symbol
     */
    const symbolItem = {
      title: _t('head.contracts'),
      align: 'left',
      dataIndex: 'symbol',
      noTitle: true,
      width: '200px',
      render: (v, row) => <SymbolCellRender row={row} screen={screen} isMobile={isMobile} />,
    };
    const orderPrice = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.activeOrders.price')}>
          {_t('assets.OrderHistory.orderPrice')}
        </Text>
      ),
      dataIndex: 'price',
      render: (value, row) => {
        return <FormatPriceCell value={row.price} symbol={row.symbol} type="TP" />;
      },
    };

    const size = {
      title: (
        <Text cursor="help" tips={_t('orderActive.amount.tip')}>
          {_t('assets.depositRecords.amount')}
        </Text>
      ),
      dataIndex: 'size',
      render: (value, row) => {
        const { symbol, size: _size, side, cancelSize } = row;
        const retText = minus(_size)(cancelSize).toString();
        return (
          <div>
            <Text className="order-text60">
              <PrettySize
                className="order-text60"
                symbol={symbol}
                value={retText}
                formatProps={{ negate: side === 'sell' }}
              />
            </Text>
            <HiddenSize {...row} />
          </div>
        );
      },
    };

    const type = {
      title: (
        <Text cursor="help" tips={_t('orderActive.type.tip')}>
          {_t('contract.detail.type')}
        </Text>
      ),
      dataIndex: 'type',
      align: 'left',
      width: isMobile ? undefined : 160,
      render: (value, row) => <TypeCell isMobile={isMobile} {...row} showOrderType="active" />,
    };

    const dealSize = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.activeOrders.filled')}>
          {_t('trade.positionsOrders.filled')}
        </Text>
      ),
      dataIndex: 'dealSize',
      render: (value, row) => {
        return (
          <div>
            <PrettySize symbol={row.symbol} value={row.dealSize} />
          </div>
        );
      },
    };

    const orderValue = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.activeOrders.order')}>
          {_t('trade.positionsOrders.orderValue')}
        </Text>
      ),
      dataIndex: 'value',
      render: (value, row) => {
        const { cancelSize, size: _size, price, symbol } = row;
        const orderSize = minus(_size)(cancelSize).toString();
        return (
          <div>
            <PrettyValue
              className="text-color"
              symbol={symbol}
              size={orderSize}
              price={price}
              isShort
            />
          </div>
        );
      },
    };

    const stopItem = {
      title: <Text cursor="help">{_t('stopClose.profitLoss')}</Text>,
      dataIndex: 'stop',
      render: (value, row) => {
        const { triggerStopUpPrice, triggerStopDownPrice } = row;
        const profitPrice = row.side === 'buy' ? triggerStopUpPrice : triggerStopDownPrice;
        const lossPrice = row.side === 'buy' ? triggerStopDownPrice : triggerStopUpPrice;

        return (
          <PnlWrapper>
            <ProfitSpan price={profitPrice}>
              <FormatPriceCell
                value={profitPrice === 0 ? '-' : profitPrice}
                symbol={row?.symbol}
                type={row?.stopPriceType}
              />
            </ProfitSpan>
            <LossSpan price={lossPrice}>
              <FormatPriceCell
                value={lossPrice === 0 ? '-' : lossPrice}
                symbol={row?.symbol}
                type={row?.stopPriceType}
              />
            </LossSpan>
          </PnlWrapper>
        );
      },
    };

    const createTime = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.activeOrders.time')}>
          {_t('contract.history.rate.time')}
        </Text>
      ),
      dataIndex: 'createdAt',
      align: 'left',
      render: (value, row) => {
        return (
          <>
            <span>{moment2Intl({ date: row.createdAt, format: 'YYYY/MM/DD HH:mm:ss' })}</span>
          </>
        );
      },
    };

    const operationBtn = {
      title: isMd ? (
        _t('margin.entrustList.title.action')
      ) : (
        <PointerText onClick={showCancelConfirm}>
          <Text
            className="primary-text"
            underline
            tips={_t('trade.tooltip.activeOrders.cancelAllActive')}
          >
            {_t('trade.positionsOrders.cancelAll')}
          </Text>
        </PointerText>
      ),
      dataIndex: 'operations',
      width: '100px',
      align: 'right',
      render: (value, row) => {
        return <CancelCell row={row} />;
      },
    };

    const commonColumns = [orderPrice, size, dealSize, orderValue, stopItem, createTime];
    if (screen === 'lg1') {
      return [[symbolItem], [orderPrice, size, dealSize, orderValue], [stopItem, createTime]];
    }

    if (screen === 'lg') {
      return [[symbolItem], [orderPrice, size, dealSize], [orderValue, stopItem, createTime]];
    }

    if (screen === 'lg2' || screen === 'lg3') {
      return [symbolItem, type, ...commonColumns, operationBtn];
    }

    return [symbolItem, ...commonColumns, operationBtn];
  }, [isMd, showCancelConfirm, screen, isMobile]);

  return (
    <>
      <Table
        className="futures-table futures-active-orders"
        data={dataSource}
        needHeader={!isMobile}
        screen={screen}
        columns={columns}
        Footer={
          isOpenFuturesCross() ? (
            <LinkAll
              count={ACTIVE_ORDER_COUNT}
              type={_t('orders.c.order.cur')}
              path="/order/futures/open-order"
            />
          ) : null
        }
      />
    </>
  );
};

export default memo(OpenOrdersTable);
