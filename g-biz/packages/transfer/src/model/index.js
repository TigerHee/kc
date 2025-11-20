/**
 * Owner: melon@kupotech.com
 */
import each from 'lodash/each';
import values from 'lodash/values';
import map from 'lodash/map';
import storage from '@utils/storage';
import { track } from '../utils/ga.js';

import * as services from '../services';

import { MODEL_NAMESPACE } from '../config.js';

const TRANSFER_CURRENCY = 'transfer_currency';

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export default {
  namespace: MODEL_NAMESPACE,
  state: {
    marginPosition: {},
    crossCurrenciesMap: {},
    crossCurrencies: [],
    // loanCurrenciesMap: {},
    // loanCurrencies: [],
    transferConfig: {
      visible: false,
      callback: () => {},
    },
    kumexOpenFlag: undefined,
    transferBalance: undefined,
    batchFailedCurrencies: null, // 批量划转失败交易对
    isSupportBatch: false,
    isolatedSymbols: [], // 支持逐仓杠杆的交易对，排序后的
    tagMap: {},
    optionsOpenFlag: undefined,
    optionCurrenciesSet: [], // 支持期权的币种集合。
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateTagMap(state, { payload }) {
      const nextTagMap = { ...state[MODEL_NAMESPACE].tagMap };
      each(values(payload), (item) => {
        const { tag, status, isAutoRepay } = item;
        nextTagMap[tag] = {
          ...(nextTagMap[tag] || {}),
          ...(status !== undefined ? { status } : {}),
          ...(isAutoRepay !== undefined ? { isAutoRepay } : {}),
        };
      });
      return {
        ...state,
        tagMap: nextTagMap,
      };
    },
  },
  effects: {
    *pullUserMarginPostion(action, { put, call }) {
      const { data } = yield call(services.getUserMarginPostion);
      yield put({
        type: 'update',
        payload: {
          marginPosition: { ...(data || {}) },
        },
      });
    },
    *pullMarginCrossCurrencies({ payload = {} }, { put, call }) {
      // if (loadedEffect.pullCrossCurrencies) return;
      // loadedEffect.pullCrossCurrencies = true;
      try {
        const { data } = yield call(services.getCrossCurrencies, payload);
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
      } catch (e) {
        // loadedEffect.pullCrossCurrencies = false;
        yield call(delay, 3000);
        yield put({ type: 'pullMarginCrossCurrencies' });
      }
    },
    *checkOptionsIsOpen(_, { call, put, select }) {
      const { optionsOpenFlag } = yield select((state) => state[MODEL_NAMESPACE]);
      // 开通状态不可逆，为true则阻止请求
      if (optionsOpenFlag) return;
      let res = true;
      try {
        yield call(services.checkOptions);
      } catch {
        res = false;
      }
      yield put({
        type: 'update',
        payload: {
          optionsOpenFlag: res,
        },
      });
    },
    // *pullMarginLoanCurrencies({ payload = {} }, { put, call }) {
    //   // if (loadedEffect.pullLoanCurrencies) return;
    //   // loadedEffect.pullLoanCurrencies = true;
    //   try {
    //     const { data } = yield call(services.getLoanCurrencies, payload);
    //     const loanCurrenciesMap = {};
    //     each(data, (item) => {
    //       loanCurrenciesMap[item.currency] = item;
    //     });
    //     yield put({
    //       type: 'update',
    //       payload: {
    //         loanCurrenciesMap,
    //         loanCurrencies: data,
    //       },
    //     });
    //   } catch (e) {
    //     // loadedEffect.pullLoanCurrencies = false;
    //     yield call(delay, 3000);
    //     yield put({ type: 'pullCrossCurrencies' });
    //   }
    // },
    *checkKumexIsOpen({ payload = {} }, { call, put }) {
      const { isLogin } = payload;
      if (!isLogin) return;
      const { data } = yield call(services.getAccountOpenConfig, {
        type: 'CONTRACT',
      });
      yield put({
        type: 'update',
        payload: {
          kumexOpenFlag: data,
        },
      });
    },
    *updateTransferConfig({ payload }, { put, select }) {
      const transferConfig = yield select((state) => state[MODEL_NAMESPACE].transferConfig);
      yield put({
        type: 'update',
        payload: {
          transferConfig: {
            ...transferConfig,
            ...payload,
          },
        },
      });
    },
    *pullTransferBalance({ payload = {} }, { call }) {
      const res = yield call(services.getTransferBalance, {
        tag: 'DEFAULT',
        toAccountTag: 'DEFAULT',
        ...payload,
      });
      return res;
    },
    *pullTransferCurrencies({ payload = {}, callback, userInfo }, { call }) {
      const user = userInfo;
      const storageCurrency = storage.getItem(TRANSFER_CURRENCY);
      let baseLegalCurrency = storageCurrency || 'USD';
      if (user && user.currency && user.currency !== 'null') {
        baseLegalCurrency = user.currency;
      } else if (baseLegalCurrency === 'CNY') {
        baseLegalCurrency = 'USD';
        storage.setItem(TRANSFER_CURRENCY, 'USD');
      }
      const { success, data } = yield call(services.getTransferCurrencies, {
        ...payload,
        baseLegalCurrency,
      });
      if (success) {
        if (typeof callback === 'function') callback(data);
      }
    },
    *pullOptionCurrencies({ payload }, { call, put }) {
      const user = payload.userInfo;
      const storageCurrency = storage.getItem(TRANSFER_CURRENCY);
      let baseLegalCurrency =
        storageCurrency && storageCurrency !== 'null' ? storageCurrency : 'USD';
      if (user && user.currency && user.currency !== 'null') {
        baseLegalCurrency = user.currency;
      } else if (baseLegalCurrency === 'CNY') {
        baseLegalCurrency = 'USD';
        storage.setItem(TRANSFER_CURRENCY, 'USD');
      }
      const { success, data } = yield call(services.getTransferCurrencies, {
        accountInfos: [{ 'accountType': 'OPTION' }],
        baseLegalCurrency,
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            optionCurrenciesSet: data.primary.OPTION.map((item) => item.currency),
          },
        });
      }
    },
    *transfer({ payload = {}, callback }, { call }) {
      const { successCallback, ...params } = payload;
      try {
        const { success } = yield call(services.transfer, params);
        if (success) {
          successCallback();
          if (typeof callback === 'function') {
            callback(success);
          }
          // 划转成功埋点
          track('transferRequest_results', {
            is_success: true,
            fail_reason: '',
            coin: payload?.currency,
            fromAccount: payload?.payAccountType,
            toAccount: payload?.recAccountType,
            channel: 'JS',
            batchTransfer: false,
            coinNumber: '1',
            t_version: '0.9',
          });
        }
      } catch (e) {
        // 划转失败埋点
        track('transferRequest_results', {
          is_success: false,
          fail_reason: e?.msg,
          fail_code: e?.code,
          coin: payload?.currency,
          fromAccount: payload?.payAccountType,
          toAccount: payload?.recAccountType,
          channel: 'JS',
          batchTransfer: false,
          coinNumber: '1',
          t_version: '0.9',
        });
        console.log('error', e);
        throw e;
      }
    },
    *batchTransfer({ payload = {}, callback }, { call }) {
      try {
        const { _t, successCallback, ...params } = payload;
        const { success, data = [] } = yield call(
          payload.subUserId ? services.subBatchTransfer : services.batchTransfer,
          params,
        );
        if (success) {
          const allSuccess = data.every((item) => item.result);
          if (allSuccess) {
            successCallback();
            // message.success(_t('operation.succeed'));
            // 划转成功埋点
            track('transferRequest_results', {
              is_success: true,
              fail_reason: '',
              coin: payload?.currencies?.map((item) => item.currency).join(),
              fromAccount: payload?.payAccountType,
              toAccount: payload?.recAccountType,
              channel: 'JS',
              batchTransfer: true,
              coinNumber: `${payload?.currencies?.length}`,
              t_version: '0.9',
            });
          }
          if (typeof callback === 'function') {
            callback(success, data);
          }
        }
      } catch (e) {
        // 划转失败埋点
        track('transferRequest_results', {
          is_success: false,
          fail_reason: e?.msg,
          fail_code: e?.code,
          coin: payload?.currencies?.map((item) => item.currency).join(),
          fromAccount: payload?.payAccountType,
          toAccount: payload?.recAccountType,
          channel: 'JS',
          batchTransfer: true,
          coinNumber: `${payload?.currencies?.length}`,
          t_version: '0.9',
        });
        console.log('error', e);
        throw e;
      }
    },
    *batchSupport({ payload = {} }, { call, put }) {
      try {
        const { success, data } = yield call(services.batchSupport, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              isSupportBatch: data,
            },
          });
        }
      } catch (e) {
        console.log('error', e);
      }
    },
    *pullIsolatedSymbols({ payload }, { call, put }) {
      const { user } = payload;
      const storageCurrency = storage.getItem('currency');
      let baseLegalCurrency =
        storageCurrency && storageCurrency !== 'null'
          ? storageCurrency
          : window._DEFAULT_RATE_CURRENCY_ || 'USD';
      if (user && user.currency && user.currency !== 'null') {
        baseLegalCurrency = user.currency;
      } else if (baseLegalCurrency === 'CNY') {
        baseLegalCurrency = 'USD';
        storage.setItem('currency', 'USD');
      }
      const { data } = yield call(services.getTransferIsolatedTags, {
        baseLegalCurrency,
      });

      yield put({
        type: 'update',
        payload: {
          isolatedSymbols: map(data, ({ symbol, symbolName, ...other }) => {
            return {
              symbol,
              value: symbol,
              label: symbolName.replace('-', '/'),
              ...other,
            };
          }),
        },
      });
    },
    *pullPositionStatusByTag({ payload = {} }, { call, put }) {
      const { tag } = payload;
      // 后端Ethan确认，查状态就用根据交易对查仓位的接口
      const { data } = yield call(services.getIsolatedAppoint, payload);
      yield put({
        type: 'updateTagMap',
        payload: {
          [tag]: {
            tag,
            status: data.status,
            isAutoRepay: data.isAutoRepay,
          },
        },
      });
    },
  },
};
