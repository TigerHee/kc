/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import { delay } from 'dva/saga';
import base from 'common/models/base';
import polling from 'common/models/polling';
import _ from 'lodash';
import * as service from 'services/trade';
import { pullAuctionOrders } from '@/services/callAuction';
import { Decimal, getPrecisionFromIncrement } from 'helper';
import storage from 'utils/storage';
import { isABNew } from '@/meta/const';
import {
  genL2Cache,
  genWSCalibration,
  genLogger,
  genDataQueue,
} from 'common/utils/modelHelper';
import level2DepthCalc, {
  fightDepthCalcLock,
  stashUpdates,
  popUpdates,
  cleanUpdates,
} from 'common/utils/level2DepthCalc';
import openOrdersStore from 'src/pages/Trade3.0/stores/store.openOrders';
import selectSync from 'utils/createAppSelect';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import { getModelAuctionInfo } from '@/utils/business';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

// 回流缓存
const l2Cache = genL2Cache();
const wsCalibration = genWSCalibration();
const logger = genLogger();
const dataQueue = genDataQueue(10);

// 全量校准流程
//   接收并缓存收到的l2update数据流
//   发起一次REST (GET /order_book?level=2)请求，获得l2 orderbook的快照数据(snapshot)
//   回放缓存的l2update数据流, 直到找到snapshot的sequence位于某个l2update的sequence_start和sequence_end之间，丢掉小于此sequence_start的所有l2update，从此l2update开始把变更回放到snapshot上
//   持续将新的l2update数据流变化应用到本地的snapshot上，确保新的l2update的sequence_start刚好和上一个l2update的sequence_end连续（ new.sequence_start - old.sequence.end = 1)
// fullData: { sequence, asks, bids }
const applyL2UpdateWithFull = (symbol, fullData, minSize = 0) => {
  const cached = l2Cache.get(symbol);
  const { sequence, asks, bids } = fullData;

  // 找到回放节点
  let usefullL2Updates = cached.filter(({ sequenceStart }) => {
    return sequenceStart > sequence;
  });

  logger.log(
    usefullL2Updates,
    wsCalibration.getSequenceLastMap(symbol),
    sequence,
    wsCalibration.getDropMap(symbol),
  );

  if (usefullL2Updates && usefullL2Updates.length > 0) {
    const { sequenceStart } = usefullL2Updates[0];
    wsCalibration.calibration(symbol, sequenceStart, sequence);
  } else {
    const lastSeq = wsCalibration.getSequenceLastMap(symbol);
    if (`${lastSeq}` === `${sequence}`) {
      // 全量和当前seq一致，因此不需要再校验
    } else {
      wsCalibration.calibration(symbol, sequence);
      wsCalibration.setSequenceLastMap(symbol, sequence);
    }
  }

  if (!wsCalibration.getDropMap(symbol)) {
    // 不连续，不应用变更
    logger.log(
      wsCalibration.getDropMap(symbol),
      sequence,
      usefullL2Updates,
      'break',
    );
    usefullL2Updates = [];
  }

  const oldAsksMap = _.reduce(
    asks,
    (acc, item) => {
      acc[`${item[0]}`] = item[1];
      return acc;
    },
    {},
  );

  const oldBidsMap = _.reduce(
    bids,
    (acc, item) => {
      acc[`${item[0]}`] = item[1];
      return acc;
    },
    {},
  );

  _.each(usefullL2Updates, ({ changes }) => {
    const _asks = changes.asks;
    const _bids = changes.bids;

    _.each(_asks, ([price, amount, seq]) => {
      if (seq > sequence) {
        oldAsksMap[`${price}`] = amount;
      }
    });
    _.each(_bids, ([price, amount, seq]) => {
      if (seq > sequence) {
        oldBidsMap[`${price}`] = amount;
      }
    });
  });

  const updatedAsks = _.map(oldAsksMap, (amount, price) => [price, amount])
    .filter((item) => item[1] >= minSize)
    .sort((a, b) => b[0] - a[0]); // 与后端接口一致统一倒序

  const updatedBids = _.map(oldBidsMap, (amount, price) => [price, amount])
    .filter((item) => item[1] >= minSize)
    .sort((a, b) => b[0] - a[0]); // 与后端接口一致统一倒序

  return {
    asks: updatedAsks,
    bids: updatedBids,
  };
};

