/**
 * Owner: jessie@kupotech.com
 */

import extend from 'dva-model-extend';
import { map, findIndex, find, reduce, isNil, keys } from 'lodash';
import * as ws from '@kc/socket';
import {
  KLINE_BOX_COUNT,
  KLINE_ACTIVE_IDX,
  KLINE_SYMBOLS,
  KLINE_INDEX_FAVORITES,
  KLINE_INTERVAL_FAVORITES,
  KLINE_KLINETYPE_FAVORITES,
  KLINE_INTERVAL,
  KLINE_KLINETYPE,
  KLINE_INDEX_TEMPLATES,
} from '@/storageKey/chart';
import { checkSocketTopic } from '@/utils/socket';
import storage from '@/pages/Chart/utils/index';
import { getIntervalTypes } from '@/pages/Chart/components/TradingViewV24/utils';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getIsolatedLiquidationBSPoints } from 'services/isolated';
import { getSymbolTick, getBSHistoryBySymbol } from 'services/markets';
import {
  updateUserKlineConf,
  getUserKlineConf,
  CommonConfSymbol,
  KineLineTypeNew,
} from 'services/klineConf';
import { FUTURES, ISOLATED, MARGIN, SPOT } from '@/meta/const';
import { namespace, defaultState, marketLoop, DEFAULT_SAVED_DATA } from './config';

const { setItem, setDiffItem } = storage;

