/**
 * Owner: borden@kupotech.com
 */
import { each, throttle } from 'lodash';
import polling from 'common/models/polling';
import base from 'common/models/base';
import extend from 'dva-model-extend';
import {
  queryMainAccount,
  queryTradeAccount,
  queryHighFrequencyAccount,
  queryUserHasHighAccount,
  getDepositCoinList,
  getWithDrawCoinList,
  queryAssetsByType,
} from 'services/account';
import * as ws from '@kc/socket';
import workerSocket from 'common/utils/socketProcess';
import { selfTransfer } from 'services/assets';
import { APMSWCONSTANTS } from 'utils/apm/apmConstants';
// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

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
    main: [],
    highFrequency: [],
    trade: [],
    margin: [],
    coinIn: [],
    withdraw: [],
    mainMap: {},
    tradeMap: {},
    highFrequencyMap: {},
    marginMap: {},
    marginTotalAsset: 0,
    currencies: [],
    isHFAccountExist: false, // 用户是否有高频账户
  },
  effects: {
    // *watchUser({ type }, { take, put, select }) {
    //   while (true) {
    //     yield take('user/pullUser/@@end');
    //     const { user } = yield select(state => state.user);
    //     if (user) {
    //       yield put({
    //         type: 'user_assets/pullAccountCoins@polling:cancel',
    //       });
    //       yield put({
    //         type: 'user_assets/pullAccountCoins@polling',
    //       });
    //       yield put({
    //         type: 'pullAssetsCoins',
    //       });
    //       yield put({
    //         type: 'overview/pullUserTotalBalance@polling:cancel',
    //       });
    //       yield put({
    //         type: 'overview/pullUserTotalBalance@polling',
    //       });
    //     }
    //   }
    // },
    *initAfterUser({ payload }, { take, put, select }) {
      const { user } = payload;
      if (user) {
        yield put({
          type: 'user_assets/pullCommonAccountCoins@polling:cancel',
        });
        yield put({
          type: 'user_assets/pullCommonAccountCoins@polling',
        });
        yield put({
          type: 'pullAssetsCoins',
        });
        yield put({ type: 'queryUserHasHighAccount' }); // 高频账户判断
        // 资产概览总资产改成/overview接口
        // yield put({
        //   type: 'overview/pullUserTotalBalance@polling:cancel',
        // });
        // yield put({
        //   type: 'overview/pullUserTotalBalance@polling',
        // });
        yield put({ type: 'marginMeta/pullUserMarginPostion' });
        // 获取用户信息，包含vip等级
        yield put({ type: 'homepage/getUserOverviewInfo' });
      }
    },
    *pullAssetsByType({ payload = {}, callback }, { call, put }) {
      const { success, data } = yield call(queryAssetsByType, payload);
      if (success) {
        if (typeof callback === 'function') callback(data);
        yield put({
          type: 'update',
          payload: {
            currencies: data,
          },
        });
      }
    },
    *queryUserHasHighAccount(_, { call, put }) {
      const res = yield call(queryUserHasHighAccount);
      if (res?.success) {
        yield put({
          type: 'update',
          payload: {
            isHFAccountExist: res?.data,
          },
        });
      }
    },
    // main/trade常规账户 添加高频账户
    *pullCommonAccountCoins({ payload }, { call, put, all, select }) {
      const {
        isHFAccountExist,
        main: mainList,
        trade: tradeList,
        highFrequency: highFrequencyList,
      } = yield select((state) => state.user_assets);
      const highFrequencyValidate =
        (isHFAccountExist && highFrequencyList.length) || !isHFAccountExist;
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const connected = yield workerSocket.connected();
      if (
        mainList.length &&
        tradeList.length &&
        highFrequencyValidate &&
        connected
      ) {
        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;

          const topicStateData = topicStateConst.SUBSCRIBED;
          if (
            topicState[ws.Topic.ACCOUNT_BALANCE_SNAPSHOT] &&
            topicState[ws.Topic.ACCOUNT_BALANCE_SNAPSHOT].status ===
              topicStateData
          ) {
            return;
          }
        }
      }
      const [
        { data: main },
        { data: trade },
        { data: highFrequency },
      ] = yield all([
        call(queryMainAccount),
        call(queryTradeAccount),
        call(queryHighFrequencyAccount),
      ]);
      const [tradeMap, mainMap, highFrequencyMap] = yield all([
        call(getCoinMap, trade),
        call(getCoinMap, main),
        call(getCoinMap, highFrequency),
      ]);

      yield put({
        type: 'update',
        payload: {
          main: main || [],
          trade: trade || [],
          highFrequency: highFrequency || [],
          tradeMap,
          mainMap,
          highFrequencyMap,
        },
      });
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
    *pullAssetsCoins({ payload }, { call, put, all }) {
      const [{ data: coinIn }, { data: withdraw }] = yield all([
        call(getDepositCoinList),
        call(getWithDrawCoinList),
      ]);
      yield put({
        type: 'update',
        payload: {
          coinIn: coinIn || [],
          withdraw: withdraw || [],
        },
      });
    },
    *selfTransfer({ payload }, { call }) {
      const { success } = yield call(selfTransfer, payload);
      return success;
    },
    /** ws update */
    *updateBalance(
      {
        payload: {
          banchMapMain = {},
          banchMapTrade = {},
          banchMapMargin = {},
          banchMapHighFrequency = {},
        },
      },
      { put, select, call },
    ) {
      const {
        mainList,
        tradeList,
        highFrequencyList,
        marginList,
        marginMap,
        prices,
      } = yield select((state) => ({
        mainList: state.user_assets.main,
        tradeList: state.user_assets.trade,
        highFrequencyList: state.user_assets.highFrequency,
        marginList: state.user_assets.margin,
        marginMap: state.user_assets.marginMap,
        prices: state.currency.prices,
      }));

      let canUpdateMain = false;
      let canUpdateTrade = false;
      let canUpdateHighFrequency = false;
      let canUpdateMargin = false;
      const isEmptyObjMain = JSON.stringify(banchMapMain) === '{}';
      const isEmptyObjTrade = JSON.stringify(banchMapTrade) === '{}';
      const isEmptyObjHighFrequency =
        JSON.stringify(banchMapHighFrequency) === '{}';
      const isEmptyObjMargin = JSON.stringify(banchMapMargin) === '{}';

      const mainListNew = [...mainList];
      each(isEmptyObjMain ? [] : mainList, (_item, index) => {
        const item = mainListNew[index];
        const { currency, time } = item;
        if (banchMapMain[currency] && banchMapMain[currency].time > time) {
          if (!canUpdateMain) {
            canUpdateMain = true;
          }
          mainListNew[index] = {
            ...item,
            ...banchMapMain[currency],
          };
        }
      });

      const tradeListNew = [...tradeList];
      each(isEmptyObjTrade ? [] : tradeList, (_item, index) => {
        const item = tradeListNew[index];
        const { currency, time } = item;
        if (banchMapTrade[currency] && banchMapTrade[currency].time > time) {
          if (!canUpdateTrade) {
            canUpdateTrade = true;
          }
          tradeListNew[index] = {
            ...item,
            ...banchMapTrade[currency],
          };
        }
      });

      const highFrequencyListNew = [...highFrequencyList];
      each(isEmptyObjHighFrequency ? [] : highFrequencyList, (_item, index) => {
        const item = highFrequencyListNew[index];
        const { currency, time } = item;
        if (banchMapHighFrequency?.[currency]?.time > time) {
          if (!canUpdateHighFrequency) {
            canUpdateHighFrequency = true;
          }
          highFrequencyListNew[index] = {
            ...item,
            ...banchMapHighFrequency[currency],
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
      if (canUpdateMain) {
        payload.main = getSortedData(mainListNew);
        payload.mainMap = yield call(getCoinMap, mainListNew);
      }
      if (canUpdateTrade) {
        payload.trade = getSortedData(tradeListNew);
        payload.tradeMap = yield call(getCoinMap, tradeListNew);
      }
      if (canUpdateHighFrequency) {
        payload.highFrequency = getSortedData(highFrequencyListNew);
        payload.highFrequencyMap = yield call(getCoinMap, highFrequencyListNew);
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
  },
  subscriptions: {
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullCommonAccountCoins',
        },
      });
    },
    // @deprecated 改为直接触发，不需要监听
    // watchUser({ dispatch }) {
    //   dispatch({
    //     type: 'watchUser',
    //   });
    // },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      const throttlePullAssetDetail = throttle(
        () => {
          dispatch({
            type: 'overview/pullAssetDetail',
          });
        },
        10000,
        { leading: true },
      );

      // 已在worker中处理数据
      // {"data":{"total":"112","holdChange":"0","relationEvent":"main.deposit","available":"112","currency":"KCS","availableChange":"88","time":"2018-12-29T17:43:11.743 +0800","hold":"0","relationEventId":"test_123456836"},"subject":"account.balance","id":"test_123456836","type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      workerSocket.accountBalanceMessage(
        ({ isAllTransferEvents, ...payload }) => {
          // 划转不会导致总资产的变更
          if (!isAllTransferEvents) {
            throttlePullAssetDetail();
          }
          dispatch({
            type: 'updateBalance',
            payload,
          });
        },
      );
    },
  },
});