/**
 * 记录价格交叉事件上报
 * @param {String} symbol
 */
const logCrossMarket = async (symbol) => {
  const fullData = await openOrdersStore.handler.select(
    (state) => state.openOrders.fullData[symbol],
  );

  let asks = [];
  let bids = [];
  if (fullData) {
    asks = (fullData.sell || []).slice(-10);
    bids = (fullData.buy || []).slice(0, 10);
  }
  const lastSeq = wsCalibration.getSequenceLastMap(symbol);
  const records = dataQueue.getItems();
  const msg = { lastSeq, records, old: { asks, bids } };

  logger.log('OpenOrders Cross Market');
  // console.log('OpenOrders Cross Market', JSON.stringify(msg));
};

/**
 * 刷新store数据
 * @param {*} param0
 */
const updateOrders = async (payload) => {
  const {
    isFull,
    coinPair,
    updateFull,
    maxPrice,
    listAsksDepth,
    listBidsDepth,
    askLimitAmount,
    askLimitReduceAmount,
    askLimitPrice,
    bidLimitAmount,
    bidLimitReduceAmount,
    bidLimitPrice,
    isAuction,
  } = payload;

  if (!isFull && !wsCalibration.getDropMap(coinPair)) {
    // 消息不连续，除了全量，不接受任何数据更新
    return;
  }

  const state = await openOrdersStore.handler.select(
    (_state) => _state.openOrders,
  );

  let fullUpdate = {};
  if (updateFull) {
    fullUpdate = {
      fullData: {
        ...state.fullData,
        [coinPair]: {
          ...state.fullData[coinPair],
          sell: updateFull.sellOrders,
          buy: updateFull.buyOrders,
        },
      },
    };
  }

  // all desc, if bid1 is bigger than ask1, don't apply this update
  // console.log(listAsksDepth, listBidsDepth);
  let showUpdate = {
    [coinPair]: {
      ...state[coinPair],
      maxPrice,
      askLimitAmount,
      askLimitReduceAmount,
      askLimitPrice,
      bidLimitAmount,
      bidLimitReduceAmount,
      bidLimitPrice,
      sell: listAsksDepth,
      buy: listBidsDepth,
    },
  };
  let logShowUpdatePrevent = false;
  const PRICE_DEAULT = { price: 0 };
  const _lastAsk = listAsksDepth[listAsksDepth.length - 1];
  const lastAsk = _lastAsk || PRICE_DEAULT;
  const firstBid = listBidsDepth[0] || PRICE_DEAULT;
  // 集合竞价允许价格交叉
  if (isAuction !== true && (+firstBid.price > +lastAsk.price && _lastAsk !== undefined)) {
    // 不展示买卖盘数据，并手动打断消息，重新走构建校验
    logShowUpdatePrevent = true;
    showUpdate = {};
    wsCalibration.setDropMap(coinPair, false);

    console.log(
      'bid1 is bigger than ask1',
      _.map(listAsksDepth.slice(-2), ({ price }) => price),
      _.map(listBidsDepth.slice(0, 2), ({ price }) => price),
    );
  }

  // debugger;
  const updatePayload = {
    ...state,
    ...showUpdate,
    ...fullUpdate,
  };
  await openOrdersStore.handler.update(updatePayload);

  if (logShowUpdatePrevent) {
    logCrossMarket(coinPair);
  }
};

/**
 * 刷新store数据
 * @param {*} param0
 */
