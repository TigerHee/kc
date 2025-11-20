/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FUTURES } from 'src/trade4.0/meta/const';

import {
  useGetBestTicker,
  getSymbolInfo,
  AdaptiveModal as Dialog,
  DeepIntoRivalContent as DeepIntoRival,
} from '@/pages/Futures/import';

import { namespace } from '../../config';

const DeepInRivalWarningDialog = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state[namespace].deepInRivalVisible);
  const deepInRivalObject = useSelector((state) => state[namespace].deepInRivalObject);
  const loading = useSelector(
    (state) => state.loading.effects[`${namespace}/createStopOrderFromShortcut`],
  );

  const bestInfo = useGetBestTicker();

  const symbolInfo = getSymbolInfo({ symbol: deepInRivalObject?.symbol, tradeType: FUTURES });

  const handleCloseDialog = useCallback(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        deepInRivalVisible: false,
      },
    });
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    handleCloseDialog();
    dispatch({ type: `${namespace}/checkStopOrderBeforeCreate`, payload: deepInRivalObject });
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
