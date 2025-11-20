/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useCallback, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled, fx } from '@/style/emotion';
import Table from '@/components/VirtualizedTable';
import Text from '@/components/Text';
import { _t } from 'utils/lang';
import LinkAll from '../components/LinkAll';
import { ORDERS_MAX_COUNT, orderVars } from '@/pages/Orders/FuturesOrders/config';
import { moment2Intl } from 'helper';
import { dividedBy, multiply, abs, minus } from 'utils/operation';
import { ICOrdersHistoryOutlined } from '@kux/icons';
import { useFuturesSymbols } from '@/hooks/common/useSymbol';
import { WrapperContext } from '@/pages/Orders/HistoryOrders/config';
import { isEqual } from 'lodash';
import useOrderHistoryData from '../hooks/OrderHistory/useOrderHistoryData';
import SymbolCell from '../components/NewSymbolCell';
import TypeCell from '../components/TypeCell';
import PrettySize from '../components/PrettySize';
import { LineCancelWrapper } from '../style';
// import { FILLS_MAX_COUNT } from '../config';
import FormatPriceCell from '../components/FormatPriceCell';

const Icon = styled(ICOrdersHistoryOutlined)`
  ${(props) => fx.color(props, 'primary')}
  ${fx.cursor('pointer')}
  ${fx.fontSize('14')}
`;

const getSymbolProps = (row, screen) => {
  const { symbol, isTrialFunds, marginMode } = row;
  return { symbol, isTrialFunds, marginMode, screen };
};

