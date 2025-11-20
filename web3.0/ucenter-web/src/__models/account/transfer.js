/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { map } from 'lodash';
import { getSubAccountList } from 'services/account';
import {
  // kumexTransferToMain,
  batchSupport,
  batchTransfer,
  getBatchAutoLendConf,
  getTransferBalance,
  getTransferCurrencies,
  getTransferIsolatedTags,
  subBatchTransfer,
  subInnerTransfer,
  subTransfer,
  transfer,
} from 'services/transfer';
import storage from 'src/utils/storage';
import { _t } from 'tools/i18n';
import { track } from 'utils/ga';

function getBaseLegalCurrency(user) {
  const storageCurrency = storage.getItem('currency');
  let baseLegalCurrency = storageCurrency || window._DEFAULT_RATE_CURRENCY_;
  if (user && user.currency && user.currency !== 'null') {
    baseLegalCurrency = user.currency;
  } else if (baseLegalCurrency === 'CNY') {
    baseLegalCurrency = window._DEFAULT_RATE_CURRENCY_;
    storage.setItem('currency', window._DEFAULT_RATE_CURRENCY_);
  }
  return baseLegalCurrency;
}

function formatIsolatedSymbols({ symbol, symbolName, ...other }) {
  return {
    symbol,
    value: symbol,
    label: symbolName.replace('-', '/'),
    ...other,
  };
}

