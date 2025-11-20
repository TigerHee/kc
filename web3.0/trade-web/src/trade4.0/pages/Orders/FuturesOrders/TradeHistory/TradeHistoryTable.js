/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useCallback, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@/components/VirtualizedTable';
import { isEqual } from 'lodash';
import Text from '@/components/Text';
import SymbolCell from '../components/NewSymbolCell';
import TypeCell from '../components/TypeCell';
import { _t } from 'utils/lang';
import { WrapperContext } from '@/pages/Orders/TradeOrders/config';
import { formatDateTime, roundUpByStep, roundDownByStep } from 'helper';
import PrettyCurrency from '@/components/PrettyCurrency';
import LinkAll from '../components/LinkAll';
import PrettySize from '../components/PrettySize';
import { useFuturesSymbols } from '@/hooks/common/useSymbol';
import useGetTradeHistoryData from '../hooks/TradeHistory/useGetTradeHistoryData';
import { FILLS_MAX_COUNT } from '../config';
import FormatPriceCell from '../components/FormatPriceCell';
import { LineCancelWrapper } from '../style';

const getSymbolProps = (row, screen) => {
  const { symbol, isTrialFunds, marginMode } = row;
  return { symbol, isTrialFunds, marginMode, screen };
};

const TradeHistoryTable = () => {
  const contractsAll = useFuturesSymbols();
  const dataSource = useGetTradeHistoryData();
  const screen = useContext(WrapperContext);
  const isMobile = screen === 'md' || screen === 'lg' || screen === 'lg1';
  const dispatch = useDispatch();
  const tablePagination = useSelector((state) => state.futures_orders.fillsPagination, isEqual);
  const requestCallback = useCallback(
    async (nextPage) => {
      await dispatch({
        type: 'futures_orders/loadMoreFills',
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
      width: '300px',
      render: (v, row) => {
        if (isMobile) {
          const comp = (
            <TypeCell showAdvanced={false} isMobile={isMobile} {...row} showOrderType="active" />
          );
          return (
            <LineCancelWrapper className={screen}>
              <SymbolCell {...getSymbolProps(row, screen)} comp={comp} wrap={screen === 'md'} />
            </LineCancelWrapper>
          );
        }
        return <SymbolCell {...getSymbolProps(row, screen)} />;
      },
    };
    const typeColumn = {
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
        <Text cursor="help" tips={_t('trade.tooltip.fills.size')}>
          {_t('assets.depositRecords.amount')}
        </Text>
      ),
      dataIndex: 'size',
      width: '128px',
      render: (value, row) => (
        <PrettySize
          symbol={row.symbol}
          value={row.size}
          formatProps={{ negate: row.side === 'sell' }}
        />
      ),
    };
    const fillPriceColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.fills.filled')}>
          {_t('assets.tradeHistory.fillPrice')}
        </Text>
      ),
      dataIndex: 'price',
      render: (value, row) => {
        const { displayType, liquidationPrice, symbol } = row;
        let price = row?.price;
        const isLiquid = displayType === 'liquid';
        // 如果是强制平仓，则显示强平价格
        if (isLiquid) {
          price = liquidationPrice;
        }
        return <FormatPriceCell value={price} symbol={symbol} type={isLiquid ? 'MP' : 'TP'} />;
      },
    };
    const orderValueColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.fills.value')}>
          {_t('trade.positionsOrders.orderValue')}
        </Text>
      ),
      dataIndex: 'value',
      render: (value, row) => (
        <PrettyCurrency isShort currency={row.settleCurrency} value={row.value} />
      ),
    };
    const orderIdColumn = {
      title: _t('trade.positionsOrders.orderId'),
      dataIndex: 'orderId',
    };

    const timeColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.fills.time')}>
          {_t('contract.history.rate.time')}
        </Text>
      ),
      dataIndex: 'createdAt',
      width: '150px',
      align: 'right',
      render: (value, row) => {
        return (
          <>
            {screen !== 'lg2' ? (
              <span>{formatDateTime(row.createdAt, 'YYYY/MM/DD HH:mm:ss')}</span>
            ) : (
              <>
                <span>{formatDateTime(row.createdAt, 'YYYY/MM/DD')}</span>
                <br />
                <span>{formatDateTime(row.createdAt, 'HH:mm:ss')}</span>
              </>
            )}
          </>
        );
      },
    };

    const foldFillPriceAndOrderPriceCell = {
      title: (
        <>
          <Text cursor="help" tips={_t('trade.tooltip.fills.filled')}>
            {_t('assets.tradeHistory.fillPrice')}
          </Text>
          <br />
          <Text cursor="help" tips={_t('trade.tooltip.fills.value')}>
            {_t('trade.positionsOrders.orderValue')}
          </Text>
        </>
      ),
      dataIndex: 'price',
      width: '120px',
      render: (value, row) => {
        const { displayType, side, liquidationPrice, symbol } = row;
        const { tickSize = 0.1 } = contractsAll[symbol] || {};
        let price = Number(row.price || 0);
        // 如果是强制平仓，则显示强平价格
        if (displayType === 'liquid') {
          price = Number(liquidationPrice || 0);
          //  如果是小数，则需要按照tickSize取值
          if (price && !((price | 0) === price)) {
            if (side === 'sell') {
              price = roundUpByStep(price, tickSize);
            } else if (side === 'buy') {
              price = roundDownByStep(price, tickSize);
            }
          }
        }
        return (
          <>
            <span>
              <FormatPriceCell value={price} symbol={symbol} type="TP" />
            </span>
            <br />
            <PrettyCurrency isShort currency={row.settleCurrency} value={row.value} />
          </>
        );
      },
    };

    if (screen === 'lg3') {
      return [
        symbolItem,
        typeColumn,
        amountColumn,
        fillPriceColumn,
        orderValueColumn,
        orderIdColumn,
        timeColumn,
      ];
    }

    if (screen === 'lg2') {
      return [
        symbolItem,
        typeColumn,
        amountColumn,
        foldFillPriceAndOrderPriceCell,
        orderIdColumn,
        timeColumn,
      ];
    }

    if (screen === 'lg') {
      return [
        [symbolItem],
        [amountColumn, fillPriceColumn, orderValueColumn],
        [orderIdColumn, { ...timeColumn, flex: 2 }],
      ];
    }
    if (screen === 'lg1') {
      return [
        [symbolItem],
        [amountColumn, fillPriceColumn, orderValueColumn, orderIdColumn],
        [{ ...timeColumn, flex: 2 }],
      ];
    }

    return [symbolItem, amountColumn, fillPriceColumn, orderValueColumn, orderIdColumn, timeColumn];
  }, [contractsAll, isMobile, screen]);

  return (
    <>
      <Table
        className="futures-table futures-trade-history"
        data={dataSource}
        requestCallback={requestCallback}
        pagination={tablePagination}
        needHeader={!isMobile}
        screen={screen}
        Footer={
          <LinkAll
            count={FILLS_MAX_COUNT}
            type={_t('assets.tradeHistory')}
            path="/order/futures/trade-history"
          />
        }
        columns={columns}
      />
    </>
  );
};

export default memo(TradeHistoryTable);
