/**
 * Owner: jessie@kupotech.com
 */

import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import sort from 'common/models/sort';
import extend from 'dva-model-extend';
import { divide, sub } from 'helper';
import _ from 'lodash';
import {
  pullGemspaceBanner,
  pullGemspaceNewListing,
  pullGemspaceOngoingGem,
} from 'services/gemspace';
import { getSymbolTick } from 'services/market';
import { getBatchedKLineData, getLatestCurrencyListV2 } from 'services/newCurrency'; // pullCoinInfo,

// 1hour/4hour/1day
export const HOURS_MAP = ['1hour', '4hour', '1day'];

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

// 获取交易对行情数据map
const getSymbolTickMap = (list) => {
  if (!list || !list.length) {
    return {};
  }
  const map = {};
  _.forEach(list, (item) => {
    const {
      changeRate,
      lastTradedPrice,
      quoteCurrency,
      symbolCode,
      marketChange1h,
      marketChange4h,
      marketChange24h,
    } = item || {};
    if (symbolCode) {
      const changeRate1h = marketChange1h?.changeRate || '';
      const changeRate4h = marketChange4h?.changeRate || '';
      const changeRate24h = marketChange24h?.changeRate || changeRate;
      map[symbolCode] = {
        changeRate,
        lastTradedPrice,
        quoteCurrency,
        symbolCode,
        changeRate1h,
        changeRate4h,
        changeRate24h,
      };
    }
  });
  return map;
};

// 计算上线以来涨跌幅
const getAllChangeRate = (last, opening) => {
  const _last = last || 0;
  const _opening = opening || 0;
  let allChangeRate = divide(sub(_last, _opening), _opening, 4);
  if (allChangeRate <= -1 && _last) {
    // 只要当前价格未归0，就不能跌100%
    allChangeRate = -0.9999;
  }
  return allChangeRate;
};

const emptyArr = [];
const emptyObj = [];