const updateOrders2 = async (payload) => {
  const {
    isFull,
    coinPair,
    updateFull,
    maxPrice,
    listAsksDepth,
    listBidsDepth,
    askLimitAmount,
    askLimitReduceAmount,
    askLimitPrice,
    bidLimitAmount,
    bidLimitReduceAmount,
    bidLimitPrice,
    isAuction,
  } = payload;
  if (!isFull && !wsCalibration.getDropMap(coinPair)) {
    // 消息不连续，除了全量，不接受任何数据更新
    return;
  }

  const state = await openOrdersStore.handler.select(_state => _state.openOrders);
  let fullUpdate = {};
  if (updateFull) {
    fullUpdate = {
      fullData: {
        ...state.fullData,
        [coinPair]: {
          ...state.fullData[coinPair],
          sell: updateFull.sellOrders,
          buy: updateFull.buyOrders,
        },
      },
    };
  }

  // all desc, if bid1 is bigger than ask1, don't apply this update
  // console.log(listAsksDepth, listBidsDepth);
  let showUpdate = {
    [coinPair]: {
      ...state[coinPair],
      maxPrice,
      askLimitAmount,
      askLimitReduceAmount,
      askLimitPrice,
      bidLimitAmount,
      bidLimitReduceAmount,
      bidLimitPrice,
      sell: listAsksDepth,
      buy: listBidsDepth,
    },
  };
  let logShowUpdatePrevent = false;
  const PRICE_DEAULT = { price: 0 };
  const _lastAsk = listAsksDepth[listAsksDepth.length - 1];
  const lastAsk = _lastAsk || PRICE_DEAULT;
  const firstBid = listBidsDepth[0] || PRICE_DEAULT;
  // 集合竞价允许价格交叉
  if (isAuction !== true && (+firstBid.price > +lastAsk.price && _lastAsk !== undefined)) {
    // 不展示买卖盘数据，并手动打断消息，重新走构建校验
    logShowUpdatePrevent = true;
    showUpdate = {};
    wsCalibration.setDropMap(coinPair, false);

    console.log(
      'bid1 is bigger than ask1',
      _.map(listAsksDepth.slice(-2), ({ price }) => price),
      _.map(listBidsDepth.slice(0, 2), ({ price }) => price),
    );
  }

  // debugger;
  const updatePayload = {
    ...state,
    ...showUpdate,
    ...fullUpdate,
  };
  await openOrdersStore.handler.update(updatePayload);

  if (logShowUpdatePrevent) {
    logCrossMarket(coinPair);
  }
};

/**
 * 数据更新到状态计算 data: { asks, bids } ，入参倒序
 * @param {*} param0
 * @param {*} param1
 */
const _updateByData = async ({ coinPair, data, isFull, isAuction }) => {
  let coin = coinPair.split('-')[0];
  let pair = coinPair.split('-')[1];
  coin = selectSync((state) => state.categories[coin]);
  pair = selectSync((state) => state.categories[pair]);

  const symbolsInfoMap = selectSync((state) => state.symbols.symbolsMap);
  const priceLimitRate = selectSync((state) => state.tradeForm.priceLimitRate);
  const symbolInfo = symbolsInfoMap[coinPair] || {};
  const pairPrecision = getPrecisionFromIncrement(symbolInfo.priceIncrement);
  const coinPrecision = getPrecisionFromIncrement(symbolInfo.baseIncrement);
  // const data = {
  //   asks: JSON.parse(tempSell).data.reverse(),
  //   bids: JSON.parse(tempBuy).data,
  // };
  const { groupMap } = await openOrdersStore.handler.select(
    (state) => state.openOrders,
  );

  const group = groupMap[coinPair];
  // 接口返回的买单与卖单都是价格降序排序
  if (data.asks && data.bids) {
    // calc in worker
    // const t1 = performance.now();
    const {
      maxPrice,
      listAsksDepth,
      listBidsDepth,
      askLimitAmount,
      askLimitReduceAmount,
      askLimitPrice,
      bidLimitAmount,
      bidLimitReduceAmount,
      bidLimitPrice,
    } = await level2DepthCalc(
      group,
      data.asks,
      data.bids,
      pairPrecision,
      coinPrecision,
      pairPrecision,
      priceLimitRate,
    );
    // const t2 = performance.now();
    // console.log(listAsksDepth.length, listBidsDepth.length, t2 - t1);

    await updateOrders({
      isFull,
      coinPair,
      maxPrice,
      listAsksDepth,
      listBidsDepth,
      askLimitAmount,
      askLimitReduceAmount,
      askLimitPrice,
      bidLimitAmount,
      bidLimitReduceAmount,
      bidLimitPrice,
      isAuction,
      updateFull: {
        sellOrders: data.asks,
        buyOrders: data.bids,
      },
    });
  }
};

/**
 * 数据更新到状态计算 data: { asks, bids } ，入参倒序
 * @param {*} param0
 * @param {*} param1
 */
