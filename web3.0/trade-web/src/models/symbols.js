/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-06-13 11:58:54
 * @Description: 存储全部交易对信息
 */
import extend from 'dva-model-extend';
import { reduce, map, forEach } from 'lodash';
import { delay } from 'utils/delay';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { pullSymbols, getCoinInfo, pullSymbolsRiskTip } from 'services/symbols';
import { getMarginSymbols } from 'services/markets';
import {
  getAllSymbolConfigs,
  getAllSymbolConfigsByUser,
} from 'services/isolated';
import { transStepToPrecision } from 'helper';
import workerSocket, { PushConf } from 'common/utils/socketProcess';

// effect执行计数
const effectsCount = {};

export default extend(base, polling, {
  namespace: 'symbols',
  state: {
    symbols: [], // 所有交易对数组
    symbolsMap: {}, // 所有交易对Map
    marginSymbols: [], // 杠杆交易对
    marginSymbolsMap: {}, // 杠杆交易对Map
    orderSymbols: [], // 交易过的交易对
    orderSymbolsMap: {}, // 交易过的交易对Map
    isolatedSymbols: [], // 逐仓支持的交易对
    isolatedSymbolsMap: {},
    coinSummary: {}, // 币种的详细介绍, 不再使用
    riskTipMap: {}, // 币对存储风险提示的map
    coinInfo: null,
  },
  reducers: {
    updateSymbols(state, { payload }) {
      const { symbols = [] } = payload;
      const symbolsMap = {};

      symbols.forEach((val) => {
        symbolsMap[val.code] = val;
      });
      // console.timeEnd('reduce');
      return {
        ...state,
        symbols,
        symbolsMap,
      };
    },
  },
  effects: {
    *pullSymbols(_, { call, put }) {
      const { data } = yield call(pullSymbols, {});
      const records = data.map((item) => {
        const { baseIncrement, priceIncrement, quoteIncrement } = item;
        // const _item = {
        //   ...item,
        //   basePrecision: transStepToPrecision(baseIncrement),
        //   pricePrecision: transStepToPrecision(priceIncrement),
        //   quotePrecision: transStepToPrecision(quoteIncrement),
        // };
        // symbolsMap[item.code] = _item;
        // return _item;
        // 由于不需要保留原本数据，这里直接赋值会相对解构更快
        item.basePrecision = transStepToPrecision(baseIncrement);
        item.pricePrecision = transStepToPrecision(priceIncrement);
        item.quotePrecision = transStepToPrecision(quoteIncrement);
        // symbol是symbolName 拆开可以直接展示
        const [baseName, quoteName] = item.symbol?.split('-');
        item.baseName = baseName;
        item.quoteName = quoteName;
        return item;
      });

      // const records = allRecords.filter(item => item.enableTrading);
      yield put({
        type: 'updateSymbols',
        payload: {
          symbols: records,
        },
      });
      // 校验现货 现货网格交易对数据一致
      yield put({
        type: 'grid/checkGridSymbols',
      });
      // 这里来处理
    },
    *pullMarginSymbols(_, { call, put }) {
      try {
        const { data } = yield call(getMarginSymbols);
        const marginSymbolsMap = {};
        const marginSymbols = map(data, (item) => {
          marginSymbolsMap[item.symbol] = item;
          return item.symbol;
        });
        yield put({
          type: 'update',
          payload: {
            marginSymbols,
            marginSymbolsMap,
          },
        });
      } catch (e) {
        yield call(delay, 3000);
        yield put({ type: 'pullMarginSymbols' });
      }
    },
    *pullIsolatedSymbols(_, { call, put }) {
      if (effectsCount.pullIsolatedSymbolsByUser) return;
      const { data } = yield call(getAllSymbolConfigs);
      const isolatedSymbolsMap = {};
      map(data, (item) => {
        isolatedSymbolsMap[item.symbol] = item;
        return item;
      });
      // 二次阻断，防止请求结果覆盖下方pullIsolatedSymbolsByUser的结果
      if (effectsCount.pullIsolatedSymbolsByUser) return;
      yield put({
        type: 'update',
        payload: {
          isolatedSymbols: data,
          isolatedSymbolsMap,
        },
      });
      // 初始化划转中的逐仓支持交易对，以避免打开划转时方向Select的短暂空白
      yield put({
        type: 'transfer/updateIsolatedSymbols',
        payload: data,
      });
    },
    *pullIsolatedSymbolsByUser(_, { call, put, select }) {
      if (effectsCount.pullIsolatedSymbolsByUser) return;
      const { isolatedSymbols } = yield select((state) => state.transfer);
      const { user } = yield select((state) => state.user);
      const { isSub } = user || {};
      const { data, success } = yield call(getAllSymbolConfigsByUser, {
        isSubAcc: !!isSub,
      });
      if (success) {
        effectsCount.pullIsolatedSymbolsByUser = 1;
        const isolatedSymbolsMap = {};
        map(data, (item) => {
          isolatedSymbolsMap[item.symbol] = item;
          return item;
        });
        yield put({
          type: 'update',
          payload: {
            isolatedSymbols: data,
            isolatedSymbolsMap,
          },
        });
        if (!isolatedSymbols.length) {
          yield put({
            type: 'transfer/updateIsolatedSymbols',
            payload: data,
          });
        }
      }
    },
    *addSymbols({ payload = {} }, { select, put }) {
      const { symbol } = payload;
      const {
        orderSymbols: _orderSymbols,
        orderSymbolsMap: _orderSymbolsMap,
      } = yield select((state) => state.symbols);

      const orderSymbols = [..._orderSymbols];
      const orderSymbolsMap = { ..._orderSymbolsMap };
      if (!orderSymbolsMap[symbol]) {
        orderSymbols.push(symbol);
        orderSymbolsMap[symbol] = symbol;
        yield put({
          type: 'update',
          payload: {
            orderSymbols,
            orderSymbolsMap,
          },
        });
      }
    },
    *getCoinInfo({ payload }, { call, put, select }) {
      const params = yield select(({ trade, currency: { currency } }) => {
        const { currentSymbol } = trade;
        const [coin] = currentSymbol.split('-');
        return {
          coin,
          symbol: currentSymbol,
          legalCurrency: currency,
        };
      });
      const coinParams = {
        ...params,
        ...payload,
      };
      const { data: coinInfo } = yield call(getCoinInfo, coinParams);
      yield put({
        type: 'update',
        payload: {
          coinInfo,
        },
      });
    },
    *pullSymbolsTip({ payload }, { call, put, select }) {
      const { success, data } = yield call(pullSymbolsRiskTip, payload);
      const { riskTipMap } = yield select((state) => state.symbols);
      try {
        if (success) {
          if (payload?.currentSymbol) {
            riskTipMap[payload.currentSymbol] = data;
          }
          yield put({
            type: 'update',
            payload: {
              riskTipMap,
            },
          });
        }
      } catch (e) {
        console.error(e, 'pullSymbolsTip-error');
      }
    },
    /**
     * 更新推送的Symbols数据
     */
    *updatePushSymbols({ payload }, { call, put, select }) {
      const { list } = payload;
      const updateHash = reduce(
        list,
        (obj, arrItem) => {
          forEach(arrItem?.data, (item) => {
            obj[item.code] = item;
          });
          return obj;
        },
        {},
      );
      const symbols = yield select((state) => state.symbols.symbols);
      const updateSymbols = map(symbols, (item) => {
        const info = updateHash[item.code];
        if (info) {
          return {
            ...item,
            ...info,
          };
        }
        return item;
      });
      yield put({
        type: 'updateSymbols',
        payload: {
          symbols: updateSymbols,
        },
      });

      yield put({
        type: 'grid/checkGridSymbols',
      });
    },
  },
  subscriptions: {
    setUpSymbols({ dispatch }) {
      // FIXME: V3 已下线，先统一屏蔽处理
      // dispatch({ type: 'pullSymbols' });
      // dispatch({ type: 'pullMarginSymbols' });
      // dispatch({ type: 'pullIsolatedSymbols' });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullSymbols', interval: 10 * 60 * 1000 },
      });
      // symbols 数据变更更新
      const fn = workerSocket[PushConf.SYMBOLSCHANGENOTICE.eventName];
      if (fn) {
        fn((res) => {
          dispatch({
            type: 'updatePushSymbols',
            payload: {
              list: res,
            },
          });
        });
      }
    },
  },
});
