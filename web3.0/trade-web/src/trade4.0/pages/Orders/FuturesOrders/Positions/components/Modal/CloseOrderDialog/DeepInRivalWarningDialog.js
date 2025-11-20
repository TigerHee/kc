/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { _t } from 'utils/lang';


import Dialog from '@/components/AdaptiveModal';

import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { useGetBestTicker } from '@/hooks/futures/useMarket';
import { FUTURES } from '@/meta/const';
import DeepIntoRival from '@/pages/Futures/components/DeepIntoRival';
// import { useGetBuySell1 } from '@/pages/Orderbook/hooks/useModelData';

const DeepInRivalWarningDialog = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futures_orders.deepInRivalVisible);
  const deepInRivalObject = useSelector((state) => state.futures_orders.deepInRivalObject);
  const loading = useSelector(
    (state) => state.loading.effects['futures_orders/createStopOrderFromShortcut'],
  );

  const bestInfo = useGetBestTicker();

  const symbolInfo = getSymbolInfo({ symbol: deepInRivalObject?.symbol, tradeType: FUTURES });

  const handleCloseDialog = useCallback(
    (e) => {
      dispatch({
        type: 'futures_orders/update',
        payload: {
          deepInRivalVisible: false,
        },
      });
    },
    [dispatch],
  );

  const handleSubmit = useCallback(() => {
    handleCloseDialog();
    dispatch({ type: 'futures_orders/checkStopOrderBeforeCreate', payload: deepInRivalObject });
  }, [deepInRivalObject, dispatch, handleCloseDialog]);

  return (
    <Dialog
      open={visible}
      okButtonProps={{ loading, disabled: loading }}
      onClose={handleCloseDialog}
      title={null}
      footer={null}
    >
      <DeepIntoRival
        values={{ price: deepInRivalObject?.price, size: deepInRivalObject?.size }}
        side={deepInRivalObject?.side}
        onClose={handleCloseDialog}
        onOk={handleSubmit}
        symbolInfo={symbolInfo}
        ask1={bestInfo?.ask1}
        bid1={bestInfo?.bid1}
      />
    </Dialog>
  );
};

export default React.memo(DeepInRivalWarningDialog);
