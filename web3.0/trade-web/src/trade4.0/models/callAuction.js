/**
 * Owner: odan.ou@kupotech.com
 */

// 集合竞价
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import {
  getAuctionConf,
  getAuctionInfo,
  getAuctionWhiteAllowList,
  getAuctionWhiteStatus,
} from '@/services/callAuction';
import { getModelAuctionInfo, getModelSymbolInfo, getSymbolAuctionInfo } from '@/utils/business';
import { checkSocketTopic } from '@/utils/socket';
import * as ws from '@kc/socket';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import extend from 'dva-model-extend';
import { each } from 'lodash';
import base from 'src/common/models/base';
import polling from 'src/common/models/polling';
import callAuctionStore from 'src/pages/Trade3.0/stores/store.callAuction';
import { _IS_TEST_ENV_ } from 'src/utils/env';

const InitAuctionData = {
  auctionConf: {}, // 配置信息
};

const emptyObj = {};
const emptyArr = [];

const _auctionWhiteAllowStatusMap = {};

export default extend(base, polling, {
  namespace: 'callAuction',
  state: {
    auctionMap: {},
    isThirdStep: false,
    auctionWhiteAllowList: [], // 所有集合竞价白名单开启状态的交易对
    auctionWhiteAllowStatusMap: {}, // 该用户当前交易对是否开启白名单
  },
  reducers: {
    updateAuctionMap(state, { payload }) {
      const { symbol, data } = payload;
      const { auctionMap } = state;
      return {
        ...state,
        auctionMap: {
          ...auctionMap,
          [symbol]: {
            ...auctionMap[symbol],
            ...data,
          },
        },
      };
    },
  },
  effects: {
    /**
     * 获取集合竞价配置数据
     */
    *getAuctionConf({ payload }, { call, put }) {
      const { coinPair } = payload;
      if (!coinPair) return;
      const { data } = yield call(getAuctionConf, { symbolCode: coinPair });
      yield put({
        type: 'updateAuctionMap',
        payload: {
          symbol: coinPair,
          data: {
            auctionConf: data || {},
          },
        },
      });
    },
    // 接推送，持续更新数据
    *callAuctionStoreUpdate({ payload }) {
      const callAuctionStatePrev = yield callAuctionStore.handler.select(
        (state) => state.callAuction,
      );
      // 清空数据
      callAuctionStore.handler.update({
        ...callAuctionStatePrev,
        auctionDataMap: {
          ...callAuctionStatePrev.auctionDataMap,
          ...payload,
        },
      });
    },
    /**
     * 获取集合竞价变动数据
     */
    *getAuctionInfo({ payload }, { call, put }) {
      const { coinPair } = payload;
      if (!coinPair) return;
      const { data } = yield call(getAuctionInfo, { symbol: coinPair });
      yield put({
        type: 'callAuctionStoreUpdate',
        payload: {
          [coinPair]: data || {},
        },
      });
    },
    /**
     * scoket 失败后的轮训
     */
    *pull({ payload }, { put, select }) {
      const { coinPair } = payload || {};
      if (!coinPair) return;
      // 不展示集合竞价则不请求数据
      const { showAuction } = yield select((state) => {
        return getModelAuctionInfo(state, coinPair);
      });
      if (!showAuction) return;
      const topic = ws.Topic.get(PushConf.CallAuctionInfo.topic, {
        SYMBOLS: [coinPair],
      });
      const checkTopic = yield checkSocketTopic({ topic });
      if (checkTopic) return;
      yield put({
        type: 'getAuctionInfo',
        payload: {
          coinPair,
        },
      });
    },
    /**
     * 集合竞价处理
     */
    *auctionHandle({ payload }, { put, select }) {
      const { currentSymbol, isClose } = payload;
      const { auctionWhiteAllowList, auctionWhiteAllowStatusMap } = yield select(
        ({ callAuction }) => {
          return {
            auctionWhiteAllowList: callAuction?.auctionWhiteAllowList,
            auctionWhiteAllowStatusMap: callAuction?.auctionWhiteAllowStatusMap,
          };
        },
      );
      // 拿到某个币对的信息
      const symbolInfo = yield select((state) => getModelSymbolInfo(state, currentSymbol)) || {};
      // 预览界面不展示，且集合竞价页面要展示
      // previewEnableShow: 是否是预览界面
      // isAuctionEnabled: 是否开启集合竞价, 结束后会变成false
      // isEnableAuctionTrade: 是否开启集合竞价交易
      const { showAuction } = getSymbolAuctionInfo(
        symbolInfo,
        auctionWhiteAllowList,
        auctionWhiteAllowStatusMap,
      );
      if (!showAuction || isClose) {
        // 清空数据
        yield put({
          type: 'updateAuctionMap',
          payload: {
            symbol: currentSymbol,
            data: {
              ...InitAuctionData,
              auctionConf: {},
            },
          },
        });
        yield put({
          type: 'callAuctionStoreUpdate',
          payload: {
            [currentSymbol]: {},
          },
        });
        return;
      }
      const tradeType = TRADE_TYPES_CONFIG.TRADE.key;
      yield [
        /**
         * 获取集合竞价配置信息
         */
        put({
          type: 'getAuctionConf',
          payload: {
            coinPair: currentSymbol,
          },
        }),
        /**
         * 获取集合竞价信息
         */
        put({
          type: 'getAuctionInfo',
          payload: {
            coinPair: currentSymbol,
          },
        }),
        // 显示为现货下单窗口，且只能下限价单
        /**
         * 切换为币币
         */
        put({
          type: 'trade/update_trade_type',
          payload: {
            tradeType,
          },
        }),
        /**
         * 切换为现价单
         */
        put({
          type: 'tradeForm/update',
          payload: {
            type: 'customPrise', // 限价单
          },
        }),
      ];
    },
    /**
     * 查询所有允许集合竞价白名单的交易对及其状态
     */
    *getAuctionWhiteAllowList(_, { call, put }) {
      const { data } = yield call(getAuctionWhiteAllowList);
      yield put({
        type: 'update',
        payload: {
          auctionWhiteAllowList: data || emptyArr,
        },
      });
      return data;
    },
    /**
     * 查询所有允许集合竞价白名单的交易对及其状态
     */
    *getAuctionWhiteStatus({ payload: { symbol } }, { call, put, select }) {
      // 没开启白名单不需要查询白名单状态
      const auctionWhiteAllowList = yield select(
        (state) => state.callAuction.auctionWhiteAllowList,
      );

      if (!auctionWhiteAllowList?.includes(symbol)) return;

      const { data, success } = yield call(getAuctionWhiteStatus, symbol);
      if (success) {
        _auctionWhiteAllowStatusMap[symbol] = data;
        yield put({
          type: 'update',
          payload: {
            auctionWhiteAllowStatusMap: _auctionWhiteAllowStatusMap,
          },
        });
      }
    },
  },
  subscriptions: {
    setUpCallAuction({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pull', interval: 20 * 1000 },
      });

      dispatch({
        type: 'watchPolling',
        payload: { effect: 'getAuctionWhiteAllowList', interval: 60 * 1000 },
      });
    },
    subscribeMessage({ dispatch }) {
      // 买卖盘数据处理
      const handler = (arr) => {
        window._x_topicTj('INFO_CALL_AUCTION_WEB', '', arr.length);
        each(arr, async (record) => {
          try {
            const { data } = record;
            const callAuctionStatePrev = await callAuctionStore.handler.select(
              (state) => state.callAuction,
            );
            await callAuctionStore.handler.update({
              ...callAuctionStatePrev,
              auctionDataMap: {
                ...callAuctionStatePrev.auctionDataMap,
                [data.symbol]: data,
              },
            });
          } catch (error) {
            if (_DEV_ || _IS_TEST_ENV_) {
              console.error(error);
            }
          }
        });
      };
      // 集合竞价预估信息
      const fn = workerSocket[PushConf.CallAuctionInfo.eventName];
      if (fn) {
        fn(handler);
      }
    },
  },
});
