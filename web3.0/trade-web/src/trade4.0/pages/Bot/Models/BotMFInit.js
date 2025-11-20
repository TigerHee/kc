/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { pullSymbols } from 'services/symbols';
import { getFuturesSymbolsAll } from '@/services/futures';
import { transStepToPrecision } from 'helper';
import { transformSymbolInfo } from '@/hooks/common/useSymbol';
import { setSpotSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo.js';
import { setFutureSymbolInfo } from 'Bot/hooks/useFutureSymbolInfo.js';
import map from 'lodash/map';
// symbols, categories
/**
 * @description:
 * @return {*}
 */
export default extend(base, {
  namespace: 'BotMFInit', // 这个model在订单中心使用
  state: {
    isReady: false, // 整个bot的标记
    symbols: [],
    futuresSymbols: [],
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
        type: 'update',
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
        },
      });
    },
    // 启动
    *init(_, { put, all }) {
      yield all([
        // 拉取语言包
        yield put({
          type: 'pullSymbols',
        }),
        // 策略交易对匹配检查数据
        yield put({
          type: 'pullFuturesSymbols',
        }),
      ]);
      console.log('BotMFInit ready');
      yield put({
        type: 'update',
        payload: {
          isReady: true,
        },
      });
    },
  },
  subscriptions: {},
});