const _updateByData2 = async ({ coinPair, data, isFull, isAuction }) => {
  let coin = coinPair.split('-')[0];
  let pair = coinPair.split('-')[1];
  coin = selectSync((state) => state.categories[coin]);
  pair = selectSync((state) => state.categories[pair]);

  const symbolsInfoMap = selectSync((state) => state.symbols.symbolsMap);
  const priceLimitRate = selectSync((state) => state.tradeForm.priceLimitRate);
  const symbolInfo = symbolsInfoMap[coinPair] || {};
  const pairPrecision = getPrecisionFromIncrement(symbolInfo.priceIncrement);
  const coinPrecision = getPrecisionFromIncrement(symbolInfo.baseIncrement);

  const { groupMap } = await openOrdersStore.handler.select(
    (state) => state.openOrders,
  );

  const group = groupMap[coinPair];
  // 接口返回的买单与卖单都是价格降序排序
  if (data.asks && data.bids) {
    // calc in worker
    // const t1 = performance.now();
    const {
      maxPrice,
      listAsksDepth,
      listBidsDepth,
      askLimitAmount,
      askLimitReduceAmount,
      askLimitPrice,
      bidLimitAmount,
      bidLimitReduceAmount,
      bidLimitPrice,
    } = await level2DepthCalc(
      group,
      data.asks,
      data.bids,
      pairPrecision,
      coinPrecision,
      pairPrecision,
      priceLimitRate,
    );
    // const t2 = performance.now();
    // console.log(listAsksDepth.length, listBidsDepth.length, t2 - t1);
    await updateOrders2({
      isFull: true,
      isAuction,
      coinPair,
      maxPrice,
      listAsksDepth,
      listBidsDepth,
      askLimitAmount,
      askLimitReduceAmount,
      askLimitPrice,
      bidLimitAmount,
      bidLimitReduceAmount,
      bidLimitPrice,
      updateFull: {
        sellOrders: data.asks,
        buyOrders: data.bids,
      },
    });
  }
};

/**
 * 实时数据更新
 * @param {*} param0
 * @param {*} param1
 */
const l2update = async ({ payload }) => {
  // 抢占worker锁
  const callResetLock = await stashUpdates(payload.coinPair, payload.changes);
  if (callResetLock === false) {
    return;
  }
  payload = popUpdates(payload.coinPair);
  if (!payload) {
    // 释放worker锁
    callResetLock();
    return;
  }
  const { coinPair, changes, isAuction } = payload;

  try {
    const symbolsInfoMap = selectSync((state) => state.symbols.symbolsMap);
    const symbolInfo = symbolsInfoMap[coinPair] || {};
    const minSize = symbolInfo.baseIncrement || 0;

    const fullData = await openOrdersStore.handler.select(
      (state) => state.openOrders.fullData[coinPair],
    );

    let asksNew = [];
    let bidsNew = [];
    if (fullData) {
      asksNew = fullData.sell || [];
      bidsNew = fullData.buy || [];
    }

    const asksMap = _.reduce(
      asksNew,
      (acc, item) => {
        acc[`${item[0]}`] = item[1];
        return acc;
      },
      {},
    );
    const bidsMap = _.reduce(
      bidsNew,
      (acc, item) => {
        acc[`${item[0]}`] = item[1];
        return acc;
      },
      {},
    );

    const _asks = changes.asks;
    const _bids = changes.bids;

    _.each(_asks, ([price, amount]) => {
      asksMap[`${price}`] = amount;
    });
    _.each(_bids, ([price, amount]) => {
      bidsMap[`${price}`] = amount;
    });

    const updatedAsks = _.map(asksMap, (amount, price) => [price, amount])
      .filter((item) => item[1] >= minSize)
      .sort((a, b) => b[0] - a[0]); // 倒序处理

    const updatedBids = _.map(bidsMap, (amount, price) => [price, amount])
      .filter((item) => item[1] >= minSize)
      .sort((a, b) => b[0] - a[0]); // 倒序处理

    await _updateByData({
      coinPair,
      isAuction,
      data: {
        asks: updatedAsks,
        bids: updatedBids,
      },
    });
  } catch (e) {
    throw e;
  } finally {
    // 释放worker锁
    callResetLock();
  }
};
/**
 * 实时数据更新
 * @param {*} param0
 * @param {*} param1
 */
