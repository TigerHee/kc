/*
 * @Owner: Clyne@kupotech.com
 */
import React, { useContext, useEffect } from 'react';
// import ComponentWrapper from '@/components/ComponentWrapper';
// import { useGetPosTableData } from '@/hooks/futures/usePosition';
import Table from '@/components/VirtualizedTable';
// import { breakPoints, name } from './config';
import { WrapperContext } from '@/pages/Fund/config';
import loadable from '@loadable/component';
import { BIClick, POSITIONS } from 'src/trade4.0/meta/futuresSensors/list';
import PasswordCheckModal from '../PasswordCheckModal';
import AppendMarginDialog from './components/AppendMarginDialog';
import CloseOrderDialog from './components/CloseOrderDialog';
import TPAndSLDialog from './components/TPAndSLDialog';
import { useColumns } from './hooks/useColumns';
import useReorderPosition from './hooks/useReorderPosition';
import Init from './Init';

const OperatorMargin = loadable(() =>
  import(
    /* webpackChunkName: 'futures-order-dialog' */ '@/pages/Futures/components/OperatorMargin'
  ),
);

/**
 * 平仓撤单止盈止损dialog
 */
const LiquidationPLWarningDialog = loadable(() =>
  import(
    /* webpackChunkName: 'futures-order-dialog' */ './components/CloseOrderDialog/LiquidationPLWarningDialog' // eslint-disable-line
  ),
);

/**
 * 深入买卖盘dialog
 */
const DeepInRivalWarningDialog = loadable(() =>
  import(
    /* webpackChunkName: 'futures-order-dialog' */ './components/CloseOrderDialog/DeepInRivalWarningDialog' // eslint-disable-line
  ),
);

const PositionsList = () => {
  const screen = useContext(WrapperContext);
  const isMobile = screen === 'md' || screen === 'lg' || screen === 'lg1';
  const columns = useColumns();
  const data = useReorderPosition();

  useEffect(() => {
    BIClick([POSITIONS.BLOCK_ID, POSITIONS.LIST_EXPOSE]);
  }, []);

  return (
    <Table
      className={`futures-list-wrapper  futures-table futures-positions noWrapper-padding`}
      data={data}
      needHeader={!isMobile}
      screen={screen}
      columns={columns}
      Footer={<span />}
    />
  );
};

const NewPosition = () => {
  return (
    <>
      <PositionsList />
      <Init />
      <AppendMarginDialog />
      <CloseOrderDialog />
      <TPAndSLDialog />
      <OperatorMargin />
      <LiquidationPLWarningDialog />
      <DeepInRivalWarningDialog />
      <PasswordCheckModal />
    </>
  );
};

export default React.memo(NewPosition);
