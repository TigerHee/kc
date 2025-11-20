/**
 * Owner: borden@kupotech.com
 */
import { each, isEmpty, forIn, findIndex, isBoolean } from 'lodash';
import polling from 'common/models/polling';
import base from 'common/models/base';
import extend from 'dva-model-extend';
import {
  queryMainAccount,
  queryTradeAccount,
  queryUserHasHighAccount,
} from 'services/account';
import * as ws from '@kc/socket';
import { fetchSmallExchangeConfig } from 'services/assets';
import { APMSWCONSTANTS } from 'utils/apm/apmConstants';
import { checkSocketTopic } from '@/utils/socket';
import { topicName } from '@/pages/Assets/config';

const getCoinMap = (coins) => {
  return new Promise((resolve) => {
    const temp = {};
    each(coins, (item) => {
      const { currency } = item;
      temp[currency] = { ...item };
    });
    resolve(temp);
  });
};
export default extend(base, polling, {
  namespace: 'user_assets',
  state: {
    mainMap: {},
    tradeMap: {},
    margin: [],
    marginMap: {},
    isHFAccountExist: undefined, // 用户是否有高频账户
    smallExchangeConfig: null, // 用户小额资产配置
  },
  reducers: {
    updateCrossLiability(state, { payload }) {
      const nextMarginList = [...state.margin];
      const nextMarginMap = { ...state.marginMap };
      each(payload, ({ currency, ...other }) => {
        nextMarginMap[currency] = { ...nextMarginMap[currency], ...other };
        const index = findIndex(nextMarginList, v => v.currency === currency);
        nextMarginList[index] = nextMarginMap[currency];
      });
      return {
        ...state,
        margin: nextMarginList,
        marginMap: nextMarginMap,
      };
    },
  },
  effects: {
    *queryUserHasHighAccount(_, { call, put, select }) {
      const { isHFAccountExist } = yield select(state => state.user_assets);
      if (isBoolean(isHFAccountExist)) return;
      const res = yield call(queryUserHasHighAccount);
      if (res?.success) {
        yield put({
          type: 'update',
          payload: {
            isHFAccountExist: Boolean(res?.data),
          },
        });
      }
    },
    // 資金賬戶(原储蓄账户)
    *pullMainAccountCoins(_, { call, put, select }) {
      const { mainMap } = yield select((state) => state.user_assets);
      const topic = topicName;
      const checkTopic = yield checkSocketTopic({ topic });

      if (isEmpty(mainMap) || !checkTopic) {
        const { data } = yield call(queryMainAccount);
        const coinMap = yield call(getCoinMap, data);
        yield put({
          type: 'update',
          payload: {
            mainMap: coinMap,
          },
        });
      }
    },
    // 币币账户
    *pullTradeAccountCoins(_, { call, put, select }) {
      const { tradeMap } = yield select((state) => state.user_assets);
      const topic = topicName;
      const checkTopic = yield checkSocketTopic({ topic });

      if (isEmpty(tradeMap) || !checkTopic) {
        const { data } = yield call(queryTradeAccount);
        const coinMap = yield call(getCoinMap, data);
        yield put({
          type: 'update',
          payload: {
            tradeMap: coinMap,
          },
        });
      }
    },
    // 全仓杠杆账户
    *updateMarginAccountCoins({ payload = {} }, { call, put }) {
      const { data = [] } = payload;
      const marginMap = yield call(getCoinMap, data);

      yield put({
        type: 'update',
        payload: {
          margin: data || [],
          marginMap,
        },
      });
    },
    /** ws update */
    *updateBalance(
      {
        payload: {
          banchMapMain = {},
          banchMapTrade = {},
          banchMapMargin = {},
        },
      },
      { put, select, call },
    ) {
      const {
        mainMap,
        tradeMap,
        marginList,
        marginMap,
        prices,
      } = yield select((state) => ({
        mainMap: state.user_assets.mainMap,
        tradeMap: state.user_assets.tradeMap,
        marginList: state.user_assets.margin,
        marginMap: state.user_assets.marginMap,
        prices: state.currency.prices,
      }));
      let nextMainMap;
      let nextTradeMap;
      let canUpdateMargin = false;
      const isEmptyObjMargin = isEmpty(banchMapMargin);

      forIn(banchMapMain, (item, key) => {
        nextMainMap = nextMainMap || { ...mainMap };
        if (item.time > mainMap[key]?.time) {
          nextMainMap[key] = {
            ...mainMap[key],
            ...item,
          };
        }
      });
      forIn(banchMapTrade, (item, key) => {
        nextTradeMap = nextTradeMap || { ...tradeMap };
        if (item.time > tradeMap[key]?.time) {
          nextTradeMap[key] = {
            ...tradeMap[key],
            ...item,
          };
        }
      });
      const marginListNew = [...marginList];
      each(isEmptyObjMargin ? [] : marginList, (_item, index) => {
        const item =
          marginMap[marginListNew[index]?.currency] || marginListNew[index];
        const { currency, time = 0 } = item;
        if (banchMapMargin[currency] && banchMapMargin[currency].time > time) {
          if (!canUpdateMargin) {
            canUpdateMargin = true;
          }
          marginListNew[index] = {
            ...item,
            ...banchMapMargin[currency],
          };
        }
      });

      // 数据更新后需要重新排序，规则：按照法币价值排序，法币价格不存在按数量排序,排在有法币价格的币种后面
      const compareVolume = (a, b) => {
        const aTotal = +a.totalBalance * +prices[a.currency];
        const bTotal = +b.totalBalance * +prices[b.currency];
        return bTotal - aTotal;
      };
      const compareAmount = (a, b) => {
        const aAmount = +a.totalBalance;
        const bAmount = +b.totalBalance;
        return bAmount - aAmount;
      };
      const getSortedData = (list) => {
        const sortByVolume =
          list.filter((item) => +item.totalBalance && prices[item.currency]) ||
          [];
        const sortByAmount =
          list.filter(
            (item) => !(+item.totalBalance && prices[item.currency]),
          ) || [];
        sortByVolume.sort(compareVolume);
        sortByAmount.sort(compareAmount);
        return sortByVolume.concat(sortByAmount);
      };

      const payload = {};
      if (nextMainMap) {
        payload.mainMap = nextMainMap;
      }
      if (nextTradeMap) {
        payload.tradeMap = nextTradeMap;
      }
      if (canUpdateMargin) {
        payload.margin = getSortedData(marginListNew);
        payload.marginMap = yield call(getCoinMap, marginListNew);
      }

      yield put({
        type: 'update',
        payload,
      });
      /** 粗略认为update时为资产更新时render结束时进行计数*/
      yield put({ type: 'sendSwSensor' });
    },
    *sendSwSensor(__, { put, select }) {
      try {
        const { swFrequency } = yield select(
          (state) => state.collectionSensorsStore,
        );
        if (!swFrequency[APMSWCONSTANTS.ACCOUNT_BALANCE_SNAPSHOT]) {
          swFrequency[APMSWCONSTANTS.ACCOUNT_BALANCE_SNAPSHOT] = {
            mount_trade: 0,
            event_name: APMSWCONSTANTS.TRADE_FLUSH_ANALYSE,
            component: APMSWCONSTANTS.ACCOUNT_BALANCE_SNAPSHOT,
          };
        }
        swFrequency[APMSWCONSTANTS.ACCOUNT_BALANCE_SNAPSHOT].mount_trade += 1;
        yield put({
          type: 'collectionSensorsStore/collectSwFrequency',
          payload: swFrequency,
        });
      } catch (error) {
        console.error('sendSwSensor-error', error);
      }
    },
    *getSmallExchangeConfig({ payload }, { put, call, select }) {
      const { smallExchangeConfig } = yield select(state => state.user_assets);
      if (smallExchangeConfig) return;
      try {
        const { data } = yield call(fetchSmallExchangeConfig, payload);
        yield put({
          type: 'update',
          payload: {
            smallExchangeConfig: data,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            smallExchangeConfig: {
              baseCurrency: 'USDT',
              quotaLimit: 0,
            },
          },
        });
      }
    },
    *registerMainAccountPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'pullMainAccountCoins' },
      });
    },
    *registerTradeAccountPolling(__, { put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'pullTradeAccountCoins' },
      });
    },
  },
  subscriptions: {},
});
