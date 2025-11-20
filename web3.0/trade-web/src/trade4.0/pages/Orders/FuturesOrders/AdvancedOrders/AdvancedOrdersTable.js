/**
 * Owner: charles.yang@kupotech.com
 */
import PrettyValue from '@/components/PrettyValue';
import Text from '@/components/Text';
import Table from '@/components/VirtualizedTable';
import { useFuturesSymbols } from '@/hooks/common/useSymbol';
import { isOpenFuturesCross } from '@/meta/const';
import Maintenance from '@/pages/Orders/FuturesOrders/components/Maintenance';
import { ACTIVE_ORDER_COUNT, priceTypeToLocaleKey } from '@/pages/Orders/FuturesOrders/config';
import { WrapperContext } from '@/pages/Orders/OpenOrders/config';
import { Button } from '@kux/mui';
import { moment2Intl } from 'helper';
import React, { memo, useContext, useMemo } from 'react';
import { _t } from 'utils/lang';

import useAdvancedOrders, { useOrderStopTableData } from '@/hooks/futures/useOrderStop';
import { fx, styled } from '@/style/emotion';
import { useGetLeverage } from 'src/trade4.0/hooks/futures/useLeverage';
import { CROSS } from '../NewPosition/config';
import FormatPriceCell from '../components/FormatPriceCell';
import HiddenSize from '../components/HiddenSize';
import LinkAll from '../components/LinkAll';
import SymbolCell from '../components/NewSymbolCell';
import PrettySize from '../components/PrettySize';
import TypeCell from '../components/TypeCell';
import { POS_LEVERAGE, useShowFallback } from '../hooks/useShowFallback';
import { LineCancelWrapper } from '../style';
import CancelCell from './components/CancelCell';

const CancelButton = styled(Button)`
  ${fx.fontSize(12)}
  height: auto;
  font-weight: 400;
`;
const PointerText = styled.a`
  ${fx.cursor('pointer')}
  >span {
    ${(props) => fx.color(props, 'primary')}
    cursor: inherit;
  }
`;

const getSymbolProps = (row, screen) => {
  const { symbol, isTrialFunds, marginMode, leverage } = row;
  return { symbol, isTrialFunds, marginMode, leverage, screen };
};

