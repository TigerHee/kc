/**
 * Owner: Borden@kupotech.com
 */
import i18n from '@tools/i18n';
import extend from 'dva-model-extend';
import polling from '@kc/gbiz-base/lib/polling';
import { forOwn, merge, reduce, join, pickBy, values } from 'lodash';
import {
  MAX_LOOP_COUNT,
  NAMESPACE,
  BASE_CURRENCY,
  ORDER_TYPE_MAP,
  ACCOUNT_TYPE_LIST_MAP,
  ORDER_TYPE_ENUM,
  STAKING_ACCOUNT_TYPE,
  CURRENCY_TYPE_ENUM,
} from '../config';
import { getStateFromStore } from '../components/common/StoreProvider';
import { list2map, checkSymbolIsDisabled } from '../utils/tools';
import * as services from '../services/convert';
import { plus, toFixed } from '../utils/format';

let interval;
let loopCount = 1;
const currencyLimitFetchLock = {};

//  ********* BEGIN: 自动匹配 orderType 的字段选择器 ************
// 可用于 redux selector / dva model selector，自动适配
export const fromCurrencySelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState[ORDER_TYPE_MAP[orderType].fromCurrencyKeyName];
};

export const toCurrencySelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState[ORDER_TYPE_MAP[orderType].toCurrencyKeyName];
};

export const priceSymbolSelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState[ORDER_TYPE_MAP[orderType].priceSymbolKeyName];
};
export const loopDurationTimeSelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState[ORDER_TYPE_MAP[orderType].loopDurationTimeKeyName];
};

export const currenciesSelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState.currencies?.[orderType] || [];
};
export const currenciesMapSelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState.currenciesMap?.[orderType] || {};
};

export const convertSymbolsMapSelector = (state) => {
  const realState = state[NAMESPACE] || state;
  const { orderType } = realState;
  return realState.convertSymbolsMap?.[orderType] || {};
};
//  ********* END: 自动匹配 orderType 的字段选择器 ************

