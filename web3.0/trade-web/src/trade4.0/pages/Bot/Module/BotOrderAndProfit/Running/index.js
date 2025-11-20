/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import useTicker from 'Bot/hooks/useTicker';
import LoginAndLoadingWrapper from '../components/LoginAndLoadingWrapper';
import { Table } from 'Bot/components/Common/CTable';
import StrategyPart from 'Bot/Strategies';
import { CloseBotDialogRef, CloseWaitOpenUnitDialog } from 'Bot/Strategies/components/CloseBot';
import OrderDetailDrawerRef from 'Bot/Strategies/components/OrderDetailDrawerRef';
import { WrapperContext } from '../config';
import { RunProvider } from './runContext';

const modelConfig = {
  name: 'BotRunning',
  effect: 'getRunningLists',
  stateKey: 'lists',
};
export default ({ className }) => {
  const screen = React.useContext(WrapperContext);
  const allCouponMap = useSelector((state) => state.BotCoupon.allCouponMap);
  const lists = useSelector((state) => state.BotRunning.lists);
  const dispatch = useDispatch();
  React.useLayoutEffect(() => {
    dispatch({
      type: 'BotCoupon/watchRunning',
    });
  }, [dispatch]);
  const onFresh = React.useCallback(() => {
    dispatch({
      type: 'BotRunning/getRunningLists',
    });
  }, [dispatch]);
  useTicker(onFresh);
  // 用户手动关闭
  const closeBotRef = React.useRef();
  const onTriggerStop = React.useCallback((childProps) => {
    closeBotRef.current.toggle(childProps);
  }, []);

  //  订单详情
  const DetailRef = React.useRef();
  const onDetail = React.useCallback((props) => {
    DetailRef.current.show(props);
  }, []);

  // 运行中策略, 异常自己关闭, 用户点击消除记录
  const onAutoStop = React.useCallback(({ item }) => {
    const doStop = (id) =>
      dispatch({
        type: 'BotRunning/toStopMachine',
        payload: {
          id,
          sellAllBase: false,
          buyBase: false,
        },
      });
    if (item.status === 'WAIT_OPEN_UNIT_PRICE') {
      CloseWaitOpenUnitDialog(() => {
        doStop(item.id);
      });
    } else {
      doStop(item.id);
    }
  }, []);

  const runCtxVal = useRef({
    onDetail,
    onAutoStop,
    onTriggerStop,
  });
  return (
    <LoginAndLoadingWrapper screen={screen} modelConfig={modelConfig}>
      <RunProvider value={runCtxVal}>
        <Table
          type="running"
          screen={screen}
          className={`running-lists running-lists-${screen} ${className}`}
        >
          {lists.map((bot) => {
            return (
              <StrategyPart
                currentBot={bot.type}
                part="Running"
                key={bot.id}
                item={bot}
                coupon={allCouponMap[bot.id]} // 卡券数据
                onFresh={onFresh}
              />
            );
          })}
        </Table>
      </RunProvider>
      <CloseBotDialogRef dialogRef={closeBotRef} />
      <OrderDetailDrawerRef ref={DetailRef} mode="running" />
    </LoginAndLoadingWrapper>
  );
};
