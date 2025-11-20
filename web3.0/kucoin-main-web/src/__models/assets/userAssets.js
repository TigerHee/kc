/**
 * Owner: willen@kupotech.com
 */
import { each } from 'lodash';
import polling from 'common/models/polling';
import base from 'common/models/base';
import extend from 'dva-model-extend';
import {
  queryMainAccount,
  queryTradeAccount,
  queryHighFrequencyAccount,
  pullAssetsAccountBalance,
  getDepositCoinList,
  getWithDrawCoinList,
  queryAssetsByType,
  updateAutoTransfer,
} from 'services/account';
import {
  getMainAccountAssets,
  getMarginAccountAssets,
  selfTransfer,
  outTransfer,
  fetchSmallExchangeConfig,
  getLockAmount,
  getRestrictedInfo,
} from 'services/assets';
import { getKycGuide, getKycGuideContent } from 'services/kyc';
import { getNetAsset } from 'components/Isolated/utils';
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
// 按交易对获取map

export default extend(base, polling, {
  namespace: 'user_assets',
  state: {
    main: [],
    highFrequency: [],
    trade: [],
    margin: [],
    isolated: [],
    coinIn: [],
    withdraw: [],
    mainMap: {},
    tradeMap: {},
    highFrequencyMap: {},
    marginMap: {},
    isolatedMap: {},
    mainAccountAssets: {},
    highFrequencyAccountAssets: {},
    marginAccountAssets: {}, // 全仓仓位明细
    currencies: [],
    accountCurrency: [], // 币种账户余额
    transferKumexCurrency: 'BTC', // 划转到 Kumex 的币种
    smallExchangeConfig: null,
    mainUpdator: 0, // 用来标注储蓄余额的变更
    tradeUpdator: 0, // 用来标注币币余额的变更
    marginUpdator: 0, // 用来标注杠杆余额的变更
    highFrequencyUpdator: 0, // 用来标注高频账户余额的变更
    isHFAccountExist: false, // 用户是否有高频账户
    isHFOpen: {
      // 子母账户高频账号是否开启
      userOpen: false,
      subUserOpen: false,
    },
    lockAmount: null, // 提前入账锁定资产
    useNewAssetsUI: true, // abtest 使用新版
    kycGuideContent: {}, // kyc 横幅文案
    restrictedStatus: 0, // 是否是 KYC 清退用户  0-正常 1-清退 10-ip限制 20-kyc限制
    restrictedInfo: {},
    tradeMigrationProcess: 0, // 0 未开始 1 预告提示 2 迁移完成 注，如果始终没有高频账户那就一直是0，不会有1，2
    // 一些高度，用来计算资产页下粘性定位的top值
    headerHeight: {
      // 整个页面的大header(包括notice)
      header: 0,
      // 资产页的header高度
      assetHeader: 0,
      // 资产搜索框的高度
      assetOperator: 0,
    },
  },
  effects: {
    *watchUser(action, { take, put, select }) {
      const { user } = yield select((state) => state.user);
      if (user) {
        yield put({
          type: 'pullAssetsCoins',
        });
        return;
      }
      while (true) {
        yield take('*');
        const { user: nextUser } = yield select((state) => state.user);
        if (nextUser) {
          yield put({
            type: 'pullAssetsCoins',
          });
          return;
        }
      }
    },
    *watchUserAndBaseConfig(action, { take, put, select, all }) {
      const { user } = yield select((state) => state.user);
      const { smallExchangeConfig } = yield select((state) => state.user_assets);
      if (user && smallExchangeConfig) {
        yield put({
          type: 'user_assets/pullAccountCoins@polling:cancel',
        });
        yield put({
          type: 'user_assets/pullAccountCoins@polling',
        });
        return;
      }

      while (true) {
        yield take('*');
        const { user: nextUser } = yield select((state) => state.user);
        const { smallExchangeConfig: nextConfig } = yield select((state) => state.user_assets);
        if (nextUser && nextConfig) {
          yield put({
            type: 'user_assets/pullAccountCoins@polling:cancel',
          });
          yield put({
            type: 'user_assets/pullAccountCoins@polling',
          });
          return;
        }
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
    *pullAccountCoins(action, { call, put, all, select }) {
      const { kcWs: socket, TOPIC_STATE, Topic } = yield import('src/utils/socket');
      const {
        smallExchangeConfig,
        isHFAccountExist,
        main: mainList,
        trade: tradeList,
        highFrequency: highFrequencyList,
      } = yield select((state) => state.user_assets);
      const highFrequencyValidate =
        (isHFAccountExist && highFrequencyList.length) || !isHFAccountExist;
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const topicStateData = TOPIC_STATE.SUBSCRIBED;
      const topicStateMap = socket.getTopicState();
      if (
        !smallExchangeConfig ||
        (mainList.length &&
          tradeList.length &&
          highFrequencyValidate &&
          socket.connected() &&
          topicStateMap[Topic.ACCOUNT_BALANCE] &&
          topicStateMap[Topic.ACCOUNT_BALANCE].status === topicStateData)
      ) {
        return;
      }
      const [{ data: main }, { data: trade }, { data: highFrequency }] = yield all([
        call(queryMainAccount, 0, smallExchangeConfig.baseCurrency),
        call(queryTradeAccount, 0, smallExchangeConfig.baseCurrency),
        call(queryHighFrequencyAccount, 0, smallExchangeConfig.baseCurrency), // todo
        // call(queryMainAccount, 0, smallExchangeConfig.baseCurrency), // todo
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
    *pullRestrictedInfo(_, { call, put }) {
      const { success, data } = yield call(getRestrictedInfo);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            restrictedStatus: data?.status || 0,
            restrictedInfo: data || {},
          },
        });
      }
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
    *pullMainAccountAssets(action, { put, call, select }) {
      const { balanceCurrency } = yield select((state) => state.user);
      const { success, data } = yield call(getMainAccountAssets, { balanceCurrency });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            mainAccountAssets: data,
          },
        });
      }
    },
    *pullMarginAccountAssets(action, { put, call, select }) {
      const { balanceCurrency } = yield select((state) => state.user);
      const { smallExchangeConfig } = yield select((state) => state.user_assets);
      const { baseCurrency = 'USDT' } = smallExchangeConfig || {};
      const { success, data } = yield call(getMarginAccountAssets, {
        baseCurrency,
        includeIsolated: true, // 是否需要包含逐仓资产
        balanceCurrency: balanceCurrency || 'USDT',
        includePnl: true,
      });
      const { totalBalance = 0, totalLiability = 0 } = data || {};
      const netAsset = getNetAsset(totalBalance, totalLiability);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            marginAccountAssets: {
              ...(data || {}),
              netAsset,
            },
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
        prices,
        mainUpdator,
        tradeUpdator,
        marginUpdator,
        highFrequencyUpdator,
      } = yield select((state) => ({
        mainList: state.user_assets.main,
        tradeList: state.user_assets.trade,
        highFrequencyList: state.user_assets.highFrequency,
        prices: state.currency.prices,
        mainUpdator: state.user_assets.mainUpdator,
        tradeUpdator: state.user_assets.tradeUpdator,
        marginUpdator: state.user_assets.marginUpdator,
        highFrequencyUpdator: state.user_assets.highFrequencyUpdator,
      }));
      let canUpdateMain = false;
      let canUpdateHighFrequency = false;
      let canUpdateTrade = false;
      const canUpdateMargin = JSON.stringify(banchMapMargin) !== '{}';
      const isEmptyObjMain = JSON.stringify(banchMapMain) === '{}';
      const isEmptyObjTrade = JSON.stringify(banchMapTrade) === '{}';
      const isEmptyObjHighFrequency = JSON.stringify(banchMapHighFrequency) === '{}';

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

      const nextMainUpdator = canUpdateMain ? mainUpdator + 1 : mainUpdator;
      const nextHighFrequencyUpdator = canUpdateHighFrequency
        ? highFrequencyUpdator + 1
        : highFrequencyUpdator;
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
      if (canUpdateHighFrequency) {
        payload.highFrequencyUpdator = nextHighFrequencyUpdator;
        payload.highFrequency = getSortedData(highFrequencyListNew);
        payload.highFrequencyMap = yield call(getCoinMap, highFrequencyListNew);
        // console.log('payload.highFrequencyMap', payload.highFrequencyMap);
      }
      if (canUpdateMargin) {
        payload.marginUpdator = nextMarginUpdator;
      }

      yield put({
        type: 'update',
        payload,
      });
    },
    *getSmallExchangeConfig({ payload }, { put, call }) {
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
    *pullLockAssets(_, { call, put }) {
      try {
        const { success, data } = yield call(getLockAmount);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              lockAmount: data,
            },
          });
        }
      } catch (e) {}
    },
    *pullKYCGuide(_, { put, call }) {
      try {
        const { success, data } = yield call(getKycGuide, {
          biz: 'currency',
        });
        if (success) {
          return data.needKyc;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    *pullKYCGuideContent(_, { put, call }) {
      try {
        const { success, data } = yield call(getKycGuideContent, {
          biz: 'currency',
        });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              kycGuideContent: data.assetGuildContent,
            },
          });
        }
      } catch (e) {}
    },
    *updateHeaderHeight({ payload }, { put, call, select }) {
      const headerHeight = yield select((state) => state.user_assets.headerHeight);
      yield put({
        type: 'update',
        payload: {
          headerHeight: {
            ...headerHeight,
            ...payload,
          },
        },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({ type: 'pullRestrictedInfo' });
      dispatch({ type: 'getSmallExchangeConfig' });
    },
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullAccountCoins',
          interval: 5 * 60 * 1000,
        },
      });
    },
    watchUser({ dispatch }) {
      dispatch({
        type: 'watchUser',
      });
    },
    watchUserAndBaseConfig({ dispatch }) {
      dispatch({
        type: 'watchUserAndBaseConfig',
      });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      // {"data":{"total":"112","holdChange":"0","relationEvent":"main.deposit","available":"112","currency":"KCS","availableChange":"88","time":"2018-12-29T17:43:11.743 +0800","hold":"0","relationEventId":"test_123456836"},"subject":"account.balance","id":"test_123456836","type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      import('src/utils/socket').then(({ kcWs: socket, Topic }) => {
        const topicName = '/account/snapshotBalanceFrequency500';
        // socket.subscribe(ws.Topic.ACCOUNT_BALANCE, undefined, true);
        socket.subscribe(topicName, undefined, true);
        socket.topicMessage(
          // ws.Topic.ACCOUNT_BALANCE,
          // 'account.balance',
          topicName,
          'account.snapshotBalance',
          true,
        )((arr) => {
          // console.log('收到来自资产的推送', arr);
          const banchMapMain = {};
          const banchMapTrade = {};
          const banchMapMargin = {};
          const banchMapIsolated = {};
          const banchMapHighFrequency = {};

          each(arr, ({ data }) => {
            const { relationEvent, currency, total, hold, available, tag, time } = data;
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
              banchMapMargin[currency] = {
                time,
                totalBalance: total,
                availableBalance: available,
                holdBalance: hold,
              };
            } else if (relationEvent.indexOf('isolated_') === 0) {
              banchMapIsolated[tag] = {
                time,
                totalBalance: total,
                availableBalance: available,
                holdBalance: hold,
              };
            } else if (relationEvent.indexOf('trade_hf') === 0) {
              // 高频账户
              banchMapHighFrequency[currency] = {
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
            payload: {
              banchMapMain,
              banchMapTrade,
              banchMapMargin,
              banchMapIsolated,
              banchMapHighFrequency,
            },
          });
        });
      });
    },
  },
});
