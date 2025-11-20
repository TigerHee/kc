/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import DetailHold from 'Bot/components/Common/DetailHold';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersStartOk from 'Bot/components/Common/OpenOrdersStartOk';
import useTicker from 'Bot/hooks/useTicker';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';

export default ({ isActive, onClose, runningData: { id, symbol }, mode }) => {
  const open = useSelector((state) => state.infinitygrid.open);
  const symbolInfo = useSpotSymbolInfo(symbol);
  const isFirstOpenOrdersLoading = useSelector((state) => state.infinitygrid.HistoryLoading);
  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    dispatch({
      type: 'infinitygrid/getOpenOrders',
      payload: {
        taskId: id,
        symbolCode: symbol,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);
  const currencies = open?.currencies || [];
  if (!open.items.length && !isFirstOpenOrdersLoading) {
    return <OpenOrdersStartOk isActive={isActive} />;
  }
  return (
    <div>
      <DetailHold currencies={currencies} symbolInfo={symbolInfo} />
      <OpenOrderPK buyNum={open.buyNum} sellNum={open.sellNum} />
      <OpenOrderTable data={open.items} info={symbolInfo} />
    </div>
  );
};