const l2update2 = async ({ payload }) => {
  const { isAuction } = payload;
  // 抢占worker锁
  const callResetLock = await stashUpdates(payload.coinPair, payload.nextFull);
  if (callResetLock === false) {
    return;
  }
  payload = popUpdates(payload.coinPair);
  if (!payload) {
    // 释放worker锁
    callResetLock();
    return;
  }
  const { coinPair, changes } = payload;
  try {
    await _updateByData2({
      coinPair,
      isAuction,
      data: {
        asks: changes.asks,
        bids: changes.bids,
      },
    });
  } catch (e) {
    throw e;
  } finally {
    // 释放worker锁
    callResetLock();
  }
};

export default extend(base, polling, {
  namespace: 'openOrders',
  // 状态已经从redux转移到了stores/openOrders.store
  state: {
    // groupMap: {},
    // fullData: {},
  },
  reducers: {},
  effects: {
    *_test(__) {
      const _state = yield openOrdersStore.handler.select(
        (state) => state.openOrders['BTC-USDT'],
      );

      console.log(JSON.stringify(_state));
    },
    *pull({ payload: { coinPair, initAuction = false } }, { call, put, select, take }) {
      if (!coinPair) return;
      const connected = yield workerSocket.connected();
      if (connected && wsCalibration.getDropMap(coinPair) && !initAuction) return;

      const { groupMap } = yield openOrdersStore.handler.select(
        (state) => state.openOrders,
      );
      console.log(groupMap, '======');
      const coinPairGroup = groupMap?.[coinPair];
      let precision;
      if (coinPairGroup) {
        precision = 10 - (String(coinPairGroup).toString().length - 1);
      }

      // 抢占worker锁
      const callResetLock = yield fightDepthCalcLock(true);

      // 移除每次的缓存开启，移到在消息推送下来判断完就开启缓存
      // start cached l2update
      // l2Cache.unlock(coinPair);
      // logger.log('unlock');

      const [symbolsInfoMap, showAuction = false] = yield select((state) => {
        const showAuctionVal = getModelAuctionInfo(state, coinPair).showAuction;
        return [state.symbols.symbolsMap, showAuctionVal];
      });
      const symbolInfo = symbolsInfoMap[coinPair] || {};
      const isAuction = !!initAuction || !!showAuction;
      try {
        // 如果需要校准，则发送pull请求，根据返回值跟新end及校准状态
        // data: { sequence, asks, bids }
        const { data } = yield call(isAuction ? pullAuctionOrders : service.pullLevel2,
          coinPair, 500, { precision },
        );
        // 理论上rest比ws慢，但实际可能还没收到对应seq，这里手动等待消息追一部分全量
        // 通过sequence差值，计算大概的等待延时
        const { sequence } = data;
        const speed = wsCalibration.getSpeed();
        const lastSeq = wsCalibration.getSequenceLastMap(coinPair);
        let mayBeTs = 500;
        if (sequence && lastSeq && sequence - lastSeq > 1) {
          mayBeTs = (sequence - lastSeq) / speed;
          logger.log('maybe wait', mayBeTs);
          mayBeTs = mayBeTs > 3000 ? 3000 : mayBeTs;
          logger.log('will wait', mayBeTs);
        }
        yield call(delay, mayBeTs);

        // flush socket datas to l2Cache
        yield workerSocket.flush();

        // after flush, set dropMap to true
        wsCalibration.setDropMap(coinPair, true);

        // apply cached ws
        const applyData = applyL2UpdateWithFull(
          coinPair,
          data,
          symbolInfo.baseIncrement,
        );

        // stop and clean cached l2update
        l2Cache.lock(coinPair);
        cleanUpdates();
        logger.log('lock');

        yield _updateByData({
          isAuction,
          coinPair,
          data: applyData,
          isFull: true,
        });
      } catch (e) {
        // stop and clean cached l2update
        l2Cache.lock(coinPair);
        cleanUpdates();
        throw e;
      } finally {
        // 释放worker锁
        callResetLock();
      }
    },
    *setGroup(
      { type, payload: { coinPair, group, precision } },
      { select, put },
    ) {
      // 抢占worker锁
      const callResetLock = yield fightDepthCalcLock(true);

      try {
        // let { groupMap } = yield select(state => state.openOrders);
        let { groupMap } = yield openOrdersStore.handler.select(
          (state) => state.openOrders,
        );

        groupMap = { ...groupMap, [coinPair]: group };

        // yield put({ type: 'update', payload: { groupMap } });
        yield openOrdersStore.handler.update({ groupMap });
        // 切换精度时请求下轮训接口
        yield put({ type: 'pull', payload: { coinPair } });
        // 更新orders
        // const fullData = yield select(state => state.openOrders.fullData[coinPair]);
        const fullData = yield openOrdersStore.handler.select(
          (state) => state.openOrders.fullData[coinPair],
        );

        if (fullData) {
          const symbolsInfoMap = yield select(
            (state) => state.symbols.symbolsMap,
          );
          const priceLimitRate = yield select(
            (state) => state.tradeForm.priceLimitRate,
          );
          const symbolInfo = symbolsInfoMap[coinPair] || {};
          const pairPrecision = getPrecisionFromIncrement(
            symbolInfo.priceIncrement,
          );
          const coinPrecision = getPrecisionFromIncrement(
            symbolInfo.baseIncrement,
          );

          // calc in worker
          const {
            maxPrice,
            listAsksDepth,
            listBidsDepth,
            askLimitAmount,
            askLimitReduceAmount,
            askLimitPrice,
            bidLimitAmount,
            bidLimitReduceAmount,
            bidLimitPrice,
          } = yield level2DepthCalc(
            group,
            fullData.sell,
            fullData.buy,
            precision,
            coinPrecision,
            pairPrecision,
            priceLimitRate,
          );

          yield updateOrders({
            coinPair,
            maxPrice,
            listAsksDepth,
            listBidsDepth,
            askLimitAmount,
            askLimitReduceAmount,
            askLimitPrice,
            bidLimitAmount,
            bidLimitReduceAmount,
            bidLimitPrice,
          });
        }
        storage.setItem('openOrdersGroupMap', groupMap);
      } catch (e) {
        throw e;
      } finally {
        // 释放worker锁
        callResetLock();
      }
    },
  },
  subscriptions: {
    setUpOpenOrders({ dispatch }) {
      // 新版本bu不执行
      if (isABNew()) {
        return;
      }
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pull', interval: 5 * 1000 },
      });
    },
    restoreGroupMap({ dispatch }) {
      // 新版本bu不执行
      if (isABNew()) {
        return;
      }
      const groupMap = storage.getItem('openOrdersGroupMap') || {};

      // dispatch({ type: 'update', payload: { groupMap } });
      openOrdersStore.handler.update({ groupMap });
    },

    subscribeMessage({ dispatch }) {
      // 新版本bu不执行
      if (isABNew()) {
        return;
      }
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      window._x_test = () => dispatch({ type: '_test' });
      // logger
      window._x_ws_openorders_debug = () => logger.set(true);
      // 买卖盘数据处理
      const handler = (topicGa, isAuction = false) => (arr) => {
        // console.log('OPENPRDERSL2Limit50', arr);
        _.each(arr, (record) => {
          const { topic, data } = record;
          // 获取币种
          const symbol = (topic.match(/:[^_]+/)[0] || '').replace(':', '');
          wsCalibration.speed(arr.length || 0);
          window._x_topicTj(topicGa[0], topicGa[1] || '', arr.length);
          // debugger;
          wsCalibration.setDropMap(symbol, true);
          l2update2({
            payload: {
              coinPair: symbol,
              isAuction,
              nextFull: {
                asks: data.asks,
                bids: data.bids,
              },
            },
          });
        });
      };

      // 订阅websocket level2 update: order-book 50 档
      workerSocket.openOrdersL2Limit50(handler(['MARKET_LEVEL2_WEB', 'trade.l2update']));
      // }, 500, true);
      // 集合竞价买卖盘
      const fn = workerSocket[PushConf.OPENPRDERSAuctionLimit50.eventName];
      if (fn) {
        fn(handler(['openOrdersAuctionLimit50', ''], true));
      }
    },
  },
});
