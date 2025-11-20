/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getDealOrders } from 'services/trade';
import workerSocket from 'common/utils/socketProcess';
import { genLogger, genL2Cache, genWSCalibration } from 'common/utils/modelHelper';
import dealOrdersStore from 'src/pages/Trade3.0/stores/store.dealOrders';

// 所以，订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

// 回流缓存
const l2Cache = genL2Cache();
const wsCalibration = genWSCalibration();
const logger = genLogger();

// 全量校准流程
//   通过websocket订阅本频道
//   缓存收到的level3 match数据流,检查数据流sequence为连续数据
//   发起一次REST (GET /symbols/BTC-USDT/trades)请求，获得level3的最近100条成交记录(snapshot)
//   回放收到的level3 match类型数据流, 丢弃掉小于snapshot中最新一条记录的sequence的所有数据，直到数据流大于snapshot的最新一条成交记录
// fullData升序
const applyL3MatchWithFull = (symbol, fullData) => {
  if (!fullData || !fullData.length) {
    return [];
  }

  const cached = l2Cache.get(symbol);
  const latest = fullData[fullData.length - 1];
  logger.log('DealOrders full rest latest seq', latest.sequence);

  // 找到回放节点
  const usefull = cached.filter(({ sequence }) => {
    return sequence > latest.sequence;
  });

  if (usefull && usefull.length > 0) {
    const { sequence } = usefull[0];
    wsCalibration.calibration(symbol, sequence, latest.sequence);
  } else {
    wsCalibration.calibration(symbol, latest.sequence);
    wsCalibration.setSequenceLastMap(symbol, latest.sequence);
  }

  return fullData.concat(usefull);
};

const transUnix = (time) => {
  return (`${time}`).slice(0, 13);
};

const fullSymbol = symbol => `_full_${symbol}`;


/**
 * 更新到store
 * @param {*} param0
 */
const updateFullList = async ({ symbol, data }) => {
  const _data = (data || []).slice(-100); // 升序数据，取最近的100条
  await dealOrdersStore.handler.update({
    [fullSymbol(symbol)]: [..._data],
    [symbol]: _data.reverse().map((item, i) => {
      return {
        key: i,
        datetime: transUnix(item.time),
        type: item.side,
        price: item.price,
        amount: item.size,
        // volValue: item[4],
      };
    }),
  });
};

/**
 * 添加消息
 * @param {*} param0
 */
const appendL3match = async ({ symbol, data }) => {
  const oldOrders = await dealOrdersStore.handler.select(
    state => state.dealOrders[fullSymbol(symbol)] || [],
  );

  const lastOldOrder = oldOrders[oldOrders.length - 1];
  if (lastOldOrder) {
    const lastSeq = lastOldOrder.sequence;
    const filterArr = data.filter(({ sequence }) => sequence > lastSeq);
    if (filterArr.length > 0) {
      const applyData = oldOrders.concat(filterArr);

      await updateFullList({
        symbol,
        data: applyData,
      });
    } else {
      logger.log('DealOrders miss seq', lastSeq, data);
    }
  } else if (Array.isArray(data)) {
    await updateFullList({
      symbol,
      data,
    });
  }
};

export default extend(base, polling, {
  namespace: 'dealOrders',
  // 状态弃用，迁移到了stores/dealOrders.store
  state: {},
  reducers: {},
  effects: {
    *pull({ payload: { coinPair, limit, since } }, { call, put }) {
      if (!coinPair) return;
      const connected = yield workerSocket.connected();
      if (connected && wsCalibration.getDropMap(coinPair)) return;

      // start cached l2update
      l2Cache.unlock(coinPair);

      // full data
      /*
        sequence升序
        [{sequence: "1545738120025", price: "0.068", size: "0.056", side: "buy", time: 1545796054358171100}, ...]
      */
      try {
        const { data } = yield call(getDealOrders, coinPair, limit, since);
        wsCalibration.setDropMap(coinPair, true);

        // flush socket datas to l2Cache
        yield workerSocket.flush();

        // apply cached ws
        const applyData = applyL3MatchWithFull(coinPair, data);

        // stop and clean cached l2update
        l2Cache.lock(coinPair);

        yield updateFullList({
          symbol: coinPair,
          data: applyData,
        });
      } catch (e) {
        // stop and clean cached l2update
        l2Cache.lock(coinPair);
        throw e;
      }
    },

  },
  subscriptions: {
    setUpDealorders({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pull', interval: 60 * 60 * 1000 },
      });
    },

    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      // 订阅websocket trade.l3match
      workerSocket.dealOrdersMessage((arr) => {
        window._x_topicTj('MARKET_MATCH', 'trade.l3match', arr.length);
        // 暂存每条l3match推送记录
        const l3matchData = {};
        _.each(arr, ({ data }) => {
          const { symbol, sequence } = data;
          const _data = {
            sequence: data.sequence,
            price: data.price,
            size: data.size,
            side: data.side,
            time: +data.time,
          };

          l2Cache.push(symbol, _data);

          wsCalibration.calibration(symbol, sequence);
          wsCalibration.setSequenceLastMap(symbol, sequence);

          if (!l3matchData[symbol]) {
            l3matchData[symbol] = [];
          }

          l3matchData[symbol].push(_data);
        });

        _.each(l3matchData, (list, symbol) => {
          appendL3match({
            symbol,
            data: list,
          });
        });
      });
    },
  },
});
