/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useCallback, useContext, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { formatDateTime } from 'helper';
import { isEqual } from 'lodash';

import { _t } from 'utils/lang';

import { ICOrdersHistoryOutlined } from '@kux/icons';

import CoinCurrency from '@/components/CoinCurrency';
import PrettyCurrency from '@/components/PrettyCurrency';
import Text from '@/components/Text';
import Table from '@/components/VirtualizedTable';
import ShareIcon from '@/pages/Futures/components/PnlShare/ShareIcon';
import { fx, styled } from '@/style/emotion';

import { useOpenDetail } from './components/Modal/Detail/hooks/useDetail';
import { WrapperContext } from './config';

import LinkAll from '../components/LinkAll';
import SymbolCell from '../components/NewSymbolCell';
import { FILLS_MAX_COUNT } from '../config';
import useRealizedPNLData from '../hooks/RealizedPNL/useRealizedPNLData';
import { CoinWrapper, LineCancelWrapper } from '../style';

const TypeCellWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${(props) =>
    fx.color(props, props.type ? (props.type?.match('SHORT') ? 'secondary' : 'primary') : 'unset')}
`;

const Icon = styled(ICOrdersHistoryOutlined)`
  ${(props) => fx.color(props, 'primary')}
  ${fx.cursor('pointer')}
  ${fx.fontSize('14')}
`;

const TypeCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${(props) =>
    fx.color(props, props.type ? (props.type?.match('SHORT') ? 'secondary' : 'primary') : 'unset')}
`;

const getSymbolProps = (row, screen) => {
  const { symbol, isTrialFunds, marginMode } = row;
  return { symbol, isTrialFunds, marginMode, screen };
};

const RealizedPNLTable = () => {
  const dataSource = useRealizedPNLData();
  const _screen = useContext(WrapperContext);
  // lg也展示md的样式
  const screen = _screen === 'lg' || _screen === 'lg1' ? 'md' : _screen;
  const isMobile = screen === 'md' || screen === 'lg' || screen === 'lg1';
  const dispatch = useDispatch();

  const { openDetail } = useOpenDetail();
  const tablePagination = useSelector(
    (state) => state.futures_orders.closedPositionsPagination,
    isEqual,
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
      // width: '200px',
      render: (v, row) => {
        if (isMobile) {
          const comp = (
            <TypeCellWrapper className="marginL" type={row.type}>
              {row.type
                ? _t(`position.list.${row.type}`)
                : _t('trade.positionsOrders.closePosition')}
            </TypeCellWrapper>
          );
          return (
            <LineCancelWrapper className={`${screen} pnl-list`}>
              <SymbolCell
                {...getSymbolProps(row, screen)}
                comp={comp}
                lastSlot={<ShareIcon data={{ ...row }} type="pnl" showLine />}
              />
              <Icon size={16} onClick={() => openDetail(row)} />
            </LineCancelWrapper>
          );
        }
        return (
          <SymbolCell
            {...getSymbolProps(row, screen)}
            lastSlot={<ShareIcon data={{ ...row }} type="pnl" showLine />}
          />
        );
      },
    };
    const typeColumn = {
      title: _t('position.list.close.type'),
      dataIndex: 'type',
      render: (value, row) => {
        return (
          <TypeCell type={row.type}>
            {row.type ? _t(`position.list.${row.type}`) : _t('trade.positionsOrders.closePosition')}
          </TypeCell>
        );
      },
    };
    const realisedColumn = {
      title: (
        <Text cursor="help" tips={_t('trade.tooltip.closedPositions.realisedPNL')}>
          {_t('realised.detial.title')}
        </Text>
      ),
      dataIndex: 'realisedPnl',
      render: (value, row) => {
        const { currency, realisedPnl } = row;
        const isLong = realisedPnl > 0;
        const textProps = isLong ? { long: true } : { short: true };
        return (
          <div className="noRtl">
            <Text {...textProps} className="text-color">
              <PrettyCurrency isShort value={realisedPnl} currency={currency} />
            </Text>
            <CoinWrapper>
              <CoinCurrency value={realisedPnl} coin={currency} />
            </CoinWrapper>
          </div>
        );
      },
    };

    const timeColumn = {
      title: _t('trade.tooltip.closedPositions.time'),
      dataIndex: 'closeDate',
      render: (value, row) => <>{formatDateTime(row.closeDate, 'YYYY/MM/DD HH:mm:ss')}</>,
    };

    const optColumn = {
      title: _t('realised.detail'),
      width: '80px',
      align: 'right',
      render: (value, row) => {
        return <Icon size={16} onClick={() => openDetail(row)} />;
      },
    };

    if (screen === 'lg3' || screen === 'lg2') {
      return [symbolItem, typeColumn, realisedColumn, timeColumn, optColumn];
    }
    if (screen === 'lg' || screen === 'lg1') {
      return [[symbolItem], [realisedColumn, { ...timeColumn, flex: 2 }]];
    }

    return [symbolItem, realisedColumn, timeColumn];
  }, [isMobile, openDetail, screen]);

  const requestCallback = useCallback(
    async (nextPage) => {
      await dispatch({
        type: 'futures_orders/loadPrevClosedPositions',
        payload: { currentPage: nextPage },
      });
    },
    [dispatch],
  );

  return (
    <Table
      className="futures-table futures-pnl-list"
      data={dataSource}
      Footer={
        <LinkAll
          count={FILLS_MAX_COUNT}
          type={_t('realised.link.text')}
          path="/order/futures/pnl-history"
        />
      }
      requestCallback={requestCallback}
      pagination={tablePagination}
      needHeader={!isMobile}
      screen={screen}
      columns={columns}
    />
  );
};

export default memo(RealizedPNLTable);