// Chart
export default extend(base, polling, {
  namespace,
  state: defaultState,
  reducers: {
    modifyKlineUpdate(state, { payload: { boxCount, activeIndex, kLineSymbols } }) {
      const args = {};

      if (!isNil(boxCount)) {
        args.boxCount = boxCount;
        setItem(KLINE_BOX_COUNT, boxCount);
      }

      if (!isNil(activeIndex)) {
        args.activeIndex = activeIndex;
        setItem(KLINE_ACTIVE_IDX, activeIndex);
      }

      if (!isNil(kLineSymbols)) {
        args.kLineSymbols = kLineSymbols;
        setItem(KLINE_SYMBOLS, kLineSymbols);
      }

      return {
        ...state,
        ...args,
      };
    },
  },
  effects: {
    *pullMarkets({ payload: { query, isPolling = true } }, { put, select, call }) {
      if (!query) return;

      const symbolList = query.split(',');
      const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
        SYMBOLS: symbolList,
      });
      const checkTopic = yield checkSocketTopic({ topic });

      if (!checkTopic || !isPolling) {
        const { data = [] } = yield call(getSymbolTick, { symbols: query });
        const records = data.filter((item) => !!item);
        const kLineTabsMarketMap = reduce(
          records,
          (result, val) => {
            return {
              ...result,
              [val.symbolCode]: val,
            };
          },
          {},
        );
        yield put({
          type: 'update',
          payload: { kLineTabsMarketMap },
        });
      }
    },
    *routeToSymbol({ payload: { symbol, toTradeType } }, { put, select }) {
      if (!symbol) return;

      const currentSymbol = yield select((state) => state.trade.currentSymbol);
      const currentTradeType = yield select((state) => state.trade.tradeType);
      // 杠杠打开现货需要处理下(symbol可能一样)
      if (!toTradeType && currentSymbol === symbol) return;

      const symbolsMap = yield select((state) => state.symbols.symbolsMap);
      const futuresSymbolsMap = yield select((state) => state.symbols.futuresSymbolsMap);

      const isFutures = futuresSymbolsMap[symbol];
      const isSpot = symbolsMap[symbol];
      // TODO
      // const { isMarginEnabled, isIsolatedEnabled } = symbolsMap[symbol];
      if (!isFutures && !isSpot) {
        return; // symbol不合法
      }

      let tradeType = toTradeType;
      if (!tradeType) {
        // 目前只区分合约，现货(杠杆)
        if (isFutures) {
          tradeType = FUTURES;
        } else if (isSpot) {
          const _currentTradeType = currentTradeType;
          // // 当前是全仓, 逐仓，但是当前交易对不支持全仓，设置为SPOT， TODO发现了个bug，后面看看要不要这样优化
          // if (!isMarginEnabled && _currentTradeType === MARGIN || !isIsolatedEnabled && _currentTradeType === ISOLATED) {
          //   _currentTradeType = SPOT;
          // }
          // 合约切换类型直接到现货，非合约保持原有类型
          tradeType = currentTradeType === FUTURES ? SPOT : _currentTradeType;
        }
      }

      yield put({
        type: 'trade/modifyCurrentSymbol',
        payload: {
          currentSymbol: symbol,
          tradeType,
        },
      });
    },
    *genklineSymbols({ payload: { symbol, type } }, { put, select }) {
      if (!symbol) return;

      const symbolsMap = yield select((state) => state.symbols.symbolsMap);
      const futuresSymbolsMap = yield select((state) => state.symbols.futuresSymbolsMap);

      const isFutures = futuresSymbolsMap[symbol];
      const isSpot = symbolsMap[symbol];
      if (!isFutures && !isSpot) {
        return; // symbol不合法
      }
      // 目前只区分合约和现货（包含杠杆）
      let tradeType = '';
      if (isFutures) {
        tradeType = FUTURES;
      }

      const { kLineSymbols, activeIndex, boxCount } = yield select((state) => state[namespace]);
      // kLineSymbolsTemp: 已存在的tab
      const kLineSymbolsTemp = [...kLineSymbols];

      // symbol在tabs的位置
      const klineSymbolIndex = findIndex(kLineSymbolsTemp, { symbol });
      // 当前活跃的symbol在宫格的位置
      const symbolIndex = findIndex(kLineSymbolsTemp, {
        displayIndex: activeIndex,
      });

      let _activeIndex;
      let _kLineSymbols;

      // 需要切换的symbol在已打开的tab中, 不产生新的tab
      if (klineSymbolIndex > -1) {
        // 当前点击的symbol的dislayIndex
        const oldDisplayIndex = kLineSymbolsTemp[klineSymbolIndex].displayIndex;
        if (oldDisplayIndex < +boxCount) {
          // 当前点击的symbol显示在k线宫格处，只改变activeIndex
          _activeIndex = oldDisplayIndex;
        } else {
          // 当前点击的symbol没显示在k线宫格处，该symbol displayIndex 与当前活跃的symbol的displayIndex 互换
          // kLineSymbols改变，activeIndex不改变
          if (symbolIndex > -1) {
            kLineSymbolsTemp[symbolIndex].displayIndex = oldDisplayIndex;
          }
          kLineSymbolsTemp[klineSymbolIndex].displayIndex = activeIndex;
          _kLineSymbols = kLineSymbolsTemp;
        }
      } else if (kLineSymbolsTemp.length < 8) {
        // tabs没超过8个，增加新tab, 活跃的symbol改变
        let symbolDisplayIndex;
        // 如果当前宫格未满(主要是四宫格)，那么新加的symbol需要加到后面去，并修改高亮activeIndex
        if (kLineSymbolsTemp.length < boxCount) {
          const allDisplayIndex = Array.from(new Array(+boxCount)).map((v, i) => i);
          // 宫格中第一个空闲的位置
          symbolDisplayIndex = find(
            allDisplayIndex,
            (v) => !find(kLineSymbolsTemp, { displayIndex: v }),
          );
          _activeIndex = symbolDisplayIndex;
        } else {
          if (symbolIndex > -1) {
            kLineSymbolsTemp[symbolIndex].displayIndex = 100;
          }
          symbolDisplayIndex = activeIndex;
        }
        _kLineSymbols = [
          ...kLineSymbolsTemp,
          { symbol, displayIndex: symbolDisplayIndex, tradeType },
        ];
      } else {
        // tabs超过8个, 第一个非活跃symbol替换为新symbol,, 此场景下activeIndex不会改变
        // 找到第一个没有显示在k线box的tab
        const firstIndex = findIndex(kLineSymbolsTemp, (item) => {
          return item.displayIndex >= +boxCount;
        });
        kLineSymbolsTemp[firstIndex].symbol = symbol;
        // 当前活跃symbol dispalyIndex更改
        kLineSymbolsTemp[firstIndex].displayIndex = kLineSymbolsTemp[symbolIndex].displayIndex;
        kLineSymbolsTemp[firstIndex].tradeType = tradeType;
        kLineSymbolsTemp[symbolIndex].displayIndex = 100;
        _kLineSymbols = kLineSymbolsTemp;
      }

      yield put({
        type: 'modifyKlineUpdate',
        payload: { activeIndex: _activeIndex, kLineSymbols: _kLineSymbols },
      });
    },
    *getBSHistoryBySymbol({ payload }, { put, call, select }) {
      const bsFilter = yield select((state) => state[namespace].bsFilter);
      const currentTradeType = yield select((state) => state.trade.tradeType);
      // 参数均为必填 begin, type, tradeType, symbol
      if (
        !bsFilter?.begin ||
        !bsFilter?.type ||
        !bsFilter?.symbol ||
        bsFilter?.type === '1' ||
        bsFilter?.tradeType === FUTURES // 合约不支持
      ) {
        return;
      }
      const params = {
        ...bsFilter,
        tradeType: bsFilter?.tradeType || currentTradeType,
      };
      params.type = getIntervalTypes(bsFilter.type);

      const { data, success } = yield call(getBSHistoryBySymbol, { ...params });
      if (success) {
        yield put({
          type: 'update',
          payload: { bsHistory: data || [] },
        });
      }
    },
    *pullIsolatedLiquidationBSPoints(_, { call, put, select }) {
      const { bsFilter } = yield select((state) => state[namespace]);
      const params = {
        begin: bsFilter.begin,
        symbol: bsFilter.symbol,
        type: getIntervalTypes(bsFilter.type),
      };
      const { data } = yield call(getIsolatedLiquidationBSPoints, params);
      yield put({
        type: 'update',
        payload: {
          isolatedLiquidationBSPoints: data,
        },
      });
    },
    // 获取K线配置全部配置（拿到user后执行，初始化时获取一次）
    *pullKlineConf({ payload = {} }, { call, put }) {
      try {
        const { user } = payload;
        // 用户登陆后才可以调用该方法
        if (!user) {
          return;
        }

        const { items, inUse, success } = yield call(getUserKlineConf, {
          symbol: [CommonConfSymbol],
          userid: user.uid,
          type: KineLineTypeNew,
        });

        if (!success) {
          return;
        }

        // inUse控制是否启动服务器端存储
        if (!inUse) {
          yield put({
            type: 'update',
            payload: {
              klineConfInUse: inUse,
            },
          });
          return;
        }

        // 存储字段与model字段映射
        const localStorageKeyMapArr = [
          [KLINE_INDEX_FAVORITES, 'favorites'],
          [KLINE_INTERVAL_FAVORITES, 'intervalFavorites'],
          [KLINE_KLINETYPE_FAVORITES, 'klineTypeFavorites'],
          [KLINE_INDEX_TEMPLATES, 'studyTemplates'],
          [KLINE_INTERVAL, 'interval'],
          [KLINE_KLINETYPE, 'klineType'],
        ];
        const common = {};

        // 服务器端存储覆盖本地存储
        map(localStorageKeyMapArr, (keyMapItem) => {
          const item = find(items, { pri_dict_value: keyMapItem[0] });
          let val;
          if (item) {
            val = item.pri_data_value ? JSON.parse(item.pri_data_value) : undefined;
          }
          if (val) {
            common[keyMapItem[1]] = val;
            setDiffItem(keyMapItem[0], val);
          } else {
            common[keyMapItem[1]] = DEFAULT_SAVED_DATA[keyMapItem[0]];
            setDiffItem(keyMapItem[0], DEFAULT_SAVED_DATA[keyMapItem[0]]);
          }
        });

        yield put({
          type: 'update',
          payload: {
            ...common,
            klineConfInUse: inUse,
          },
        });
      } catch (error) {
        console.error(error, 'pullKlineConf error');
      }
    },
    // 更新K线配置
    *updateKlineConf({ payload = {} }, { call, select, put }) {
      try {
        const user = yield select((state) => state.user.user);
        const klineConfInUse = yield select((state) => state[namespace].klineConfInUse);
        if (!user || !klineConfInUse) return;

        const params = {
          ...payload,
          userid: user.uid,
          type: KineLineTypeNew,
        };
        if (params) {
          yield call(updateUserKlineConf, params);
        }
      } catch (error) {
        console.error(error, 'updateKlineConf error');
      }
    },
  },
  subscriptions: {
    initLoop({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullMarkets', interval: marketLoop },
      });

      dispatch({
        type: 'watchPolling',
        payload: { effect: 'getBSHistoryBySymbol' },
      });
    },
  },
});
