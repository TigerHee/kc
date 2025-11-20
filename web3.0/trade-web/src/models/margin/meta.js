/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import * as ws from '@kc/socket';
import baseUtil from 'common/models/base';
import polling from 'common/models/polling';
import { each, forIn } from 'lodash';
import {
  getUserMarginPostion,
  userSignAgreement,
  getUserMarginPostionDetail,
  setAutoRepayConfig,
  getAutoLendConf,
  postAutoLend,
  pullConfigs,
  pullConfigsByUser,
  updateUserLeverage,
  getCrossCurrenciesByUser,
  getLoanCurrencies,
} from 'services/margin';
import {
  pullArticleDetail,
  pullMarginTradeExamContent,
} from 'services/homepage';
import {
  getNetAsset,
  getRealLeaverage,
  getMaxBorrowSize,
} from 'components/Isolated/utils';
import workerSocket from 'common/utils/socketProcess';
import { TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';
import { numberFixed, normalizeNumber } from 'helper';
import { delay } from 'utils/delay';

const commonParams = { channel: 'WEB' };
// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;
// effect执行计数
const effectsCount = {};

export default extend(baseUtil, polling, {
  namespace: 'marginMeta',
  state: {
    isFirstFetchDetail: false,
    borrowFormVisible: false, // 借款窗口
    repayFormVisible: false, // 还款窗口
    currentMarket: 'BTC',
    isMargin: false, // 是否是杠杆
    userPosition: null,
    positionDetail: {},
    liabilityRate: 0,
    autoLendConfig: {},
    marginModalConfig: {
      open: false,
      modalType: 0,
    },
    autoRepayConfirmOpen: false,
    debtModalVisible: false,
    configs: null,
    borrowSizeMap: {},
    agreement: {},
    crossCurrencies: [],
    crossCurrenciesMap: {},
    loanCurrencies: [],
    loanCurrenciesMap: {},
    examContent: [],
    openMarginVisible: false, // 开通杠杆协议
  },
  reducers: {
    changeUserLeverage(state, { payload }) {
      const { userLeverage } = payload;
      return {
        ...state,
        userPosition: { ...(state.userPosition || {}), userLeverage },
      };
    },
    updateAutoLendConfig(state, { payload }) {
      const { currency, isAutoLend } = payload;
      return {
        ...state,
        autoLendConfig: { ...state.autoLendConfig, [currency]: isAutoLend },
      };
    },
  },
  effects: {
    // 获取用户杠杆账户状态(Trade3.0)
    *pullUserMarginPostion({ payload = {} }, { put, call, select }) {
      const { isLogin } = yield select((state) => state.user);
      if (!isLogin) return;
      const { data } = yield call(getUserMarginPostion);
      yield put({
        type: 'update',
        payload: {
          userPosition: data,
        },
      });
      if (data && data.openFlag) {
        yield put({
          type: 'marginMeta/pullUserMarginPostionDetail@polling:cancel',
        });
        yield put({
          type: 'marginMeta/pullUserMarginPostionDetail@polling',
        });
      }
    },
    *updateStatus({ payload = {} }, { put, select }) {
      const { userPosition } = yield select((state) => state.marginMeta);
      const { tradeType } = yield select((state) => state.trade);
      const {
        data: { type },
      } = payload;
      if (
        type &&
        userPosition &&
        tradeType === TRADE_TYPES_CONFIG.MARGIN_TRADE.key
      ) {
        yield put({
          type: 'update',
          payload: {
            userPosition: { ...userPosition, status: type },
          },
        });
      }
    },
    // 用户同意杠杆协议
    *userSignAgreement({ payload = {} }, { put, call }) {
      const { data, success } = yield call(userSignAgreement);
      if (success) {
        yield put({
          type: 'pullUserMarginPostion',
        });
      }
      return success;
    },
    // 获取用户仓位详情(Trade3.0)
    *pullUserMarginPostionDetail({ payload = {} }, { put, call, select }) {
      const categories = yield select((state) => state.categories);
      const { margin } = yield select((state) => state.user_assets);
      const connected = yield workerSocket.connected();
      if (margin.length && connected) {
        const topics = [
          '/margin/account',
          '/margin/position',
        ];
        const wsState = yield workerSocket.getTopicState();
        if (wsState) {
          const { topicStateConst, topicState } = wsState;
          const topicStateData = topicStateConst.SUBSCRIBED;
          if (
            topics.every(
              (topic) =>
                topicState[topic] &&
                topicState[topic].status === topicStateData,
            )
          ) {
            return;
          }
        }
      }
      const { precision = 8 } = categories.BTC || {};
      const { data } = yield call(getUserMarginPostionDetail);
      const {
        totalBalance,
        fundsInfoList,
        liabilityRate,
        totalLiability,
        marginCoefficientTotalAsset,
        ...other
      } = data || {};
      yield put({
        type: 'user_assets/updateMarginAccountCoins',
        payload: {
          data: fundsInfoList,
        },
      });
      yield put({
        type: 'update',
        payload: {
          positionDetail: {
            totalBalance: numberFixed(totalBalance, precision),
            totalLiability: numberFixed(totalLiability, precision),
            totalBalanceWithCoefficient: numberFixed(
              marginCoefficientTotalAsset,
              precision,
            ),
            ...other,
          },
          liabilityRate: normalizeNumber(+liabilityRate, 4),
        },
      });
    },
    *pullAutoLendConf({ payload = {} }, { put, call }) {
      const { currency } = payload;
      const result = yield call(getAutoLendConf, {
        ...commonParams,
        ...payload,
      });
      if (result.success) {
        yield put({
          type: 'updateAutoLendConfig',
          payload: {
            currency,
            isAutoLend: result.data.autoLendStatus === 'ENABLE',
          },
        });
      }
      return result;
    },
    // 修改自动借出配置
    *postAutoLend({ payload = {} }, { put, call }) {
      const { success } = yield call(postAutoLend, {
        ...commonParams,
        ...payload,
      });
      if (success) {
        yield put({
          type: 'pullAutoLendConf',
          payload: {
            currency: payload.currency,
          },
        });
      }
      return success;
    },
    // 获取用户仓位详情(Trade3.0)
    *updateDebtRatio({ payload = {} }, { put, select }) {
      const categories = yield select((state) => state.categories);
      const { positionDetail } = yield select((state) => state.marginMeta);
      const { marginMap } = yield select((state) => state.user_assets);
      const { precision = 8 } = categories.BTC || {};
      const {
        totalAsset: totalBalance = 0,
        totalDebt: totalLiability = 0,
        debtRatio = 0,
        debtList = {},
        marginCoefficientTotalAsset,
      } = payload.data || {};
      let diffMarginMap;
      forIn(debtList, (value, key) => {
        if (marginMap[key] && marginMap[key].liability !== value) {
          diffMarginMap = diffMarginMap || {};
          diffMarginMap[key] = { ...marginMap[key], liability: value };
        }
      });
      if (typeof debtRatio === 'number') {
        if (diffMarginMap) {
          yield put({
            type: 'user_assets/update',
            payload: { marginMap: { ...marginMap, ...diffMarginMap } },
          });
        }
        yield put({
          type: 'update',
          payload: {
            liabilityRate: normalizeNumber(+debtRatio, 4),
            positionDetail: {
              ...positionDetail,
              totalBalance: numberFixed(totalBalance, precision),
              totalLiability: numberFixed(totalLiability, precision),
              ...(marginCoefficientTotalAsset !== undefined
                ? {
                    totalBalanceWithCoefficient: numberFixed(
                      marginCoefficientTotalAsset,
                      precision,
                    ),
                  }
                : null),
            },
          },
        });
      }
    },
    // 修改自动还币配置
    *postAutoRepayConfig({ payload = {}, callback }, { put, call, select }) {
      const { userPosition, positionDetail } = yield select(
        (state) => state.marginMeta,
      );
      const switchStatus = payload.switchStatus ? 'ON' : 'OFF';
      const { success } = yield call(setAutoRepayConfig, { switchStatus });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            userPosition: {
              ...userPosition,
              isAutoRepay: payload.switchStatus,
            },
            positionDetail: {
              ...positionDetail,
              isAutoRepay: payload.switchStatus,
            },
          },
        });
        if (typeof callback === 'function') callback();
      }
    },
    *pullConfigs({ payload = {} }, { put, call }) {
      if (effectsCount.pullConfigsByUser) return;
      const { success, data } = yield call(pullConfigs);
      // 二次阻断，防止请求结果覆盖下方pullConfigsByUser的结果
      if (success && !effectsCount.pullConfigsByUser) {
        yield put({
          type: 'update',
          payload: {
            configs: data,
          },
        });
      }
    },
    *pullConfigsByUser(_, { put, call }) {
      if (effectsCount.pullConfigsByUser) return;
      const { success, data } = yield call(pullConfigsByUser);
      if (success) {
        effectsCount.pullConfigsByUser = 1;
        yield put({
          type: 'update',
          payload: {
            configs: data,
          },
        });
      }
    },
    *updateUserLeverage({ payload = {} }, { call }) {
      const res = yield call(updateUserLeverage, payload);
      return res;
    },
    *getCurrentRealLeverage(_, { select }) {
      const { positionDetail } = yield select((state) => state.marginMeta);
      const { totalBalanceWithCoefficient, totalLiability } = positionDetail;
      if (!totalLiability || !+totalLiability) return 1;
      const netAsset = getNetAsset(totalBalanceWithCoefficient, totalLiability);
      return getRealLeaverage(totalBalanceWithCoefficient, netAsset);
    },
    *computeMaxBorrowSizeMap({ payload: { userLeverage } }, { put, select }) {
      if (!userLeverage) return {};
      const { currentSymbol } = yield select((state) => state.trade);
      const { marginMap } = yield select((state) => state.user_assets);
      const { targetPriceMap } = yield select((state) => state.isolated);
      const {
        positionDetail,
        loanCurrenciesMap,
        crossCurrenciesMap,
      } = yield select((state) => state.marginMeta);

      const [base, quote] = currentSymbol.split('-');
      const { totalBalanceWithCoefficient, totalLiability } = positionDetail;

      // 总资产为0，直接重置borrowSizeMap里币种的值为0
      if (!+totalBalanceWithCoefficient) {
        yield put({
          type: 'update',
          payload: {
            borrowSizeMap: {
              [base]: 0,
              [quote]: 0,
            },
          },
        });
        return {};
      }

      const netAsset = getNetAsset(totalBalanceWithCoefficient, totalLiability);

      const nextBorrowSizeMap = {};
      [base, quote].forEach((currency) => {
        const { borrowMaxAmount, borrowCoefficient } =
          crossCurrenciesMap[currency] || {};
        const { borrowMinAmount, currencyLoanMinUnit, marginBorrowEnabled } =
          loanCurrenciesMap[currency] || {};
        if (!marginBorrowEnabled) {
          nextBorrowSizeMap[currency] = 0;
          return;
        }
        const { liability } = marginMap[currency] || {};
        const targetPrice = targetPriceMap[`${currency}-BTC`] || 0;
        nextBorrowSizeMap[currency] = getMaxBorrowSize({
          coin: {
            liability,
            targetPrice,
            borrowMaxAmount,
            borrowMinAmount,
            borrowCoefficient,
            currencyLoanMinUnit,
          },
          userLeverage,
          netAsset,
          totalLiability,
        });
      });
      return nextBorrowSizeMap;
    },
    *getMaxBorrowSizeMap(_, { put, select }) {
      const { userPosition } = yield select((state) => state.marginMeta);
      const { userLeverage } = userPosition || {};
      const nextBorrowSizeMap = yield yield put({
        type: 'computeMaxBorrowSizeMap',
        payload: { userLeverage },
      });
      yield put({
        type: 'update',
        payload: {
          borrowSizeMap: nextBorrowSizeMap || {},
        },
      });
    },
    *pullAgreementContent(_, { put, call, select }) {
      const { currentLang } = yield select((state) => state.app);
      const path =
        currentLang === 'zh_CN'
          ? 'margin-trading-agreement'
          : 'en-margin-trading-agreement';

      const { data } = yield call(pullArticleDetail, path);
      yield put({
        type: 'update',
        payload: {
          agreement: data,
        },
      });
    },
    // 杠杆交易测试答题
    *pullMarginTradeExamContent(_, { put, call, select }) {
      const { data } = yield call(pullMarginTradeExamContent);
      let content = [];

      try {
        content = JSON.parse(data);
      } catch (error) {
        content = [];
      }

      yield put({
        type: 'update',
        payload: {
          examContent: Array.isArray(content) ? content : [],
        },
      });
    },
    *pullCrossCurrencies({ payload = {} }, { put, call, select }) {
      const { user } = yield select((state) => state.user);
      const { crossCurrencies } = yield select((state) => state.marginMeta);
      if (crossCurrencies.length) return;
      const { isSub } = user || {};
      const { data } = yield call(getCrossCurrenciesByUser, {
        ...payload,
        isSubAcc: !!isSub,
      });
      const crossCurrenciesMap = {};
      each(data, (item) => {
        crossCurrenciesMap[item.currency] = item;
      });
      yield put({
        type: 'update',
        payload: {
          crossCurrenciesMap,
          crossCurrencies: data,
        },
      });
    },
    *pullLoanCurrencies({ payload = {} }, { put, call, select }) {
      const { loanCurrencies } = yield select((state) => state.marginMeta);
      if (loanCurrencies.length) return;
      try {
        const { data } = yield call(getLoanCurrencies, payload);
        const loanCurrenciesMap = {};
        each(data, (item) => {
          loanCurrenciesMap[item.currency] = item;
        });
        yield put({
          type: 'update',
          payload: {
            loanCurrenciesMap,
            loanCurrencies: data,
          },
        });
      } catch (e) {
        yield call(delay, 3000);
        yield put({ type: 'pullLoanCurrencies' });
      }
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      // FIXME: V3 已下线，先统一屏蔽处理
      // dispatch({ type: 'pullConfigs' });
    },
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullUserMarginPostionDetail', interval: 8 * 1000 },
      });
    },
    // @deprecated 逻辑迁移到 pullUserMarginPostion 下面
    // watchUserMargin({ dispatch }) {
    //   dispatch({
    //     type: 'watchUserMargin',
    //   });
    // },
    subscribeMessage: async ({ dispatch }) => {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      workerSocket.positionStatusMessage((arr) => {
        window._x_topicTj('/margin/position', 'position.status', arr.length);
        dispatch({
          type: 'updateStatus',
          payload: arr[0],
        });
      });
    },
  },
});
