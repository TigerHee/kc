/*
 * @owner: borden@kupotech.com
 * @desc: 推送回调的注册，统一管理
 */
import { useEffect } from 'react';
import { useDispatch } from 'dva';
import { forEach, eachRight, map } from 'lodash';
import socketStore from 'src/pages/Trade3.0/stores/store.socket';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import marketSnapshotStore from 'src/pages/Trade3.0/stores/store.marketSnapshot';
import { namespace as orderBookNamespace } from 'src/trade4.0/pages/Orderbook/config';
import { topicName } from '@/pages/Chart/config';
import { crossLiquidationNotify, isolatedLiquidationNotify } from '@/utils/voice/trigger';
import voice from '@/utils/voice';

export default function useRegisterSocketCallback() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 行情快照
    workerSocket.marketSnapshotMessage(async (arr) => {
      const ticks = await marketSnapshotStore.handler.select((state) => state.marketSnapshot);
      forEach(arr, ({ data = {} }) => {
        const _data = data.data || {};
        const sequence = data?.sequence || 0;
        const { symbolCode } = _data;

        if (symbolCode) {
          const oldTick = ticks[symbolCode] || {};
          // const { sequence: currentSequence = 0 } = oldTick;
          // if (sequence > currentSequence) {
          ticks[symbolCode] = {
            ...oldTick,
            ..._data,
            sequence,
          };
          // }
        }
      });
      marketSnapshotStore.handler.update(ticks);
    });
    // 余额推送
    workerSocket.accountBalanceMessage((payload) => {
      dispatch({
        type: 'user_assets/updateBalance',
        payload,
      });
    });
    // 全仓仓位变更推送
    workerSocket.crossBalanceChangeMessage((payload) => {
      dispatch({
        type: 'user_assets/updateBalance',
        payload: {
          banchMapMargin: payload,
        },
      });
    });
    // 全仓负债率
    workerSocket.debtRatioMessage((arr) => {
      window._x_topicTj('/margin/position', 'debt.ratio', arr.length);
      let result = null;
      eachRight(arr, ({ data }) => {
        try {
          if (result.timestamp < data.timestamp) {
            result = data;
          }
        } catch (e) {
          result = data;
        }
      });
      dispatch({
        type: 'marginMeta/updateDebtRatio',
        payload: { data: result },
      });
    });
    // 全仓仓位状态
    workerSocket.positionStatusMessage((arr) => {
      window._x_topicTj('/margin/position', 'position.status', arr.length);
      crossLiquidationNotify(arr[0] || {});
      dispatch({
        type: 'marginMeta/updateStatus',
        payload: arr[0],
      });
    });
    // 当前委托
    workerSocket.tradeOrdersBatchMessageF500((arr) => {
      window._x_topicTj('/spotMarket/tradeOrders', '', arr.length);

      // 已在worker中预处理，arr数据不是订单数据
      socketStore.handler.update({
        currentOrders: arr,
      });
    });
    // 高级委托
    workerSocket.advancedOrdersMessageF500((arr) => {
      window._x_topicTj('/spotMarket/advancedOrders', 'stopOrder', arr.length);
      socketStore.handler.update({
        advancedOrders: arr,
      });
    });
    // 集合竞价订单推送
    const callAuctionOrdersEvent = PushConf.CallAuctionOrders.eventName;
    workerSocket[callAuctionOrdersEvent]((arr) => {
      window._x_topicTj(callAuctionOrdersEvent, '', arr.length);
      socketStore.handler.update({
        currentOrders: [],
      });
    });
    // k线数据 (限频)--现货
    workerSocket.candleRefreshMessage((arr) => {
      window._x_topicTj(topicName, 'trade.candles.refresh', arr.length);
      socketStore.handler.update({
        refreshCandles: arr,
      });
    });
    // k线数据 (限频)--合约
    futuresWorkerSocket.topicCandleStick((arr) => {
      // console.log('arr --->', arr);
      // window._x_topicTj(futuresTopicName, 'trade.candles.refresh', arr.length);
      socketStore.handler.update({
        refreshCandles: arr,
      });
    });

    // 逐仓账户
    workerSocket.positionChangeMessage((arr) => {
      const arrLen = arr.length;
      window._x_topicTj('/margin/isolatedPosition', 'positionChange', arrLen);
      const { changeAssets, tag, ...other } = arr[arrLen - 1].data;
      const [base, quote] = tag.split('-');
      const baseAssets = changeAssets[base];
      const quoteAssets = changeAssets[quote];

      const changePosition = {
        tag,
        ...other,
        baseAsset: baseAssets
          ? {
              holdBalance: baseAssets.hold,
              totalBalance: baseAssets.total,
              liabilityInterest: baseAssets.liabilityInterest,
              liabilityPrincipal: baseAssets.liabilityPrincipal,
            }
          : null,
        quoteAsset: quoteAssets
          ? {
              holdBalance: quoteAssets.hold,
              totalBalance: quoteAssets.total,
              liabilityInterest: quoteAssets.liabilityInterest,
              liabilityPrincipal: quoteAssets.liabilityPrincipal,
            }
          : null,
      };
      isolatedLiquidationNotify(changePosition);
      dispatch({
        type: 'isolated/updateChangePosition',
        payload: changePosition,
      });
    });
    // 杠杆标记价格
    workerSocket.markPriceTickMessage((arr) => {
      window._x_topicTj('/indicator/markPrice', 'tick', arr.length);
      const diffMap = {};
      // 后来的先覆盖
      eachRight(arr, (_message) => {
        const { data = {} } = _message;
        const { symbol, value } = data;
        if (diffMap[symbol] === undefined) {
          diffMap[symbol] = value;
        }
      });
      /** update */
      dispatch({ type: 'isolated/updateTargetPrice', payload: diffMap });
      /** 粗略认为update时为render结束时进行计数*/
      dispatch({ type: 'isolated/sendSwSensor' });
    });
    // etf净值
    workerSocket.marginFundNavMessage((arr) => {
      window._x_topicTj('/margin-fund/nav:{SYMBOL_LIST}', 'margin-fund.nav', arr.length);
      dispatch({
        type: `${orderBookNamespace}/update`,
        payload: {
          netAssets: arr[0].data.netAssetValue,
        },
      });
    });
    // 消息中心
    workerSocket.noticeCenterMessage((arr) => {
      window._x_topicTj('NOTICE_CENTER', '', arr.length);
      const data = map(arr, (item) => {
        const res = {
          ...item.data,
          ...item,
          read: false,
        };
        delete res.userId;
        return res;
      });
      dispatch({
        type: 'notice_event/appendData',
        payload: {
          fromWS: true,
          append: data,
        },
      });
    });

    const notifyList = ['kumex.liqudation', 'kumex.adl'];
    // 合约消息中心
    workerSocket.futuresNoticeCenterMessage((arr) => {
      window._x_topicTj('NOTICE_CENTER', '', arr.length);
      let hasLiquid = false;
      const data = map(arr, (item) => {
        if (notifyList.includes(item.subject)) {
          hasLiquid = true;
        }
        const res = {
          ...item.data,
          ...item,
          read: false,
        };
        delete res.userId;
        return res;
      });
      dispatch({
        type: 'notice_event/appendData',
        payload: {
          fromWS: true,
          append: data,
        },
      });
      if (hasLiquid) {
        voice.notify('bankruptcy');
      }
    });
  }, [dispatch]);
}
