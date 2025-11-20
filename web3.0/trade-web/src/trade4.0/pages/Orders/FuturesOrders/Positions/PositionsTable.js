/**
 * Owner: charles.yang@kupotech.com
 */
/* eslint-disable max-len */
import React, { memo, useContext, useMemo } from 'react';
import Table from '@/components/VirtualizedTable';
import Text from '@/components/Text';
import { _t } from 'utils/lang';
import { Link } from 'components/Router';
import { WrapperContext } from '@/pages/Fund/config';
import SymbolCell from './components/SymbolCell';
import QtyCell from './components/QtyCell';
import ClosePositionCell from './components/ClosePositionCell';
import UnRealisedCell from './components/UnRealisedCell';
import StopCloseCell from './components/StopCloseCell';
import PriceCell from './components/PriceCell';
import MarginCell from './components/MarginCell';
import AutoDepositCell from './components/AutoDepositCell';
import LiquidationPriceCell from './components/LiquidationPriceCell';
import AppendMarginDialog from './components/Modal/AppendMarginDialog';
import CloseOrderDialog from './components/Modal/CloseOrderDialog';
import LiquidationPLWarningDialog from './components/Modal/CloseOrderDialog/LiquidationPLWarningDialog';
import DeepInRivalWarningDialog from './components/Modal/CloseOrderDialog/DeepInRivalWarningDialog';
import PasswordCheckModal from '../PasswordCheckModal';
import TakeProfitStopLossDialog from './components/Modal/TakeProfitStopLossDialog';
import MarkValueCell from './components/MarkValueCell';

import { SymbolCellWrapper, MobileSymbolCellContent, MarginAutoWrapper } from '../style';
import useFuturesPositionData from '../hooks/positions/useFuturesPositionData';

