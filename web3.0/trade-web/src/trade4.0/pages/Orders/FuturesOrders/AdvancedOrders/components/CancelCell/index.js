/**
 * Owner: clyne@kupotech.com
 */
import {
  FUTURES,
  Maintenance,
  useGetSymbolInfo,
  useI18n,
  useOrderStop,
} from '@/pages/Futures/import';
import { WrapperContext } from '@/pages/Orders/OpenOrders/config';
import Button from '@mui/Button';
import React, { useContext } from 'react';

const CancelCell = ({ row }) => {
  const { _t } = useI18n();
  const { symbol, id, type, isTrialFunds } = row;
  const { cancelOrder } = useOrderStop();
  const screen = useContext(WrapperContext);
  // 合约状态
  const { status } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const isPc = screen === 'lg2' || screen === 'lg3';
  const isDisabled = status === 'Paused';

  return (
    <>
      {isDisabled ? (
        <Maintenance />
      ) : (
        <Button
          className={isPc ? 'order-text60' : 'fontWei-400'}
          onClick={() => cancelOrder(id, isTrialFunds, row)}
          size="mini"
          type="default"
          variant="text"
        >
          {_t('trade.positionsOrders.cancel')}
        </Button>
      )}
    </>
  );
};

export default React.memo(CancelCell);
