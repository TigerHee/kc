/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import MD5 from 'crypto-js/md5';
import moment from 'moment';
import { toNumber, uniq, each } from 'lodash';
// import * as ws from '@kc/socket';
import base from 'common/models/base';
import polling from 'common/models/polling';
import * as serv from 'src/services/priceWarn';
import { getSymbolTick } from 'services/markets';

// 每次请求都带上不同的requestId
const requestId = () => {
  return MD5(`${moment().valueOf()}`).toString();
};

// const socket = ws.getInstance();

// 订阅websocket数据，只挂载一次事件
// let subscriptionWs = false;

export default extend(base, polling, {
  namespace: 'priceWarn',
  state: {
    formVisible: false,
    // symbol: null,
    // defaultPrice: null,
    formData: {
      symbol: '',
      warnType: 0,
    },
    records: [],
    // symbols: [],
    marketInfo: {},
    logs: [],
  },
  reducers: {},
  effects: {
    *pull({ payload }, { call, put }) {
      const { data } = yield call(serv.queryPriceNotifyList);
      yield put({
        type: 'update',
        payload: { records: data, symbols: uniq(data.map(v => v.symbol)) },
      });
      yield put({ type: 'pullLogs' });
    },
    *pullLogs({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.user);
      if (!user) return;
      const res = yield call(serv.fetchLogs, {
        isReverse: true,
        templateCodes: [
          'notification.risen.to',
          'notification.fell.to',
          'quotes.push.symbol.up',
          'quotes.push.symbol.down',
          'quotes.push.symbol.volatility',
        ].join(','),
      });
      const data = res.data.letterList || [];
      const logs = data
        .map(({ content, sendTime }) => {
          return { content, sendTime };
        })
        .sort((a, b) => b.sendTime - a.sendTime);
      yield put({
        type: 'update',
        payload: { logs },
      });
    },
    *receiveFormValues(
      {
        payload: { values },
      },
      { select, put },
    ) {
      const updates = {};
      // TODO
      // if ('symbol' in values) {
      //   const symbolDetail = yield select(_ => _.market.coinPairMap[values.symbol]);
      //   updates.defaultPrice = (symbolDetail || {}).lastTradePrice;
      // }
      // console.log('------------values-----------', values);
      const { formData } = yield select(_ => _.priceWarn);
      yield put({
        type: 'update',
        payload: {
          ...updates,
          formData: { ...formData, ...values },
        },
      });
    },
    *create(
      {
        payload: { values },
      },
      { call, put },
    ) {
      values.requestId = requestId();
      yield call(serv.create, values);
      yield put({ type: 'pull' });
      yield put({
        type: 'update',
        payload: {
          formVisible: false,
          symbol: '',
        },
      });
    },
    *creactAmplitudeWarn({ payload }, { put, call }) {
      yield call(serv.creactPriceNotify, payload);
      yield put({ type: 'pull' });
      yield put({
        type: 'update',
        payload: {
          formVisible: false,
        },
      });
    },
    *edit(
      {
        payload: { values },
      },
      { call, put },
    ) {
      yield call(serv.update, values);
      yield put({ type: 'pull' });
      yield put({
        type: 'update',
        payload: {
          formVisible: false,
          symbol: '',
        },
      });
    },
    *pause(
      {
        payload: { values },
      },
      { call, put },
    ) {
      yield call(serv.stop, values);
      yield put({ type: 'pull' });
    },
    *active(
      {
        payload: { values },
      },
      { call, put },
    ) {
      yield call(serv.active, values);
      yield put({ type: 'pull' });
    },
    *changeStatus({ payload }, { call, put }) {
      yield call(serv.changeStatus, payload);
      yield put({ type: 'pull' });
    },
    *remove(
      {
        payload: { values },
      },
      { call, put },
    ) {
      yield call(serv.remove, values);
      yield put({ type: 'pull' });
    },
    *newRemove(
      {
        payload = {},
      },
      { call, put },
    ) {
      yield call(serv.deletePriceNotify, payload);
      yield put({ type: 'pull' });
    },
    *pullMarketInfo(
      {
        payload: { symbol },
      },
      { call, put },
    ) {
      // // sokect正常连接并且topic_state为1时，阻止此次fetch
      // if (socket.connected()) {
      //   const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
      //     SYMBOLS: [symbol],
      //   });
      //   const topicStateData = socket.constructor.TOPIC_STATE.SUBSCRIBED;
      //   if (
      //     socket.topicState[topic] &&
      //     socket.topicState[topic][0] === topicStateData
      //   ) {
      //     return;
      //   }
      // }

      // console.log(symbol, 'pullMarketInfo~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      const { data } = yield call(getSymbolTick, { symbols: symbol });
      let marketInfo = {};
      data
        // .filter((v) => v)
        .forEach((item) => {
          if (symbol === item.symbol) {
            marketInfo = item;
          }
        });
      yield put({
        type: 'update',
        payload: { marketInfo },
      });
    },
    *updateSnapshot({ payload }, { put, select }) {
      const {
        formData: { symbol },
      } = yield select(state => state.priceWarn);
      let newMarketInfo = {};

      if (symbol) {
        each(payload, ({ data = {} }) => {
          const _data = data.data || {};
          const { symbolCode } = _data;
          if (symbolCode === symbol) {
            newMarketInfo = _data;
          }
        });
      }

      yield put({
        type: 'update',
        payload: { marketInfo: newMarketInfo },
      });
    },
  },
  subscriptions: {
    // @deprecated 未使用
    setUpPricewarn({ dispatch }) {
      // dispatch({
      //   type: 'watchPolling',
      //   payload: { effect: 'pullMarketInfo' },
      // });
    },
    // subscribeMessage({ dispatch }) {
    //   if (subscriptionWs) {
    //     return;
    //   }
    //   subscriptionWs = true;
    //   socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')((arr) => {
    //     dispatch({ type: 'updateSnapshot', payload: arr });
    //   });
    // },
  },
});