const TradeHistoryTable = () => {
  const contractsAll = useFuturesSymbols();
  const { dataSource, showDetail } = useOrderHistoryData();
  const screen = useContext(WrapperContext);
  const isMobile = screen === 'md' || screen === 'lg' || screen === 'lg1';
  const dispatch = useDispatch();

  const tablePagination = useSelector(
    (state) => state.futures_orders.historyOrdersPagination,
    isEqual,
  );
  const requestCallback = useCallback(
    async (nextPage) => {
      await dispatch({
        type: 'futures_orders/loadMoreHistoryOrders',
        payload: { currentPage: nextPage },
      });
    },
    [dispatch],
  );

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
      render: (v, row) => {
        if (isMobile) {
          const comp = (
            <TypeCell showAdvanced={false} isMobile={isMobile} {...row} showOrderType="active" />
          );
          return (
            <LineCancelWrapper className={screen}>
              <SymbolCell {...getSymbolProps(row, screen)} comp={comp} wrap={screen === 'md'} />
              {screen === 'md' ? null : <Icon onClick={() => showDetail(row)} />}
            </LineCancelWrapper>
          );
        }
        return <SymbolCell {...getSymbolProps(row, screen)} />;
      },
    };
    const typeColumn = {
      width: '100px',
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.fills.type')}>
          {_t('contract.detail.type')}
        </Text>
      ),
      dataIndex: 'displayType',
      render: (value, row) => <TypeCell {...row} showAdvanced={false} />,
    };

    const amountColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.size')}>
          {_t('assets.depositRecords.amount')}
        </Text>
      ),
      dataIndex: 'size',
      width: '100px',
      render: (value, row) => (
        <PrettySize
          symbol={row.symbol}
          value={row.size}
          formatProps={{ negate: row.side === 'sell' }}
        />
      ),
    };

    const orderPriceColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.price')}>
          {_t('assets.OrderHistory.orderPrice')}
        </Text>
      ),
      dataIndex: 'price',
      render: (value, row) => {
        const { type, symbol, price } = row;
        if (type === 'market') {
          return _t(orderVars[type]);
        }
        return <FormatPriceCell value={price} symbol={symbol} type={'TP'} />;
      },
    };

    const filledColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.filled')}>
          {_t('trade.positionsOrders.filled')}
        </Text>
      ),
      dataIndex: 'dealSize',
      render: (value, row) => {
        const { symbol, dealSize } = row;
        return <PrettySize symbol={symbol} value={dealSize} />;
      },
    };

    const unfilledColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.unfilled')}>
          {_t('trade.positionsOrders.unfilled')}
        </Text>
      ),
      dataIndex: 'remaining',
      width: '100px',
      render: (v, row) => {
        const { size, dealSize, symbol } = row;
        const value = minus(size)(dealSize);
        return <PrettySize symbol={symbol} value={value} />;
      },
    };

    const stopPriceColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.stopPrice')}>
          {_t('trade.positionsOrders.stopPrice')}
        </Text>
      ),
      dataIndex: 'stopPrice',
      render: (value, row) => {
        const { stop, symbol, stopPrice } = row;
        return (
          <FormatPriceCell
            value={stopPrice}
            symbol={symbol}
            type={row?.stopPriceType}
            prefix={stop === 'up' ? '≥ ' : '≤ '}
          />
        );
      },
    };

    const fillPriceColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.fillPrice')}>
          {_t('assets.tradeHistory.fillPrice')}
        </Text>
      ),
      dataIndex: 'dealPrice',
      render: (value, row) => {
        const { dealValue, dealSize, symbol } = row;
        const { multiplier, isInverse } = contractsAll[symbol] || {};
        let dividedValue = abs(dividedBy(dealSize)(multiply(dealValue)(multiplier)));
        if (!isInverse) {
          dividedValue = dividedBy(dealValue)(multiply(dealSize)(multiplier));
        }
        // 根据tickSize的‘位数’截取
        const dealPrice = !+dealValue ? (
          '-'
        ) : (
          <FormatPriceCell value={dividedValue} symbol={symbol} type="TP" />
        );
        return dealPrice;
      },
    };

    const statusColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.status')}>
          {_t('assets.transactionHistory.status')}
        </Text>
      ),
      width: '80px',
      dataIndex: 'cancelExist',
      render: (value, row) => {
        const { cancelExist } = row;
        return cancelExist
          ? _t('trade.positionsOrders.canceled')
          : _t('assets.transactionHistory.status.Completed');
      },
    };

    const timeColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.orderHistory.time')}>
          {_t('contract.history.rate.time')}
        </Text>
      ),
      dataIndex: 'createdAt',
      width: '120px',
      render: (value, row) => {
        return (
          <>
            {screen === 'lg3' || screen === 'lg2' ? (
              <>
                <span>{moment2Intl({ date: row.createdAt, format: 'YYYY/MM/DD' })}</span>
                <br />
                <span>{moment2Intl({ date: row.createdAt, format: 'HH:mm:ss' })}</span>
              </>
            ) : (
              <span>{moment2Intl({ date: row.createdAt, format: 'YYYY/MM/DD HH:mm:ss' })}</span>
            )}
          </>
        );
      },
    };

    const operationsColumn = {
      title: _t('address.operation'),
      dataIndex: 'operations',
      width: '80px',
      align: 'right',
      render: (value, row) => {
        return (
          <Text
            cursor="pointer"
            arrow={false}
            underline={false}
            tips={_t('trade.tooltip.orderHistory.detail')}
          >
            <Icon onClick={() => showDetail(row)} />
          </Text>
        );
      },
    };

    const filledAndUnfilledColumn = {
      title: (
        <>
          <Text cursor="help" tips={_t('trade.tooltip.orderHistory.filled')}>
            {_t('trade.positionsOrders.filled')}
          </Text>
          <br />
          <Text cursor="help" tips={_t('trade.tooltip.orderHistory.unfilled')}>
            {_t('trade.positionsOrders.unfilled')}
          </Text>
        </>
      ),
      dataIndex: 'dealSize',
      width: '100px',
      render: (v, row) => {
        const { symbol, dealSize, size } = row;
        const value = minus(size)(dealSize);
        return (
          <>
            <PrettySize symbol={symbol} value={dealSize} />
            <br />
            <PrettySize symbol={symbol} value={value} />
          </>
        );
      },
    };

    if (screen === 'lg3') {
      return [
        symbolItem,
        typeColumn,
        amountColumn,
        orderPriceColumn,
        stopPriceColumn,
        fillPriceColumn,
        filledColumn,
        unfilledColumn,
        timeColumn,
        statusColumn,
        operationsColumn,
      ];
    }

    if (screen === 'lg2') {
      return [
        symbolItem,
        typeColumn,
        amountColumn,
        orderPriceColumn,
        stopPriceColumn,
        filledAndUnfilledColumn,
        fillPriceColumn,
        timeColumn,
        statusColumn,
        operationsColumn,
      ];
    }

    if (screen === 'lg1') {
      return [
        [symbolItem],
        [amountColumn, orderPriceColumn, filledColumn, unfilledColumn],
        [stopPriceColumn, fillPriceColumn, statusColumn, timeColumn],
      ];
    }

    if (screen === 'lg') {
      return [
        [symbolItem],
        [amountColumn, orderPriceColumn, filledColumn],
        [unfilledColumn, stopPriceColumn, fillPriceColumn],
        [statusColumn, { ...timeColumn, flex: 2 }],
      ];
    }

    return [
      symbolItem,
      amountColumn,
      orderPriceColumn,
      filledColumn,
      unfilledColumn,
      stopPriceColumn,
      fillPriceColumn,
      statusColumn,
      timeColumn,
      operationsColumn,
    ];
  }, [contractsAll, isMobile, screen, showDetail]);

  return (
    <>
      <Table
        className="futures-table futures-orders-history"
        data={dataSource}
        requestCallback={requestCallback}
        pagination={tablePagination}
        needHeader={!isMobile}
        screen={screen}
        Footer={
          <LinkAll
            count={ORDERS_MAX_COUNT}
            type={_t('assets.OrderHistory')}
            path="/order/futures/order-history"
          />
        }
        columns={columns}
      />
    </>
  );
};

export default memo(TradeHistoryTable);
