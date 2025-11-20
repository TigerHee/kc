/**
 * @owner: Clyne@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import { _t } from 'src/utils/lang';
import useActiveOrder from '@/hooks/futures/useActiveOrder';
import useAdvancedOrders from '@/hooks/futures/useOrderStop';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import { fx, styled } from 'src/trade4.0/style/emotion';
import { useSelector } from 'dva';
import { futuresPositionNameSpace } from '../../config';

const CancelWrapper = styled.div`
  ${fx.cursor('help')}
  text-align: right;
`;

const MCancel = memo(({ activeIndex }) => {
  const tradeType = useTradeType();
  const { showCancelConfirm: showActiveOrderCancelAll } = useActiveOrder();
  const { showCancelAllModal: showStopOrderCancelAll } = useAdvancedOrders();
  const activeOrders = useSelector((state) => state[futuresPositionNameSpace].activeOrders);
  const stopOrders = useSelector((state) => state[futuresPositionNameSpace].stopOrders);
  const activeOrderEmpty =
    activeIndex === 'current' && (!activeOrders || activeOrders.length === 0);
  const stopOrderEmpty = activeIndex === 'stop' && (!stopOrders || stopOrders.length === 0);
  const onClick = useCallback(() => {
    if (activeIndex === 'current') {
      return showActiveOrderCancelAll();
    }
    if (activeIndex === 'stop') {
      return showStopOrderCancelAll();
    }
  }, [activeIndex, showActiveOrderCancelAll, showStopOrderCancelAll]);
  if (tradeType !== FUTURES || activeOrderEmpty || stopOrderEmpty) {
    return <></>;
  }
  return <CancelWrapper onClick={onClick}>{_t('trade.positionsOrders.cancelAll')}</CancelWrapper>;
});

export default MCancel;