export default extend(polling, {
  namespace: NAMESPACE,
  state: {
    accountType: 'BOTH',
    toCurrency: BASE_CURRENCY,
    fromCurrency: 'BTC',
    priceSymbol: `BTC-${BASE_CURRENCY}`,
    positions: null,
    formStatus: '',
    kyc3TradeLimitInfo: null,
    currencies: null,
    currenciesMap: null,
    taxInfoCollectDialogOpen: false,
    loopDurationTime: 5,
    fromCurrencyUSDD: 'USDT',
    toCurrencyUSDD: 'USDD',
    priceSymbolUSDD: 'USDT-USDD',
    loopDurationTimeUSDD: 3 * 60,
    fromCurrencyStaking: 'ksETH',
    toCurrencyStaking: 'ETH',
    priceSymbolStaking: 'ksETH-ETH',
    loopDurationTimeStaking: 5,
    agreeDialogOpen: false,
    agreementUrl: '',
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateCurrency(state, { payload }) {
      const { fromCurrency, toCurrency } = state;
      const priceSymbol = `${payload.fromCurrency || fromCurrency}-${payload.toCurrency ||
        toCurrency}`;
      return {
        ...state,
        ...payload,
        priceSymbol,
      };
    },
    updateUsddCurrency(state, { payload }) {
      const { fromCurrencyUSDD, toCurrencyUSDD } = state;
      const { fromCurrency, toCurrency, ...rest } = payload;
      const newFromCurrency = fromCurrency || fromCurrencyUSDD;
      const newToCurrency = toCurrency || toCurrencyUSDD;
      const priceSymbolUSDD = `${newFromCurrency}-${newToCurrency}`;
      return {
        ...state,
        ...rest,
        fromCurrencyUSDD: newFromCurrency,
        toCurrencyUSDD: newToCurrency,
        priceSymbolUSDD,
      };
    },
    updateStakingCurrency(state, { payload }) {
      const { fromCurrencyStaking, toCurrencyStaking } = state;
      const { fromCurrency, toCurrency, ...rest } = payload;
      const newFromCurrency = fromCurrency || fromCurrencyStaking;
      const newToCurrency = toCurrency || toCurrencyStaking;
      const priceSymbolStaking = `${newFromCurrency}-${newToCurrency}`;
      return {
        ...state,
        ...rest,
        fromCurrencyStaking: newFromCurrency,
        toCurrencyStaking: newToCurrency,
        priceSymbolStaking,
      };
    },
    updatePostions(state, { payload }) {
      return {
        ...state,
        positions: { ...merge(state.positions, payload) },
      };
    },
    updateConvertSymbolsMap(state, { payload }) {
      return {
        ...state,
        convertSymbolsMap: {
          ...state.convertSymbolsMap,
          ...payload,
        },
      };
    },
    resetPriceSymbol(state) {
      return {
        ...state,
        priceSymbol: `${state.fromCurrency}-${state.toCurrency}`,
        priceSymbolUSDD: `${state.fromCurrencyUSDD}-${state.toCurrencyUSDD}`,
        priceSymbolStaking: `${state.fromCurrencyStaking}-${state.toCurrencyStaking}`,
      };
    },
    resetFormStatus(state) {
      loopCount = 1;
      return {
        ...state,
        formStatus: '',
      };
    },
  },
  effects: {
    *checkConvertOpen(_, { put, call, select }) {
      const { user } = yield select((state) => state.user);
      if (!user) return;
      try {
        const res = yield call(services.checkUserAgreement);
        yield put({
          type: 'update',
          payload: {
            agreeDialogOpen: !res?.data?.isSign,
            agreementUrl: res?.data?.agreementUrl ?? '',
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    *queryCurrencyList({ isInit, payload = {} }, { call, put, select }) {
      const { accountType, currencies, currenciesMap, orderType: _orderType } = yield select(
        (state) => state[NAMESPACE],
      );
      const orderType = payload?.orderType ?? _orderType;
      if (!ORDER_TYPE_MAP[orderType] || (isInit && currencies?.[orderType])) return;
      const { accountTypes } = ACCOUNT_TYPE_LIST_MAP[accountType];
      const { data } = yield call(services.queryCurrencyList, {
        orderType,
        accountTypes: join(accountTypes, ','),
      });
      yield put({
        type: 'update',
        payload: {
          currencies: {
            ...currencies,
            [orderType]: data,
          },
          currenciesMap: {
            ...currenciesMap,
            [orderType]: list2map(data.currencies, (v) => v.currency),
          },
        },
      });
    },
    *queryStakingCurrencyList({ isInit, payload = {} }, { call, put, select, all }) {
      const { currencies, currenciesMap, orderType: _orderType } = yield select(
        (state) => state[NAMESPACE],
      );
      const orderType = payload?.orderType ?? _orderType;
      if (!ORDER_TYPE_MAP[orderType] || (isInit && currencies?.[orderType])) return;
      const [fromData, toData] = yield all([
        call(services.queryCurrencyList, {
          orderType: ORDER_TYPE_ENUM.MARKET, // staking底层是市价单
          accountTypes: STAKING_ACCOUNT_TYPE, // FROM 方向的币种余额固定查理财账户
          currencyTypes: CURRENCY_TYPE_ENUM.STAKING, // FROM 方向的币种只查 Staking 类型
        }),
        call(services.queryCurrencyList, {
          orderType: ORDER_TYPE_ENUM.MARKET, // staking底层是市价单
          accountTypes: join(ACCOUNT_TYPE_LIST_MAP.TRADE.accountTypes, ','), // TO 方向的币种余额固定查币币账户
          currencyTypes: join(
            values(pickBy(CURRENCY_TYPE_ENUM, (v) => v !== CURRENCY_TYPE_ENUM.STAKING)), // FROM 方向的币种排除 Staking 类型
            ',',
          ),
        }),
      ]);
      const data = {
        currencies: [
          // 强制覆盖tradeDirection使得from to币种选择只能选对应的数据
          ...(fromData?.data?.currencies || []).map((x) => ({ ...x, tradeDirection: 'FROM' })),
          ...(toData?.data?.currencies || []).map((x) => ({ ...x, tradeDirection: 'TO' })),
        ],
        hot: [], // 不展示
      };
      yield put({
        type: 'update',
        payload: {
          currencies: {
            ...currencies,
            [ORDER_TYPE_ENUM.STAKING]: data,
          },
          currenciesMap: {
            ...currenciesMap,
            [ORDER_TYPE_ENUM.STAKING]: list2map(data.currencies, (v) => v.currency),
          },
        },
      });
    },
    *getConvertSymbols({ payload = {} }, { call, put, select }) {
      const { orderType: _orderType } = yield select((state) => state[NAMESPACE]);
      const orderType = payload?.orderType ?? _orderType;

      if (!ORDER_TYPE_MAP[orderType] || currencyLimitFetchLock[orderType]) return;

      try {
        currencyLimitFetchLock[orderType] = true;
        const { data } = yield call(services.getCurrencyLimit, {
          orderType,
        });
        yield put({
          type: 'updateConvertSymbolsMap',
          payload: {
            [data.orderType]: {
              usdtCurrencyLimitMap: data.usdtCurrencyLimitMap,
              normalCurrencyLimitMap: data.normalCurrencyLimitMap,
            },
          },
        });
      } catch (e) {
        currencyLimitFetchLock[orderType] = false;
      }
    },
    *getUsddConvertSymbols({ payload = {} }, { call, put, select }) {
      if (currencyLimitFetchLock[ORDER_TYPE_ENUM.USDD]) return;
      try {
        currencyLimitFetchLock[ORDER_TYPE_ENUM.USDD] = true;
        const { data } = yield call(services.getUsddLimit, {});
        const map = list2map(data?.currencies ?? [], 'currency');
        yield put({
          type: 'updateConvertSymbolsMap',
          payload: {
            [ORDER_TYPE_ENUM.USDD]: map,
          },
        });
      } catch (e) {
        currencyLimitFetchLock[ORDER_TYPE_ENUM.USDD] = false;
      }
    },
    *getStakingConvertSymbols({ payload = {} }, { call, put, select }) {
      if (currencyLimitFetchLock[ORDER_TYPE_ENUM.STAKING]) return;
      try {
        currencyLimitFetchLock[ORDER_TYPE_ENUM.STAKING] = true;
        const { data } = yield call(services.getCurrencyLimit, {
          orderType: ORDER_TYPE_ENUM.MARKET, // 复用市价数据
        });
        yield put({
          type: 'updateConvertSymbolsMap',
          payload: {
            [ORDER_TYPE_ENUM.STAKING]: {
              usdtCurrencyLimitMap: data.usdtCurrencyLimitMap,
              normalCurrencyLimitMap: data.normalCurrencyLimitMap,
            },
          },
        });
      } catch (e) {
        currencyLimitFetchLock[ORDER_TYPE_ENUM.STAKING] = false;
      }
    },
    *pullPosition({ payload = {} }, { put, call, select }) {
      const isLogin = getStateFromStore((state) => state.user);
      if (!isLogin) return;
      const { toCurrency, fromCurrency, accountType: _accountType } = yield select(
        (state) => state[NAMESPACE],
      );
      const accountType = payload.accountType ?? _accountType;
      const currencies = payload.currencies ?? [fromCurrency, toCurrency];
      const { accountTypes } = ACCOUNT_TYPE_LIST_MAP[accountType];
      const { data: balances } = yield call(services.queryAccountBalances, {
        currencies: join(currencies, ','),
        accountTypes: join(accountTypes, ','),
      });

      const balancesData = reduce(
        balances,
        (a, b) => {
          a[b.accountType] = { ...a[b.accountType], [b.currency]: b.availableBalance };
          return a;
        },
        {},
      );
      const positions = {
        ...balancesData,
        ...(accountTypes.length > 1
          ? {
              [accountType]: reduce(
                accountTypes,
                (a, b) => {
                  forOwn(balancesData[b], (value, key) => {
                    a[key] = toFixed(plus(a[key] || 0)(value))(null);
                  });
                  return a;
                },
                {},
              ),
            }
          : null),
      };
      yield put({
        type: 'updatePostions',
        payload: positions,
      });
    },
    *pullUsddPosition({ payload = {} }, { put, call, select }) {
      const isLogin = getStateFromStore((state) => state.user);
      if (!isLogin) return;
      const { toCurrencyUSDD, fromCurrencyUSDD, accountType: _accountType } = yield select(
        (state) => state[NAMESPACE],
      );
      const accountType = payload.accountType ?? _accountType;
      const currencies = payload.currencies ?? [fromCurrencyUSDD, toCurrencyUSDD];
      const { accountTypes } = ACCOUNT_TYPE_LIST_MAP[accountType];
      const { data: balances } = yield call(services.queryAccountBalances, {
        currencies: join(currencies, ','),
        accountTypes: join(accountTypes, ','),
      });

      const balancesData = reduce(
        balances,
        (a, b) => {
          a[b.accountType] = { ...a[b.accountType], [b.currency]: b.availableBalance };
          return a;
        },
        {},
      );
      const positions = {
        ...balancesData,
        ...(accountTypes.length > 1
          ? {
              [accountType]: reduce(
                accountTypes,
                (a, b) => {
                  forOwn(balancesData[b], (value, key) => {
                    a[key] = toFixed(plus(a[key] || 0)(value))(null);
                  });
                  return a;
                },
                {},
              ),
            }
          : null),
      };
      yield put({
        type: 'updatePostions',
        payload: positions,
      });
    },
    *pullStakingPosition({ payload = {} }, { put, call, select }) {
      const isLogin = getStateFromStore((state) => state.user);
      if (!isLogin) return;
      const { toCurrencyStaking, fromCurrencyStaking } = yield select((state) => state[NAMESPACE]);
      const currencies = payload.currencies ?? [fromCurrencyStaking, toCurrencyStaking];
      const accountTypes = [ACCOUNT_TYPE_LIST_MAP.TRADE.value, STAKING_ACCOUNT_TYPE];
      const { data: balances } = yield call(services.queryAccountBalances, {
        currencies: join(currencies, ','),
        accountTypes: join(accountTypes, ','),
      });

      const balancesData = reduce(
        balances,
        (a, b) => {
          a[b.accountType] = { ...a[b.accountType], [b.currency]: b.availableBalance };
          return a;
        },
        {},
      );
      yield put({
        type: 'updatePostions',
        payload: balancesData,
      });
    },
    *confirmMarketOrder({ payload = {} }, { call, put }) {
      // 屏蔽通用error message
      try {
        const res = yield call(services.confirmMarketOrder, payload);
        return res;
      } catch (e) {
        if (e.code === '102441') {
          yield put({
            type: 'update',
            payload: {
              agreeDialogOpen: true,
            },
          });
        }
        return e;
      }
    },
    *confirmLimitOrder({ payload = {} }, { call, select, put }) {
      const { accountType } = yield select((state) => state[NAMESPACE]);
      const { accountTypes } = ACCOUNT_TYPE_LIST_MAP[accountType];
      // 屏蔽通用error message
      try {
        const res = yield call(services.confirmLimitOrder, {
          accountTypes,
          channel: 'WEB_CONVERT',
          ...payload,
        });
        return res;
      } catch (e) {
        if (e.code === '102441') {
          yield put({
            type: 'update',
            payload: {
              agreeDialogOpen: true,
            },
          });
        }
        return e;
      }
    },
    *confirmUsddOrder({ payload = {} }, { call, put }) {
      // 屏蔽通用error message
      try {
        const res = yield call(services.confirmUsddOrder, payload);
        return res;
      } catch (e) {
        if (e.code === '102441') {
          yield put({
            type: 'update',
            payload: {
              agreeDialogOpen: true,
            },
          });
        }
        return e;
      }
    },
    *confirmStakingOrder({ payload = {} }, { call, put }) {
      // 屏蔽通用error message
      try {
        const res = yield call(services.confirmMarketOrder, payload);
        return res;
      } catch (e) {
        if (e.code === '102441') {
          yield put({
            type: 'update',
            payload: {
              agreeDialogOpen: true,
            },
          });
        }
        return e;
      }
    },
    *queryPriceForMarketOrder({ payload = {} }, { call, put, select }) {
      const { requestId, onSuccess, onError, ...params } = payload;
      const modelState = yield select((state) => state[NAMESPACE]);
      const { fromCurrency, toCurrency } = modelState;
      const isSymbolDisabled = checkSymbolIsDisabled(modelState);
      // 单次轮训超过最大次数，取消轮训
      if (loopCount > MAX_LOOP_COUNT || isSymbolDisabled) {
        yield put({
          type: `${NAMESPACE}/queryPriceForMarketOrder@polling:cancel`,
        });
        if (loopCount > MAX_LOOP_COUNT) {
          yield put({
            type: 'update',
            payload: { formStatus: i18n.t('convert:rfcNUC5cf8HvEY96kN1qCo') },
          });
        }
        return;
      }
      try {
        const { data } = yield call(services.queryPriceForMarketOrder, {
          toCurrency,
          fromCurrency,
          ...params,
        });
        loopCount += 1;
        if (typeof onSuccess === 'function') {
          payload.onSuccess(data, requestId);
        }
      } catch (e) {
        loopCount = 1;
        if (typeof onError === 'function') {
          payload.onError(e, requestId);
        }
      }
    },
    *queryPriceForLimitOrder({ payload = {} }, { call, select }) {
      const modelState = yield select((state) => state[NAMESPACE]);
      const { onSuccess, onError, getSizeInfo, ...params } = payload;
      const isSymbolDisabled = checkSymbolIsDisabled(modelState);
      if (isSymbolDisabled) return;
      try {
        const { data } = yield call(services.queryPriceForLimitOrder, {
          ...params,
          ...getSizeInfo(),
        });
        if (typeof onSuccess === 'function') {
          payload.onSuccess(data);
        }
      } catch (e) {
        if (typeof onError === 'function') {
          payload.onError(e);
        }
      }
    },
    *queryPriceForUsddOrder({ payload = {} }, { call, put, select }) {
      const { requestId, onSuccess, onError, ...params } = payload;
      const modelState = yield select((state) => state[NAMESPACE]);
      const { fromCurrencyUSDD: fromCurrency, toCurrencyUSDD: toCurrency } = modelState;
      // 单次轮训超过最大次数，取消轮训
      if (loopCount > MAX_LOOP_COUNT) {
        yield put({
          type: `${NAMESPACE}/queryPriceForUsddOrder@polling:cancel`,
        });
        if (loopCount > MAX_LOOP_COUNT) {
          yield put({
            type: 'update',
            payload: { formStatus: i18n.t('convert:rfcNUC5cf8HvEY96kN1qCo') },
          });
        }
        return;
      }
      try {
        const { data } = yield call(services.queryPriceForUsddOrder, {
          toCurrency,
          fromCurrency,
          channel: 'WEB_CONVERT',
          ...params,
        });
        loopCount += 1;
        if (typeof onSuccess === 'function') {
          payload.onSuccess(data, requestId);
        }
      } catch (e) {
        loopCount = 1;
        if (typeof onError === 'function') {
          payload.onError(e, requestId);
        }
      }
    },
    *queryPriceForStakingOrder({ payload = {} }, { call, put, select }) {
      const { requestId, onSuccess, onError, ...params } = payload;
      const modelState = yield select((state) => state[NAMESPACE]);
      const { fromCurrencyStaking, toCurrencyStaking } = modelState;
      // 检查合法性要取staking 的 from to
      const isSymbolDisabled = checkSymbolIsDisabled({
        ...modelState,
        fromCurrency: fromCurrencyStaking,
        toCurrency: toCurrencyStaking,
      });
      // 单次轮训超过最大次数，取消轮训
      if (loopCount > MAX_LOOP_COUNT || isSymbolDisabled) {
        yield put({
          type: `${NAMESPACE}/queryPriceForStakingOrder@polling:cancel`,
        });
        if (loopCount > MAX_LOOP_COUNT) {
          yield put({
            type: 'update',
            payload: { formStatus: i18n.t('convert:rfcNUC5cf8HvEY96kN1qCo') },
          });
        }
        return;
      }
      try {
        const { data } = yield call(services.queryPriceForMarketOrder, {
          toCurrency: toCurrencyStaking,
          fromCurrency: fromCurrencyStaking,
          ...params,
        });
        loopCount += 1;
        if (typeof onSuccess === 'function') {
          payload.onSuccess(data, requestId);
        }
      } catch (e) {
        loopCount = 1;
        if (typeof onError === 'function') {
          payload.onError(e, requestId);
        }
      }
    },
    *triggerMarketPolling({ interval: _interval }, { call, put }) {
      if (!interval) {
        try {
          const { data } = yield call(services.getRefreshGap);
          interval = data || 5;
        } catch (e) {
          interval = 5;
        }
        yield put({
          type: 'update',
          payload: {
            loopDurationTime: interval,
          },
        });
      }
      yield put({
        type: 'watchPolling',
        payload: { effect: 'queryPriceForMarketOrder', interval: _interval || interval * 1000 },
      });
    },
    *triggerLimitPolling(_, { call, put }) {
      if (!interval) {
        try {
          const { data } = yield call(services.getRefreshGap);
          interval = data || 5;
        } catch (e) {
          interval = 5;
        }
        yield put({
          type: 'update',
          payload: {
            loopDurationTime: interval,
          },
        });
      }
      yield put({
        type: 'watchPolling',
        payload: { effect: 'queryPriceForLimitOrder', interval: interval * 1000 },
      });
    },
    *triggerUsddPolling({ interval: _interval }, { call, put }) {
      yield put({
        type: 'watchPolling',
        payload: { effect: 'queryPriceForUsddOrder', interval: _interval },
      });
    },
    *triggerStakingPolling({ interval: _interval }, { call, put }) {
      if (!interval) {
        try {
          const { data } = yield call(services.getRefreshGap);
          interval = data || 5;
        } catch (e) {
          interval = 5;
        }
        yield put({
          type: 'update',
          payload: {
            loopDurationTimeStaking: interval,
          },
        });
      }
      yield put({
        type: 'watchPolling',
        payload: { effect: 'queryPriceForStakingOrder', interval: _interval || interval * 1000 },
      });
    },
    *getKyc3TradeLimitInfo({ payload }, { call, put }) {
      const { data } = yield call(services.getKyc3TradeLimitInfo, payload);
      yield put({
        type: 'update',
        payload: { kyc3TradeLimitInfo: data || {} },
      });
    },
  },
});
