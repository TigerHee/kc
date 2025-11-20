/**
 * Owner: solar@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import {
  transfer,
  subTransfer,
  subInnerTransfer,
  getTransferBalance,
  batchSupport,
  batchTransfer,
  subBatchTransfer,
  getTransferCurrencies,
  getTransferIsolatedTags,
  getBatchAutoLendConf,
} from 'services/transfer';
import { imputation } from 'services/assets';
import map from 'lodash/map';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import { ACCOUNT_CODE } from 'components/TransferModal/config';
import { getSubAccountList } from 'services/account';
import { _t } from 'tools/i18n';
import { track } from 'utils/ga';
import storage from 'src/utils/storage';
import { numSeparateDecimal } from 'helper';
import {
  ACCOUNT_NAME_MAP,
  ACCOUNT_WHOLE_NAME_MAP,
} from 'src/components/ConsolidationModal/constants';

export default extend(base, {
  namespace: 'transfer',
  state: {
    transferConfig: {
      visible: false,
      initDict: [],
      initCurrency: '',
      callback: null,
    },
    // 资金归集（在资产页涉及）
    consolidationConfig: {
      visible: false,
      currencies: [],
      // 当前的币种
      current: '',
      // 支持的账户类型
      supportAccountType: [],
      // 支持的逐仓币对，
      supportIsolatedSymbol: [],
      messageVisible: false,
      // 是否成功
      messageResult: true,
      message: '',
      // 用于归集重试，缓存入参
      imputateParamsCache: null,
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
    fromAccountTypeAvailable: {}, // 在资产归集中展示各账户可用余额
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
      const baseLegalCurrency = getBaseLegalCurrency(user);
      const { data } = yield call(getTransferIsolatedTags, {
        ...payload,
        baseLegalCurrency,
      });

      yield put({
        type: 'update',
        payload: {
          isolatedSymbols: map(data, formatIsolatedSymbols),
        },
      });
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
      let baseLegalCurrency =
        storageCurrency && storageCurrency !== 'null' ? storageCurrency : window._DEFAULT_RATE_CURRENCY_;
      if (user && user.currency && user.currency !== 'null') {
        baseLegalCurrency = user.currency;
      } else if (baseLegalCurrency === 'CNY') {
        baseLegalCurrency = 'USD';
        storage.setItem('currency', 'USD');
      }
      const { success, data } = yield call(getTransferCurrencies, {
        ...payload,
        baseLegalCurrency,
      });
      if (success) {
        if (typeof callback === 'function') callback(data);
      }
    },
    *pullAllTransferBalance({ payload = {} }, { call, select, put }) {
      const toAccountType = payload.toAccountType;
      const currency = payload.currency;
      const categories = yield select((state) => state.categories);
      const { precision } = categories[currency] || { precision: 8 };
      const isHFAccountExist = yield select((state) => state.user_assets.isHFAccountExist);
      const tradeMigrationProcess = yield select(
        (state) => state.user_assets.tradeMigrationProcess,
      );
      const isHFExist = isHFAccountExist && tradeMigrationProcess < 2;
      const fromAccountType = filter(ACCOUNT_CODE, function (value) {
        return value !== toAccountType;
        // 不支持逐仓把他过滤掉
      }).filter((value) => {
        if (value === ACCOUNT_CODE.ISOLATED) {
          return false;
        }
        if (value === ACCOUNT_CODE.TRADE_HF) {
          return isHFExist;
        }
        return true;
      });
      const res = {};
      for (let from of fromAccountType) {
        res[from] = 0;
        // 包裹批量函数调用、防止前一个接口出错，导致for循环无法继续
        try {
          const { data } = yield call(getTransferBalance, {
            tag: 'DEFAULT',
            toAccountTag: 'DEFAULT',
            currency,
            accountType: from,
            toAccountType: toAccountType,
          });
          res[from] = numSeparateDecimal(data?.availableBalance, precision);
        } catch {}
      }
      yield put({
        type: 'update',
        payload: {
          fromAccountTypeAvailable: res,
        },
      });
      return res;
    },
    *imputateAll({ payload = {} }, { call, select, put }) {
      let params;
      if (payload.reset) {
        params = yield select((state) => state.transfer.consolidationConfig.imputateParamsCache);
      } else {
        const payInfos = payload.payInfo;
        const recInfo = payload.recInfo;
        const currency = payload.currency;
        params = {
          currency,
          payInfo: payInfos,
          ...recInfo,
        };
        yield put({
          type: 'updateConsolidationConfig',
          payload: {
            imputateParamsCache: params,
          },
        });
      }
      const { data } = yield call(imputation, params);
      // 如果有一个result为false，既判定为失败
      const result = !data.some((rec) => !rec.result);
      const failReason = data.reduce((acu, item) => {
        if (item.result) return acu;
        return acu + `${item.accountType} ${item.failMsg};`;
      }, '');
      const fromAccount = params.payInfo.reduce((acu, item) => {
        return acu + item.payAccountType;
      }, '');
      // 归集埋点
      track('coinConsolidation', {
        currency: params.currency,
        result: result ? '全部成功' : '未全部成功（存在失败）',
        failReason,
        fromAccount,
        toAccount: params.recAccountType,
      });
      const accountList = data.reduce((acu, item, index, { length }) => {
        if (item.result) return acu;
        return acu + ACCOUNT_NAME_MAP[item.accountType] + (index === length - 1 ? '' : '、');
      }, '');
      yield put({
        type: 'updateConsolidationConfig',
        payload: {
          // 如果失败，弹窗不关闭
          visible: result ? false : true,
          messageVisible: true,
          messageResult: result,
          message: result
            ? _t('4UXt5ubyZvKt6asrkksX1r', {
                account: ACCOUNT_WHOLE_NAME_MAP[params.recAccountType],
                amount: payload.amount,
                coin: payload.currency,
              })
            : _t('oEmqrzi5knpjYRWg7r5LAd', {
                accountlist: accountList,
              }),
        },
      });
    },
    // 获取所有账户支持的币种、用作归集在选币时，下拉展示相应的账户
    *getAccountTypeSupportCurrencies({ payload = {} }, { call, select, put }) {
      const isHFAccountExist = yield select((state) => state.user_assets.isHFAccountExist);
      const tradeMigrationProcess = yield select(
        (state) => state.user_assets.tradeMigrationProcess,
      );
      // 判断高频是否展示
      const isHFShow = !!isHFAccountExist && tradeMigrationProcess < 2;
      const accountTypes = Object.values(ACCOUNT_CODE)
        .filter((value) => value !== 'ISOLATED')
        .filter((value) => {
          if (value === 'TRADE_HF' && !isHFShow) return false;
          return true;
        });
      const { success, data } = yield call(getTransferCurrencies, {
        accountInfos: accountTypes.map((accountType) => ({
          accountType,
        })),
        baseLegalCurrency: window._DEFAULT_RATE_CURRENCY_,
      });
      if (success) {
        // 转化为根据币种查询支持账户的map
        const currencyMap = {};
        forEach(data.primary, (value, key) => {
          forEach(value, (_value, _key) => {
            const { currency } = _value;
            if (currency in currencyMap) {
              currencyMap[currency].push(key);
            } else {
              currencyMap[currency] = [key];
            }
          });
        });
        return currencyMap;
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
    updateConsolidationConfig(state, action) {
      return {
        ...state,
        consolidationConfig: {
          ...state.consolidationConfig,
          ...action.payload,
        },
      };
    },
  },
});

function getBaseLegalCurrency(user) {
  const storageCurrency = storage.getItem('currency');
  let baseLegalCurrency = storageCurrency && storageCurrency !== 'null' ? storageCurrency : window._DEFAULT_RATE_CURRENCY_;
  if (user && user.currency && user.currency !== 'null') {
    baseLegalCurrency = user.currency;
  } else if (baseLegalCurrency === 'CNY') {
    baseLegalCurrency = 'USD';
    storage.setItem('currency', 'USD');
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