const FuturesPosition = () => {
  const dataSource = useFuturesPositionData();
  const screen = useContext(WrapperContext);
  const isMobile = screen === 'md' || screen === 'lg' || screen === 'lg1';
  const columns = useMemo(() => {
    const symbolColumn = {
      title: _t('head.contracts'),
      dataIndex: 'symbol',
      align: 'left',
      // TODO
      width: '200px',
      render: (v, row) => <SymbolCell row={row} />,
    };

    const mobileSymbolColumn = {
      title: _t('head.contracts'),
      dataIndex: 'symbol',
      noTitle: true,
      align: 'left',
      width: '140px',
      render: (v, row) => {
        return (
          <SymbolCellWrapper>
            <MobileSymbolCellContent className="mobile-symbol">
              <SymbolCell noFold row={row} />
            </MobileSymbolCellContent>
            {screen === 'lg1' || screen === 'lg' ? (
              <div>
                <ClosePositionCell
                  settleCurrency={row.settleCurrency}
                  noTitle={screen === 'md'}
                  posCost={row.posCost}
                  currentQty={row.currentQty}
                  symbol={row.symbol}
                  isTrialFunds={row?.isTrialFunds}
                />
              </div>
            ) : null}
          </SymbolCellWrapper>
        );
      },
    };
    const qtyColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.positions.quantity')}>
          {_t('assets.depositRecords.amount')}
        </Text>
      ),
      dataIndex: 'currentQty',
      render: (v, row) => <QtyCell isFold={screen !== 'lg3'} row={row} />,
    };

    const valueColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.positions.value')}>
          {_t('assets.tradeHistory.value')}
        </Text>
      ),
      dataIndex: 'markValue',
      render: (v, row) => <MarkValueCell row={row} />,
    };

    const entryPriceColumn = {
      title: (
        <>
          <Text cursor="help" tips={_t('trade.tooltip.positions.entryPrice')}>
            {_t('trade.positionsOrders.entryPrice')}
          </Text>
          {screen === 'lg2' || screen === 'lg3' ? <br /> : <span>/</span>}
          <Text cursor="help" tips={_t('trade.tooltip.positions.markPrice')} id="position1">
            {_t('refer.markPrice')}
          </Text>
        </>
      ),
      dataIndex: 'markPrice',
      render: (v, row) => {
        const { avgEntryPrice, markPrice, symbol } = row;
        return <PriceCell symbol={symbol} avgEntryPrice={avgEntryPrice} markPrice={markPrice} />;
      },
    };
    const liquidationPriceColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.positions.liquidationPrice')}>
          {_t('trade.positionsOrders.liquidationPrice')}
        </Text>
      ),
      dataIndex: 'liquidationPrice',
      render: (v, row) => {
        const { liquidationPrice, symbol } = row;
        return <LiquidationPriceCell symbol={symbol} liquidationPrice={liquidationPrice} />;
      },
    };
    const marginColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.positions.margin')}>
          {_t('trade.positionsOrders.margin')}
        </Text>
      ),
      dataIndex: 'maintMargin',
      render: (v, row) => {
        return <MarginCell row={row} />;
      },
    };
    const unrealisedPNLColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.positions.unrealisedPNL')}>
          {_t('trade.positionsOrders.unrealisedPNL')}
        </Text>
      ),
      dataIndex: 'unrealisedPnl',
      width: '168px',
      render: (v, row) => {
        return <UnRealisedCell row={row} />;
      },
    };
    const closeStopColumn = {
      title: _t('stopClose.profitLoss'),
      dataIndex: 'closeStop',
      render: (v, row) => {
        return <StopCloseCell row={row} />;
      },
    };
    const autoMarginDepositColumn = {
      title: (
        <Text
          cursor="help"
          tips={
            <>
              {_t('trade.tooltip.positions.autoDepositMargin1')}
              <Link target="_blank" to="/futures/refer/marginTrade">
                {_t('trade.tooltip.positions.autoDepositMargin2')}
              </Link>
            </>
          }
        >
          {_t('preferences.autoMarginDeposit')}
        </Text>
      ),
      dataIndex: 'autoDeposit',
      width: '100px',
      render: (v, row) => {
        return (
          <AutoDepositCell
            isTrialFunds={row.isTrialFunds}
            trialCode={row.trialCode}
            autoDeposit={row.autoDeposit}
            symbol={row.symbol}
          />
        );
      },
    };

    const closePositionColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.positions.closeOrder')}>
          {_t('trade.positionsOrders.closePosition')}
        </Text>
      ),
      dataIndex: 'closePosition',
      width: '168px',
      align: 'right',
      noTitle: screen === 'sm' || screen === 'md',
      render: (v, row) => {
        return (
          <ClosePositionCell
            settleCurrency={row.settleCurrency}
            noTitle={screen === 'sm' || screen === 'md'}
            posCost={row.posCost}
            currentQty={row.currentQty}
            symbol={row.symbol}
            isTrialFunds={row?.isTrialFunds}
          />
        );
      },
    };

    const marginAndAutoMargin = {
      title: (
        <>
          <Text cursor="help" tips={_t('trade.tooltip.positions.margin')}>
            {_t('trade.positionsOrders.margin')}
          </Text>
          {screen === 'lg2' || screen === 'lg3' ? <br /> : <span>/</span>}
          <Text
            cursor="help"
            tips={
              <>
                {_t('trade.tooltip.positions.autoDepositMargin1')}
                <Link target="_blank" to="/futures/refer/marginTrade">
                  {_t('trade.tooltip.positions.autoDepositMargin2')}
                </Link>
              </>
            }
          >
            {_t('preferences.autoMarginDeposit')}
          </Text>
        </>
      ),
      dataIndex: 'maintMargin',
      width: '168px',
      render: (v, row) => {
        return (
          <div>
            <MarginCell row={row} />
            <MarginAutoWrapper>
              <AutoDepositCell
                isTrialFunds={row.isTrialFunds}
                trialCode={row.trialCode}
                autoDeposit={row.autoDeposit}
                symbol={row.symbol}
              />
            </MarginAutoWrapper>
          </div>
        );
      },
    };

    if (screen === 'lg3') {
      return [
        symbolColumn,
        qtyColumn,
        valueColumn,
        entryPriceColumn,
        liquidationPriceColumn,
        marginColumn,
        unrealisedPNLColumn,
        closeStopColumn,
        autoMarginDepositColumn,
        closePositionColumn,
      ];
    }
    if (screen === 'lg2') {
      return [
        symbolColumn,
        qtyColumn,
        entryPriceColumn,
        liquidationPriceColumn,
        marginAndAutoMargin,
        unrealisedPNLColumn,
        closeStopColumn,
        closePositionColumn,
      ];
    }
    if (screen === 'lg1') {
      return [
        [mobileSymbolColumn],
        [qtyColumn, entryPriceColumn, liquidationPriceColumn, marginColumn],
        [unrealisedPNLColumn, closeStopColumn, { ...autoMarginDepositColumn, flex: 2 }],
      ];
    }

    if (screen === 'lg') {
      return [
        [mobileSymbolColumn],
        [qtyColumn, entryPriceColumn, liquidationPriceColumn],
        [marginAndAutoMargin, unrealisedPNLColumn, closeStopColumn],
      ];
    }

    return [
      mobileSymbolColumn,
      qtyColumn,
      entryPriceColumn,
      liquidationPriceColumn,
      marginColumn,
      unrealisedPNLColumn,
      closeStopColumn,
      autoMarginDepositColumn,
      closePositionColumn,
    ];
  }, [screen]);

  return (
    <>
      <Table
        className="futures-table futures-positions noWrapper-padding"
        data={dataSource}
        needHeader={!isMobile}
        screen={screen}
        columns={columns}
      />
      <DeepInRivalWarningDialog />
      <AppendMarginDialog />
      <CloseOrderDialog />
      <PasswordCheckModal />
      <LiquidationPLWarningDialog />
      <TakeProfitStopLossDialog />
    </>
  );
};

export default memo(FuturesPosition);
