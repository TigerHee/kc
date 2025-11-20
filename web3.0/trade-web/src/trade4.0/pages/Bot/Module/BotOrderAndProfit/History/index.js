/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import useTicker from 'Bot/hooks/useTicker';
import LoginAndLoadingWrapper from '../components/LoginAndLoadingWrapper';
import { Table } from 'Bot/components/Common/CTable';
import StrategyPart from 'Bot/Strategies';
import { WrapperContext } from '../config';
import OrderDetailDrawerRef from 'Bot/Strategies/components/OrderDetailDrawerRef';
import { HistoryProvider } from '../Running/runContext';

const modelConfig = {
  name: 'BotHistory',
  effect: 'getHistoryLists',
  stateKey: 'lists',
};
export default ({ className }) => {
  const screen = React.useContext(WrapperContext);
  const allCouponMap = useSelector((state) => state.BotCoupon.allHistoryCouponMap);
  const lists = useSelector((state) => state.BotHistory.lists);
  const dispatch = useDispatch();
  React.useLayoutEffect(() => {
    dispatch({
      type: 'BotCoupon/watchRunning',
    });
  }, [dispatch]);
  const onFresh = React.useCallback(() => {
    dispatch({
      type: 'BotHistory/getHistoryLists',
    });
  }, [dispatch]);
  useTicker(onFresh);

  const DetailRef = React.useRef();
  const onDetail = React.useCallback((props) => {
    DetailRef.current.show(props);
  }, []);
  const runCtxVal = useRef({
    onDetail,
  });
  return (
    <LoginAndLoadingWrapper screen={screen} modelConfig={modelConfig}>
      <HistoryProvider value={runCtxVal}>
        <Table
          type="history"
          screen={screen}
          className={`history-lists history-lists-${screen} ${className}`}
        >
          {lists.map((bot) => {
            return (
              <StrategyPart
                currentBot={bot.type}
                part="History"
                key={bot.id}
                item={bot}
                coupon={allCouponMap[bot.id]} // 卡券数据
              />
            );
          })}
        </Table>
      </HistoryProvider>
      <OrderDetailDrawerRef ref={DetailRef} mode="history" />
    </LoginAndLoadingWrapper>
  );
};
