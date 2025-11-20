/**
 * Owner: borden@kupotech.com
 */
import { each } from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import socketStore from 'src/pages/Trade3.0/stores/store.socket';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import { POLLING_FIVE_SEC } from 'utils/hooks/usePolling/constants';

export default extend(base, polling, {
  namespace: 'socket',
  state: {
    // level3Arr: [],
    // mv to stores/socket.stores
    // currentOrders: [],
    // advancedOrders: [],
    // updateCandles: [],
    // addCandles: [],
    wsConnected: true,
  },
  reducers: {},
  effects: {
    *wsConnectedPull(_, { select, put }) {
      const connected = yield workerSocket.connected();
      const wsConnected = !!connected;
      const wsConnectedPrev = yield select(state => state.socket.wsConnected);
      if (wsConnectedPrev !== wsConnected) {
        yield put({
          type: 'update',
          payload: {
            wsConnected,
          },
        });
      }
    },
  },
  subscriptions: {
    wsConnectedState({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'wsConnectedPull', interval: POLLING_FIVE_SEC },
      });
    },
    setUpSocket({ dispatch }) {
      workerSocket.debtRatioMessage((arr) => {
        window._x_topicTj('/margin/position', 'debt.ratio', arr.length);
        let result = null;
        each(arr, ({ data }) => {
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
      // 全仓仓位变更推送
      workerSocket.crossBalanceChangeMessage((payload) => {
        dispatch({
          type: 'user_assets/updateBalance',
          payload: {
            banchMapMargin: payload,
          },
        });
      });
      workerSocket.tradeOrdersBatchMessage((arr) => {
        window._x_topicTj('/spotMarket/tradeOrders', '', arr.length);

        // 已在worker中预处理，arr数据不是订单数据
        socketStore.handler.update({
          currentOrders: arr,
        });
      });
      workerSocket.advancedOrdersMessage((arr) => {
        window._x_topicTj('/spotMarket/advancedOrders', 'stopOrder', arr.length);
        socketStore.handler.update({
          advancedOrders: [],
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
      workerSocket.candleUpdateMessage((arr) => {
        window._x_topicTj('MARKET_CANDLES', 'trade.candles.update', arr.length);
        socketStore.handler.update({
          updateCandles: arr,
        });
      });
      workerSocket.candleAddMessage((arr) => {
        window._x_topicTj('MARKET_CANDLES', 'trade.candles.add', arr.length);
        socketStore.handler.update({
          addCandles: arr,
        });
      });
      workerSocket.marginFundNavMessage((arr) => {
        window._x_topicTj('/margin-fund/nav:{SYMBOL_LIST}', 'margin-fund.nav', arr.length);
        socketStore.handler.update({
          netAssetValue: arr[0].data.netAssetValue,
        });
      });
    },
  },
});
