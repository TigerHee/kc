/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import _ from 'lodash';
import {
  getDepositCoinList,
  getWithDrawCoinList,
  pullAssetsAccountBalance,
  queryMainAccount,
  queryTradeAccount,
  queryUserHasHighAccount,
  updateAutoTransfer,
} from 'services/account';
import { outTransfer, selfTransfer } from 'services/assets';
import { _t } from 'tools/i18n';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

const getCoinMap = (coins) => {
  return new Promise((resolve) => {
    const temp = {};
    coins.forEach((item) => {
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
    trade: [],
    coinIn: [],
    withdraw: [],
    mainMap: {},
    tradeMap: {},
    mainAccountAssets: {},
    marginAccountAssets: {},
    currencies: [],
    accountCurrency: [], // 币种账户余额
    transferKumexCurrency: 'BTC', // 划转到 Kumex 的币种
    mainUpdator: 0, // 用来标注储蓄余额的变更
    tradeUpdator: 0, // 用来标注币币余额的变更
    marginUpdator: 0, // 用来标注杠杆余额的变更
  },
  effects: {
    *watchUser(action, { take, put, select }) {
      while (true) {
        yield take('user/pullUser/@@end');
        const { user } = yield select((state) => state.user);
        if (user) {
          yield put({
            type: 'pullAssetsCoins',
          });
        }
      }
    },
    *queryUserHasHighAccount({ _, callback }, { call, put }) {
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
    *pullAccountCoins({ payload = {} }, { call, put, all, select }) {
      const { main: mainList, trade: tradeList } = yield select((state) => state.user_assets);
      const ws = yield import('@kc/socket');
      const socket = ws.getInstance();
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const topicStateData = socket.constructor.TOPIC_STATE.SUBSCRIBED;

      if (
        mainList.length &&
        tradeList.length &&
        socket.connected() &&
        socket.topicState['/account/snapshotBalanceFrequency500'] &&
        socket.topicState['/account/snapshotBalanceFrequency500'][0] === topicStateData
      ) {
        return;
      }
      const [{ data: main }, { data: trade }] = yield all([
        call(queryMainAccount),
        call(queryTradeAccount),
      ]);
      const [tradeMap, mainMap] = yield all([call(getCoinMap, trade), call(getCoinMap, main)]);

      yield put({
        type: 'update',
        payload: {
          main: main || [],
          trade: trade || [],
          tradeMap,
          mainMap,
        },
      });
    },
    *pullAssetsCoins(action, { call, put, all }) {
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
    *pullAssetsAccountBalance({ payload }, { call, put }) {
      payload.accountType = 'MAIN,TRADE,MARGIN';
      const { success, data = [] } = yield call(pullAssetsAccountBalance, payload);
      if (!success) return;
      yield put({
        type: 'update',
        payload: {
          accountCurrency: data,
        },
      });
    },
    *updateAutoTransfer({ payload }, { call, put }) {
      const { success } = yield call(updateAutoTransfer, payload);
      if (success) {
        yield put({
          type: 'coinin/update',
          payload: {
            toAccountType: payload.toAccountType,
          },
        });
      }
    },

    *selfTransfer({ payload }, { call }) {
      const { success } = yield call(selfTransfer, payload);
      return success;
    },
    *outTransfer({ payload, callback }, { call, put }) {
      const { success } = yield call(outTransfer, payload);
      if (success) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('kumex.transfer.success'),
          },
        });
        if (typeof callback === 'function') {
          callback(success);
        }
      }
    },
    /** ws update */
    *updateBalance(
      { payload: { banchMapMain = {}, banchMapTrade = {}, banchMapMargin = {} } },
      { put, select, call },
    ) {
      const { mainList, tradeList, prices, mainUpdator, tradeUpdator, marginUpdator } =
        yield select((state) => ({
          mainList: state.user_assets.main,
          tradeList: state.user_assets.trade,
          prices: state.currency.prices,
          mainUpdator: state.user_assets.mainUpdator,
          tradeUpdator: state.user_assets.tradeUpdator,
          marginUpdator: state.user_assets.marginUpdator,
        }));
      let canUpdateMain = false;
      let canUpdateTrade = false;
      const canUpdateMargin = JSON.stringify(banchMapMargin) !== '{}';
      const isEmptyObjMain = JSON.stringify(banchMapMain) === '{}';
      const isEmptyObjTrade = JSON.stringify(banchMapTrade) === '{}';

      const mainListNew = [...mainList];
      _.each(isEmptyObjMain ? [] : mainList, (_item, index) => {
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
      _.each(isEmptyObjTrade ? [] : tradeList, (_item, index) => {
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

      const nextMainUpdator = canUpdateMain ? mainUpdator + 1 : mainUpdator;
      const nextTradeUpdator = canUpdateTrade ? tradeUpdator + 1 : tradeUpdator;
      const nextMarginUpdator = canUpdateMargin ? marginUpdator + 1 : marginUpdator;

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
          list.filter((item) => +item.totalBalance && prices[item.currency]) || [];
        const sortByAmount =
          list.filter((item) => !(+item.totalBalance && prices[item.currency])) || [];
        sortByVolume.sort(compareVolume);
        sortByAmount.sort(compareAmount);
        return sortByVolume.concat(sortByAmount);
      };

      const payload = {};
      if (canUpdateMain) {
        payload.mainUpdator = nextMainUpdator;
        payload.main = getSortedData(mainListNew);
        payload.mainMap = yield call(getCoinMap, mainListNew);
      }
      if (canUpdateTrade) {
        payload.tradeUpdator = nextTradeUpdator;
        payload.trade = getSortedData(tradeListNew);
        payload.tradeMap = yield call(getCoinMap, tradeListNew);
      }
      if (canUpdateMargin) {
        payload.marginUpdator = nextMarginUpdator;
      }

      yield put({
        type: 'update',
        payload,
      });
    },
  },
  subscriptions: {
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullAccountCoins',
          interval: 5 * 60 * 1000,
        },
      });
    },

    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      import('@kc/socket').then((ws) => {
        const socket = ws.getInstance();
        socket.topicMessage(
          '/account/snapshotBalanceFrequency500',
          'account.snapshotBalance',
          true,
        )((arr) => {
          const banchMapMain = {};
          const banchMapTrade = {};
          const banchMapMargin = {};

          _.each(arr, ({ data }) => {
            const { relationEvent, currency, total, hold, available, time } = data;
            if (relationEvent.indexOf('main.') === 0) {
              banchMapMain[currency] = {
                time,
                totalBalance: total,
                availableBalance: available,
                holdBalance: hold,
              };
            } else if (relationEvent.indexOf('trade.') === 0) {
              banchMapTrade[currency] = {
                time,
                totalBalance: total,
                availableBalance: available,
                holdBalance: hold,
              };
            } else if (relationEvent.indexOf('margin.') === 0) {
              // public-web并没有用到，后需用到需修改
              // TODO 目前杠杆使用的不是这个socket更新，如需使用参考trade-web(精确到币种)和assets-web(整个账户)
              banchMapMargin[currency] = {
                time,
                totalBalance: total,
                availableBalance: available,
                holdBalance: hold,
              };
            }
          });

          // console.log('Btc', banchMapTrade.BTC);
          dispatch({
            type: 'updateBalance',
            payload: { banchMapMain, banchMapTrade, banchMapMargin },
          });
        });
      });
    },
  },
});
