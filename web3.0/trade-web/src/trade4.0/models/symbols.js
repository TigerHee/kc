/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-06-13 11:58:54
 * @Description: 存储全部交易对信息
 */
import extend from 'dva-model-extend';
import { map } from 'lodash';
import base from 'common/models/base';
import polling from 'common/models/polling';

import {
  pullSymbols,
  getCoinInfo,
  pullUnitDic,
  getTradeBasicInfo,
  pullSymbolsRiskTip,
} from 'services/symbols';
import { getMarginSymbols } from 'services/markets';
import { getAllSymbolConfigs, getAllSymbolConfigsByUser } from 'services/isolated';
import { getFuturesSymbolsAll, getFuturesSymbols } from '@/services/futures';

import { transStepToPrecision } from 'helper';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { setSpotSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo.js';
import { setFutureSymbolInfo } from 'Bot/hooks/useFutureSymbolInfo.js';

import { checkFuturesSocketTopic } from '@/utils/socket';

import { getTradeType } from '../hooks/common/useTradeType';
import { FUTURES } from '../meta/const';
import { getCurrentSymbolInfo, transformSymbolInfo } from '../hooks/common/useSymbol';
import { isSpotTypeSymbol } from '../hooks/common/useIsSpotSymbol';

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
    coinSummary: {}, // 币种的详细介绍
    futuresSymbolsMap: {}, // 合约交易对Map
    futuresSymbols: [], // 合约交易对数组
    futuresCurrentSymbolInfo: {}, // 合约选中的当前交易对信息
    unitDict: {}, // 0.1U 数据字典
    coinInfo: undefined, // 币种介绍信息
    riskTipMap: {}, // 币对存储风险提示的map
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
      // 初始化策略交易对数据
      const records = data.map((item) => {
        const { baseIncrement, priceIncrement, quoteIncrement } = item;
        // 由于不需要保留原本数据，这里直接赋值会相对解构更快
        item.basePrecision = transStepToPrecision(baseIncrement);
        item.pricePrecision = transStepToPrecision(priceIncrement);
        item.quotePrecision = transStepToPrecision(quoteIncrement);
        // symbol是symbolName 拆开可以直接展示
        const [baseName, quoteName] = item.symbol?.split('-');
        item.baseName = baseName;
        item.quoteName = quoteName;

        const _item = transformSymbolInfo(item);
        // 初始化策略交易对数据
        setSpotSymbolInfo(_item);
        return _item;
      });
      yield put({
        type: 'updateSymbols',
        payload: {
          symbols: records,
        },
      });
    },
    *pullFuturesSymbols({ payload }, { call, put }) {
      const { data } = yield call(getFuturesSymbolsAll, payload);
      const futuresSymbolsMap = {};
      const futuresSymbols = map(data, (item) => {
        futuresSymbolsMap[item.symbol] = transformSymbolInfo(item);
        // 初始化策略交易对数据
        setFutureSymbolInfo(futuresSymbolsMap[item.symbol]);
        return item.symbol;
      });

      yield put({
        type: 'update',
        payload: {
          futuresSymbols,
          futuresSymbolsMap,
        },
      });
      yield put({
        type: 'futuresCommon/update',
        payload: {
          futuresReady: true,
        },
      });
    },
    *pullFuturesSymbolActive({ payload }, { call, put, select }) {
      const { data } = yield call(getFuturesSymbols, payload);
      const futuresSymbolsMap = yield select((state) => state.symbols.futuresSymbolsMap) || {};
      const futuresSymbols = map(data, (item) => {
        futuresSymbolsMap[item.symbol] = transformSymbolInfo(item);
        return item.symbol;
      });
      yield put({
        type: 'update',
        payload: {
          futuresSymbols,
          futuresSymbolsMap,
        },
      });
    },
    *pullMarginSymbols(_, { call, put }) {
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
      const { orderSymbols: _orderSymbols, orderSymbolsMap: _orderSymbolsMap } = yield select(
        (state) => state.symbols,
      );

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
    *pullUnitDictionary(_, { call, put }) {
      const { data } = yield call(pullUnitDic);
      console.log(data, 'data----1u---');
      yield put({
        type: 'update',
        payload: {
          unitDict: data,
        },
      });
    },
    /**
     * 获得基础信息
     */
    *getTradeBasicInfo(_, { call, put, select }) {
      const symbol = yield select((state) => state.trade.currentSymbol);

      const { data, success } = yield call(getTradeBasicInfo, {
        symbol,
      });
      if (success) {
        return data;
      }
      return {};
    },
    *pullSymbolsTip({ payload }, { call, put, select }) {
      const { success, data } = yield call(pullSymbolsRiskTip, payload);
      const oldRiskTipMap = yield select((state) => state.symbols.riskTipMap);
      try {
        if (success) {
          if (payload?.currentSymbol) {
            const newRiskTipMap = { ...oldRiskTipMap, [payload.currentSymbol]: data };
            yield put({
              type: 'update',
              payload: {
                riskTipMap: newRiskTipMap,
              },
            });
          }
        }
      } catch (e) {
        console.error(e, 'pullSymbolsTip-error');
      }
    },
    *checkFuturesSymbols(__, { put }) {
      const checkFuturesTopicNormal = yield checkFuturesSocketTopic({ topic: '/contract/normal' });
      const checkFuturesTopicUpdate = yield checkFuturesSocketTopic({ topic: '/contract/updated' });
      if (!checkFuturesTopicNormal || !checkFuturesTopicUpdate) {
        yield put({ type: 'pullFuturesSymbols' });
      }
    },
  },
  subscriptions: {
    setUpSymbols({ dispatch }) {
      // FIXME: 移到 RootV4 useInit 请求中，V3 已下线，暂不添加
      // dispatch({ type: 'pullSymbols' });
      // // 杠杆交易对信息，用来判断当前交易对是否支持杠杆交易
      // dispatch({ type: 'pullMarginSymbols' });
      // dispatch({ type: 'pullUnitDictionary' }); // 拉取1U quote币种金额字典
    },
    initSocketTopicMessage({ dispatch }) {
      // 合约状态socket
      futuresWorkerSocket.topicContract(() => {
        dispatch({
          type: 'pullFuturesSymbolActive',
        });
      });
      futuresWorkerSocket.topicContractUpdate(() => {
        dispatch({
          type: 'pullFuturesSymbolActive',
        });
      });
    },
    initLoop({ dispatch }) {
      // 增加一个 30s 的轮询兜底 check
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'checkFuturesSymbols', interval: 30000 },
      });
    },
  },
});
