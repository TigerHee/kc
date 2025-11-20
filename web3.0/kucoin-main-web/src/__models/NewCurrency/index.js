/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import { sub, divide } from 'helper';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import sort from 'common/models/sort';
import filter from 'common/models/filter';
import {
  getRecommendActive,
  getRecentActive,
  getCurrencyList,
  getLatestCurrencyList,
  getFreeCurrencyList,
  currencyNotice,
  currencyBook,
  currencyBookCancle,
  queryBookList,
  getBaseConfig,
  pullCoinInfo,
} from 'services/newCurrency';
import { getSymbolTick, getSymbol } from 'services/market';
import { verify } from 'services/ucenter/security';
import { pullOrder } from 'services/order';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

// 获取交易对行情数据map
const getSymbolTickMap = (list) => {
  if (!list || !list.length) {
    return {};
  }
  const map = {};
  _.forEach(list, (item) => {
    const { changeRate, lastTradedPrice, quoteCurrency, symbolCode } = item || {};
    if (symbolCode) {
      map[symbolCode] = { changeRate, lastTradedPrice, quoteCurrency, symbolCode };
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

export default extend(base, sort, filter, {
  namespace: 'new_currency',
  state: {
    filters: {
      tab: 'new',
      isMore: false,
    },
    records: [], // 所有交易对列表
    recommendActive: [], // 推荐活动列表
    recentActivePrefix: [], // 上新预告
    recentActive: [], // 新币活动
    freeLink: '',
    subscribeList: [], // 预约记录
    subscribeListInfo: {}, // 预约记录分页状态
    symbolCodeInfo: {},
    activeInfo: {},
    currencyInfo: {},
    baseConfig: {}, // 基础配置，如：免费开关、链接
    detail: null, // 当前详情
    detailShow: false, // 详情展示
  },
  reducers: {},
  effects: {
    *pullBaseConfig(action, { call, put }) {
      const { success, data } = yield call(getBaseConfig);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            baseConfig: data || {},
          },
        });
      }
    },
    *pullRecommendActive(action, { call, put }) {
      const { success, data } = yield call(getRecommendActive);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            recommendActive: data || [],
          },
        });
      }
    },
    *pullRecentActive(action, { call, put }) {
      const { success, data } = yield call(getRecentActive, 'ACTIVITIES');
      if (success) {
        yield put({
          type: 'update',
          payload: {
            recentActive: data || [],
          },
        });
      }
    },
    *pullRecentPrefixActive(action, { call, put }) {
      const { success, data } = yield call(getRecentActive, 'NEWEST');
      if (success) {
        yield put({
          type: 'update',
          payload: {
            recentActivePrefix: data || [],
          },
        });
      }
    },
    *pullTableList(action, { select, call, put }) {
      try {
        const filters = yield select((state) => state.new_currency.filters);
        const { tab, isMore } = filters || {};
        let _interface = getCurrencyList;
        const params = {};
        if (tab === 'new') {
          if (!isMore) {
            params.limit = 10;
          }
        } else if (tab === 'latest') {
          _interface = getLatestCurrencyList;
        } else if (tab === 'free') {
          _interface = getFreeCurrencyList;
        }
        let list = [];
        const { success, data } = yield call(_interface, params);
        if (success) {
          if (tab === 'free') {
            const { currencyList } = data || {};
            list = currencyList || [];
          } else {
            list = data || [];
          }
          // 取出所有交易对，去获取实时数据
          const symbolList = [];
          if (list) {
            _.forEach(list, (item) => {
              const { symbol } = item || {};
              if (symbol) {
                symbolList.push(symbol);
              }
            });
          }
          if (symbolList && symbolList.length) {
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
              records: list || [],
            },
          });
        }
      } catch (e) {
        console.log(e);
        yield put({
          type: 'update',
          payload: {
            records: [],
          },
        });
        throw e;
      }
    },
    *pullDetail({ payload }, { select, call, put }) {
      try {
        const { symbol, iconUrl } = payload || {};
        const detail = yield select((state) => state.new_currency.detail);
        if (detail && detail.symbol === symbol) {
          return false;
        }
        // 从接口获取
        const { success, data } = yield call(pullCoinInfo, { symbol });
        if (success && data) {
          const map = { ...(data || {}), iconUrl };
          yield put({
            type: 'update',
            payload: {
              detail: map,
            },
          });
        }
      } catch (e) {
        console.log(e);
        yield put({
          type: 'update',
          payload: {
            detail: null,
          },
        });
        throw e;
      }
    },

    /** socket数据 */
    *updateNewCurrencyRecords({ payload }, { put, select }) {
      try {
        const map = payload;
        const records = yield select((state) => state.new_currency.records);
        // 将实时数据写入
        _.map(map, (item) => {
          const { symbolCode, lastTradedPrice } = item || {};
          _.each(records, (_item, index) => {
            const { symbol, openingPrice } = _item || {};
            if (symbol === symbolCode) {
              const allChangeRate = getAllChangeRate(lastTradedPrice, openingPrice);
              records[index] = {
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
            records,
          },
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },

    // 预约新币
    *currencyBook({ payload }, { call }) {
      return yield call(currencyBook, payload);
    },
    // 撤销预约新币
    *currencyBookCancle({ payload }, { call }) {
      const { success } = yield call(currencyBookCancle, payload);
      return success;
    },
    // 预约提醒
    *currencyNotice({ payload }, { call }) {
      const { success } = yield call(currencyNotice, payload);
      return success;
    },
    // 预约记录列表
    *queryBookList({ payload }, { call, put }) {
      const { success, items, ...rest } = yield call(queryBookList, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            subscribeList: items || [],
            subscribeListInfo: rest,
          },
        });
      }
    },
    // 验证交易密码
    *verify({ payload }, { call }) {
      const { success } = yield call(verify, payload);
      return success;
    },
    // 交易对info
    *getSymbol({ payload }, { call, put }) {
      const { success, data } = yield call(getSymbol, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            symbolCodeInfo: data,
          },
        });
      }
    },
    // 获取订单详情
    *pullOrderDetail({ payload: { id } }, { call }) {
      const {
        success,
        data: { isActive },
      } = yield call(pullOrder, id);
      if (success) {
        return isActive;
      }
      return false;
    },
  },
  subscriptions: {
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      import('src/utils/socket').then(({ kcWs: socket, Topic }) => {
        socket.topicMessage(Topic.MARKET_SNAPSHOT, 'trade.snapshot')(
          (arr) => {
            const map = {};
            // 后来的先覆盖
            _.eachRight(arr, (_message) => {
              const { data: { data } = {} } = _message;
              const { changeRate, lastTradedPrice, quoteCurrency, symbolCode } = data || {};
              if (!map[symbolCode]) {
                map[symbolCode] = {
                  changeRate,
                  lastTradedPrice,
                  quoteCurrency,
                  symbolCode,
                };
              }
            });
            /** update */
            dispatch({ type: 'updateNewCurrencyRecords', payload: map });
          },
          { frequency: 500 },
        );
      });
    },
  },
});