// 订单杠杆修改
const SymbolCellRender = memo(({ row, screen, isMobile }) => {
  const { symbol, marginMode, isTrialFunds, leverage: lev } = row;
  const leverage = useGetLeverage({ symbol, marginMode });
  const _leverage = useShowFallback({
    marginMode,
    value: leverage,
    type: POS_LEVERAGE,
  });
  const isCross = marginMode === CROSS;
  const props = {
    symbol,
    isTrialFunds,
    marginMode,
    leverage: isCross ? _leverage : lev,
    screen,
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

const StopOrder = () => {
  const contracts = useFuturesSymbols();
  const screen = useContext(WrapperContext);
  const isMobile = screen === 'md' || screen === 'lg' || screen === 'lg1';
  const { cancelOrder, showCancelAllModal } = useAdvancedOrders();
  const dataSource = useOrderStopTableData();

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

    const commonColumns = [
      {
        title: (
          <Text cursor="help" tips={_t('orderStop.type.tip')}>
            {_t('contract.detail.type')}
          </Text>
        ),
        dataIndex: 'displayType',
        render: (value, row) => <TypeCell isMobile={isMobile} showOrderType="stop" {...row} />,
      },
      {
        title: (
          <Text cursor="help" tips={_t('trade.tooltip.stopOrders.stopPrice')}>
            {_t('trade.positionsOrders.stopPrice')}
          </Text>
        ),
        dataIndex: 'stopPrice',
        render: (value, row) => {
          const { stopPrice, stopPriceType } = row;
          return (
            <div className="text-color">
              <span>
                <FormatPriceCell value={stopPrice} type={stopPriceType} symbol={row?.symbol} />
              </span>
              <span>{`(${stopPriceType ? _t(priceTypeToLocaleKey[stopPriceType]) : '-'})`}</span>
            </div>
          );
        },
      },
      {
        title: (
          <Text cursor="help" tips={_t('trade.tooltip.activeOrders.price')}>
            {_t('assets.OrderHistory.orderPrice')}
          </Text>
        ),
        dataIndex: 'price',
        render: (value, row) => {
          if (row.type === 'market') {
            return _t('market');
          }
          return <FormatPriceCell value={row.price} type="TP" symbol={row?.symbol} />;
        },
      },
      {
        title: (
          <Text cursor="help" tips={_t('orderActive.amount.tip')}>
            {_t('assets.depositRecords.amount')}
          </Text>
        ),
        dataIndex: 'size',
        render: (value, row) => {
          if (row.shortcut) {
            return _t('orderStop.close.amount');
          }

          return (
            <div className="text-color">
              <PrettySize
                symbol={row.symbol}
                value={row.size}
                formatProps={{ negate: row.side === 'sell' }}
              />
              <HiddenSize {...row} />
            </div>
          );
        },
      },
      {
        title: (
          <Text cursor="help" tips={_t('orderStop.value.type')}>
            {_t('orderStop.value')}
          </Text>
        ),
        dataIndex: 'orderValue',
        render: (value, row) => {
          const { type: displayType, symbol, size, price } = row;
          if (displayType === 'market') {
            return '-';
          }
          return <PrettyValue symbol={symbol} size={size} price={price} />;
        },
      },
      {
        title: (
          <Text cursor="help" tips={_t('trade.tooltip.activeOrders.time')}>
            {_t('contract.history.rate.time')}
          </Text>
        ),
        dataIndex: 'createdAt',
        align: 'right',
        render: (value, row) => {
          return (
            <>
              <span>{moment2Intl({ date: row.createdAt, format: 'YYYY/MM/DD HH:mm:ss' })}</span>
            </>
          );
        },
      },
    ];

    if (screen === 'lg2' || screen === 'lg3') {
      return [
        symbolItem,
        ...commonColumns,
        {
          title: (
            <PointerText onClick={showCancelAllModal}>
            <Text
              styles={{ borderColor: '#24ae8f' }}
              underline
              tips={_t('trade.tooltip.activeOrders.cancelAllActive')}
            >
                {_t('trade.positionsOrders.cancelAll')}
            </Text>
            </PointerText>
          ),
          dataIndex: 'operations',
          width: '120px',
          align: 'right',
          render: (value, row) => {
            const { id, symbol, isTrialFunds } = row;
            // 合约状态
            const { status } = contracts[symbol] || '';
            const isDisabled = status === 'Paused';
            return (
              <>
                {isDisabled ? (
                  <Maintenance />
                ) : (
                  <div>
                    <Button
                      className="order-text60 fontWei-400"
                      variant="text"
                      onClick={() => cancelOrder(id, isTrialFunds, row)}
                      type="default"
                      size="mini"
                    >
                      {_t('trade.positionsOrders.cancel')}
                    </Button>
                  </div>
                )}
              </>
            );
          },
        },
      ];
    }

    if (screen === 'lg1') {
      return [
        [symbolItem],
        [commonColumns[1], commonColumns[2], commonColumns[3], commonColumns[4]],
        [{ ...commonColumns[5] }],
      ];
    }

    if (screen === 'lg') {
      return [
        [symbolItem],
        [commonColumns[1], commonColumns[2], commonColumns[3]],
        [commonColumns[4], { ...commonColumns[5] }, { render: () => null }],
      ];
    }

    return [
      symbolItem,
      commonColumns[1],
      commonColumns[2],
      commonColumns[3],
      commonColumns[4],
      commonColumns[5],
      {
        title: _t('margin.entrustList.title.action'),
        dataIndex: 'operations',
        width: '120px',
        render: (value, row) => {
          const { symbol, id, isTrialFunds } = row;
          // 合约状态
          const { status } = contracts[symbol] || '';
          const isDisabled = status === 'Paused';
          return (
            <>
              {isDisabled ? (
                <Maintenance />
              ) : (
                <CancelButton
                  onClick={() => cancelOrder(id, isTrialFunds, row)}
                  size={'small'}
                  type="brandGreen"
                  variant="text"
                >
                  {_t('trade.positionsOrders.cancel')}
                </CancelButton>
              )}
            </>
          );
        },
      },
    ];
  }, [cancelOrder, contracts, isMobile, screen, showCancelAllModal]);

  return (
    <>
      <Table
        className="futures-table futures-stop-orders"
        data={dataSource}
        needHeader={!isMobile}
        screen={screen}
        columns={columns}
        Footer={
          isOpenFuturesCross() ? (
            <LinkAll
              count={ACTIVE_ORDER_COUNT}
              type={_t('orders.c.order.advanced')}
              path="/order/futures/advance-order"
            />
          ) : null
        }
      />
    </>
  );
};

export default memo(StopOrder);