export default extend(base, sort, filter, polling, {
  namespace: 'rocketZone',
  state: {
    records: [], // 所有交易对列表
    klinesMap: {}, // k线
    activeRate: 2, // 默认24小时数据change
    newListing: [],
    gemspaceBanner: {},
    shareModal: '', // 分享组件没有关闭回调函数，需要使用Math.random()控制
    shareInfo: {},
    onGoingList: [], // ongoing tab下各活动数据
  },
  reducers: {},
  effects: {
    *pullTableList(__, { select, call, put }) {
      try {
        const activeRate = yield select((state) => state.rocketZone.activeRate);
        let list = [];
        const { success, data } = yield call(getLatestCurrencyListV2);
        if (success) {
          list = data || [];
          // 取出所有交易对，去获取实时数据
          const symbolList = [];
          _.forEach(list, (item) => {
            const { symbol } = item || {};
            if (symbol) {
              symbolList.push(symbol);
            }
          });
          // 最近上新获取缩略图列表
          yield put({
            type: 'pullBatchedCandles',
            payload: {
              symbolList,
              type: HOURS_MAP[activeRate] || '1day',
            },
          });
          if (symbolList?.length) {
            const symbols = symbolList.join(',');
            const { success: _success, data: _data } = yield call(getSymbolTick, { symbols });
            if (_success && _data && _data.length) {
              const map = getSymbolTickMap(_data);
              // 将实时数据写入list
              _.forEach(list, (item, index) => {
                const { symbol, openingPrice } = item || {};
                const obj = map[symbol || ''] || null;
                if (obj) {
                  const lastTradedPrice = obj.lastTradedPrice || 0;
                  const allChangeRate = getAllChangeRate(lastTradedPrice, openingPrice);
                  list[index] = {
                    ...item,
                    ...obj,
                    allChangeRate,
                  };
                }
              });
            }
          }
          yield put({
            type: 'update',
            payload: {
              records: list || emptyArr,
            },
          });
        }
      } catch (e) {
        console.log(e);
        yield put({
          type: 'update',
          payload: {
            records: emptyArr,
          },
        });
        throw e;
      }
    },
    // candles 缩略图
    *pullBatchedCandles({ payload }, { call, put, all }) {
      const { symbolList = [], type } = payload;
      const params = [];
      let newSymbolList = [...symbolList];
      while (newSymbolList.length > 0) {
        params.push(newSymbolList.splice(0, 10).join(','));
      }

      if (params.length > 0) {
        for (let i = 0; i < params.length; i++) {
          yield put({
            type: 'pullCandles',
            payload: {
              symbols: params[i],
              type,
            },
          });
        }
      }
    },

    *pullCandles({ payload }, { call, put, select }) {
      try {
        const { symbols, type } = payload;
        if (symbols?.length > 0) {
          const { success, data } = yield call(getBatchedKLineData, {
            symbolList: symbols,
            candleType: HOURS_MAP[type],
          });
          const { klinesMap } = yield select((state) => state.rocketZone);
          if (success) {
            const newMap = {};
            _.forEach(Object.entries(data), ([key, list]) => {
              const newList = [];
              _.forEach(list, (item) => {
                if (item && item.length > 2) {
                  const key = item[0]; // time
                  const val = item[2]; // closing price
                  if (key && val !== undefined) {
                    newList.unshift([Number(key), Number(val)]);
                  }
                }
              });
              newMap[key] = newList; // 按时间升序
            });

            yield put({
              type: 'update',
              payload: {
                klinesMap: {
                  ...klinesMap,
                  ...newMap,
                },
              },
            });
          }
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    /** socket数据 */
    *updateNewCurrencyRecords({ payload }, { put, select }) {
      try {
        const map = payload;
        const records = yield select((state) => state.rocketZone.records);
        const _records = [...records];
        // 将实时数据写入
        _.map(map, (item) => {
          const { symbolCode, lastTradedPrice } = item || {};
          _.each(_records, (_item, index) => {
            const { symbol, openingPrice } = _item || {};
            if (symbol === symbolCode) {
              const allChangeRate = getAllChangeRate(lastTradedPrice, openingPrice);
              _records[index] = {
                ..._item,
                ...item,
                allChangeRate,
              }; // 重新组装
              return false; // 退出此次循环
            }
          });
        });
        yield put({
          type: 'update',
          payload: {
            records: _records,
          },
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    // 更新changeRateType并拉新缩略图
    *updateActiveRate({ payload }, { call, put, select }) {
      const records = yield select((state) => state.rocketZone.records);

      const symbolList = [];
      if (records) {
        _.forEach(records, (item) => {
          const { symbol } = item || {};
          if (symbol) {
            symbolList.push(symbol);
          }
        });
      }
      yield put({
        type: 'update',
        payload: {
          activeRate: payload?.activeRate,
        },
      });

      yield put({
        type: 'pullBatchedCandles',
        payload: {
          symbolList,
          type: payload?.activeRate,
        },
      });
    },
    *pullGemspaceOngoingGem(__, { call, put, select }) {
      const onGoingListOld = yield select((state) => state.rocketZone.onGoingList);
      const { success, data } = yield call(pullGemspaceOngoingGem);
      if (success) {
        // 排序
        const onGoingList = [];
        _.map(data, (item) => {
          if (item) {
            if (item.typeName === 'gemSlot' && !item.details?.length) {
              return;
            }
            onGoingList.push(item);
          }
        });

        const sortArr = onGoingList.sort((a, b) => a.seq - b.seq);

        if (_.isEqual(onGoingListOld, sortArr)) {
          return;
        }

        yield put({
          type: 'update',
          payload: {
            onGoingList: sortArr,
          },
        });
      }
    },
    *pullNewListing(__, { call, put, select }) {
      const newListingOld = yield select((state) => state.rocketZone.newListing);
      const { success, items } = yield call(pullGemspaceNewListing);
      if (success) {
        if (_.isEqual(newListingOld, items)) {
          return;
        }
        yield put({
          type: 'update',
          payload: {
            newListing: items || emptyArr,
          },
        });
      }
    },
    *pullGemspaceBanner({ payload }, { call, put, select }) {
      const { success, data } = yield call(pullGemspaceBanner);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            gemspaceBanner: data || emptyObj,
          },
        });
      }
    },
  },
  subscriptions: {
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;
      import('@kc/socket').then((ws) => {
        const socket = ws.getInstance();
        socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')(
          (arr) => {
            const map = {};
            // 后来的先覆盖
            _.eachRight(arr, (_message) => {
              const { data: { data } = {} } = _message;
              const {
                changeRate,
                lastTradedPrice,
                quoteCurrency,
                symbolCode,
                marketChange1h,
                marketChange4h,
                marketChange24h,
              } = data || {};
              const changeRate1h = marketChange1h?.changeRate || '';
              const changeRate4h = marketChange4h?.changeRate || '';
              const changeRate24h = marketChange24h?.changeRate || changeRate || '';
              if (!map[symbolCode]) {
                map[symbolCode] = {
                  changeRate,
                  lastTradedPrice,
                  quoteCurrency,
                  symbolCode,
                  changeRate1h,
                  changeRate4h,
                  changeRate24h,
                };
              }
            });
            /** update */
            dispatch({ type: 'updateNewCurrencyRecords', payload: map });
          },
          500,
          true,
        );
      });
    },
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullGemspaceOngoingGem',
          interval: 120000,
        },
      });
    },
  },
});
