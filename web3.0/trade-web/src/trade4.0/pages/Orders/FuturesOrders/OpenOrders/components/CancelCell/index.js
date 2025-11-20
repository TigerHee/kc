/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, useContext } from 'react';
import Button from '@mui/Button';
import { Maintenance, useGetSymbolInfo, useI18n, useActiveOrder } from '@/pages/Futures/import';
import { WrapperContext } from '@/pages/Orders/OpenOrders/config';
import { FUTURES } from 'src/trade4.0/meta/const';

const CancelCell = ({ row }) => {
  const { symbol } = row;
  const { _t } = useI18n();
  const screen = useContext(WrapperContext);
  const { status } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { cancelOrder } = useActiveOrder();
  const isPc = screen === 'lg2' || screen === 'lg3';
  const isDisabled = status === 'Paused';
  const { id, isTrialFunds } = row;
  return (
    <>
      {isDisabled ? (
        <Maintenance />
      ) : (
        <Button
          className={isPc ? 'order-text60' : 'fontWei-400'}
          onClick={() => cancelOrder(id, isTrialFunds, row)}
          variant="text"
          type="default"
          size="mini"
        >
          {_t('trade.positionsOrders.cancel')}
        </Button>
      )}
    </>
  );
};
export default memo(CancelCell);