export default extend(base, {
  namespace: 'transfer',
  state: {
    transferConfig: {
      visible: false,
      initDict: [],
      initCurrency: '',
      callback: null,
    },
    transferBalance: undefined,
    isSupportBatch: false,
    batchFailedCurrencies: null, // 批量划转失败交易对
    subBatchFailedCurrencies: null, //子账号批量划转失败交易对
    allSubAccount: [],
    isolatedSymbols: [], // 支持逐仓杠杆的交易对，排序后的
    mainIsolatedSymbols: [],
    subIsolatedSymbols: [],
    batchLendConfigMap: {},
  },
  effects: {
    *pullTransferBalance({ payload = {} }, { call }) {
      const res = yield call(getTransferBalance, {
        tag: 'DEFAULT',
        toAccountTag: 'DEFAULT',
        ...payload,
      });
      return res;
    },
    *pullAllSubAccount(a, { put, call }) {
      const { success, data } = yield call(getSubAccountList, {
        page: 1,
        size: 100,
      });
      if (success) {
        yield put({
          type: 'update',
          payload: {
            allSubAccount: data.items,
          },
        });
      }
    },
    *transfer({ payload = {}, callback }, { call, put }) {
      try {
        const { success } = yield call(transfer, payload);
        if (success) {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'message.success',
              message: _t('operation.succeed'),
            },
          });
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
        });
        throw e;
      }
    },
    // *kumexTransferToMain({ payload = {}, callback }, { call, put }) {
    //   const { success } = yield call(kumexTransferToMain, payload);
    //   if (success) {
    //     yield put({
    //       type: 'notice/feed',
    //       payload: {
    //         type: 'message.success',
    //         message: _t('operation.succeed'),
    //       },
    //     });
    //     if (typeof callback === 'function') {
    //       callback(success);
    //     }
    //   }
    // },
    *subTransfer({ payload = {}, callback }, { call, put }) {
      try {
        const { success } = yield call(subTransfer, payload);
        if (success) {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'message.success',
              message: _t('operation.succeed'),
            },
          });
          if (typeof callback === 'function') {
            callback(success);
          }
          // 子账号-划转成功埋点
          track('transferRequest_results', {
            is_success: true,
            fail_reason: '',
            coin: payload?.currency,
            direction: payload?.direction,
            accountType: payload?.accountType,
            subAccountType: payload?.subAccountType,
            channel: 'JS',
            batchTransfer: false,
            coinNumber: '1',
          });
        }
      } catch (e) {
        // 子账号-划转失败埋点
        track('transferRequest_results', {
          is_success: false,
          fail_reason: e?.msg,
          fail_code: e?.code,
          coin: payload?.currency,
          direction: payload?.direction,
          accountType: payload?.accountType,
          subAccountType: payload?.subAccountType,
          channel: 'JS',
          batchTransfer: false,
          coinNumber: '1',
        });
        throw e;
      }
    },
    *subInnerTransfer({ payload = {}, callback }, { call, put }) {
      const { success } = yield call(subInnerTransfer, payload);
      if (success) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('operation.succeed'),
          },
        });
        if (typeof callback === 'function') {
          callback(success);
        }
      }
    },
    *pullIsolatedSymbols({ payload = {} }, { call, put, select }) {
      const { user } = yield select((state) => state.user);
      const storageCurrency = storage.getItem('currency');
      let baseLegalCurrency = storageCurrency || window._DEFAULT_RATE_CURRENCY_;
      if (user && user.currency && user.currency !== 'null') {
        baseLegalCurrency = user.currency;
      } else if (baseLegalCurrency === 'CNY') {
        baseLegalCurrency = window._DEFAULT_RATE_CURRENCY_;
        storage.setItem('currency', window._DEFAULT_RATE_CURRENCY_);
      }
      const { data } = yield call(getTransferIsolatedTags, {
        ...payload,
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
    *batchSupport({ payload = {} }, { call, put }) {
      try {
        const { success, data } = yield call(batchSupport, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              isSupportBatch: data,
            },
          });
        }
      } catch (e) {}
    },
    *batchTransfer({ payload = {}, callback }, { call, put }) {
      try {
        const { success, data = [] } = yield call(
          payload.subUserId ? subBatchTransfer : batchTransfer,
          payload,
        );
        if (success) {
          const allSuccess = data.every((item) => item.result);
          if (allSuccess) {
            yield put({
              type: 'notice/feed',
              payload: {
                type: 'message.success',
                message: _t('operation.succeed'),
              },
            });

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
        });
        throw e;
      }
    },
    *pullMainIsolatedSymbols({ payload = {} }, { call, put, select }) {
      const { user } = yield select((state) => state.user);
      const baseLegalCurrency = getBaseLegalCurrency(user);
      const { data } = yield call(getTransferIsolatedTags, {
        ...payload,
        baseLegalCurrency,
      });

      yield put({
        type: 'update',
        payload: {
          mainIsolatedSymbols: map(data, formatIsolatedSymbols),
        },
      });
    },
    *pullSubIsolatedSymbols({ payload = {} }, { call, put, select }) {
      const { user } = yield select((state) => state.user);
      const baseLegalCurrency = getBaseLegalCurrency(user);
      const { data } = yield call(getTransferIsolatedTags, {
        ...payload,
        baseLegalCurrency,
      });

      yield put({
        type: 'update',
        payload: {
          subIsolatedSymbols: map(data, formatIsolatedSymbols),
        },
      });
    },
    *pullBatchLendConfg({ payload = {}, callback }, { call, put }) {
      try {
        const { success, data = [] } = yield call(getBatchAutoLendConf, payload);
        if (success) {
          const batchLendConfigMap = {};
          if (data && data.length) {
            data.forEach((conf) => {
              const { currency, isAutoLend } = conf;
              if (isAutoLend) {
                batchLendConfigMap[currency] = isAutoLend;
              }
            });
          }
          yield put({
            type: 'update',
            payload: {
              batchLendConfigMap,
            },
          });
        }
      } catch (e) {
        throw e;
      }
    },
    *pullTransferCurrencies({ payload = {}, callback }, { call, select }) {
      const { user } = yield select((state) => state.user);
      const storageCurrency = storage.getItem('currency');
      let baseLegalCurrency = storageCurrency || window._DEFAULT_RATE_CURRENCY_;
      if (user && user.currency && user.currency !== 'null') {
        baseLegalCurrency = user.currency;
      } else if (baseLegalCurrency === 'CNY') {
        baseLegalCurrency = window._DEFAULT_RATE_CURRENCY_;
        storage.setItem('currency', window._DEFAULT_RATE_CURRENCY_);
      }
      const { success, data } = yield call(getTransferCurrencies, {
        ...payload,
        baseLegalCurrency,
      });
      if (success) {
        if (typeof callback === 'function') callback(data);
      }
    },
  },
  reducers: {
    updateTransferConfig(state, action) {
      return {
        ...state,
        transferConfig: {
          ...state.transferConfig,
          ...action.payload,
        },
      };
    },
  },
});
