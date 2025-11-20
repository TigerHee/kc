/**
 * Owner: solar@kupotech.com
 */
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';
import filter from 'lodash/filter';
import every from 'lodash/every';
import { configMap } from '@transfer/config';
import { track } from '../utils/ga.js';
import * as services from '../services/index.js';
import { MODEL_NAMESPACE, DEFAULT_CURRENCY } from '../constants/index.js';
import { setNumToPrecision } from '../utils/number.js';

const initialState = {
  // from账户选中后的展示
  payAccountLabel: '',
  // pay账户选中后的展示
  recAccountLabel: '',
  // from账户可选择的，一级options(accountType)
  payAccountOptions: [],
  // from账户可选择的，二级options(tag)
  payAccountSubOptions: [],
  // to账户可选择的，一级options(accountType)
  recAccountOptions: [],
  // to账户可选择的，二级options(tag)
  recAccountSubOptions: [],
  // 可选择的币种下拉option
  currencies: [],
  // 该account该currency的允许转的币种
  total: 0,
  // 是否支持批量划转
  isSupportBatch: false,

  // 是否展示可转余额的loading
  totalLoading: false,
  // 批量划转的错误原因
  failReasons: [],
  // 下划线变量均不用做页面渲染，仅作为临时状态触发deps的回调，更新真正的状态
  // 当二级联动选中，第一级时触发，
  _payAccountType: null,
  _recAccountType: null,
  // 批量划转的开关是否打开
  isBatchEnable: false,
  // 表单是否有校验错误的项
  hasError: false,
  // 批量划转时，用户选中的keys
  selectedKeys: [],
  // 用户杠杆交易的自动还币配置
  isAutoRepay: false,
  // 是否穿仓
  isLiability: false,
  // 汇率
  prices: {},
  // 逐仓的仓位
  tagOptions: [],
  // 未开通账户列表
  notAllowedAccounts: [],
  // 选中币种的精度
  precision: 8,
  // 账户列表（获取该用户是否开通）
  multiAccounts: [],
  // 多账户是否展开
  multiAccountExpanded: false,
  // 根据账户类型查询余额
  multiAccountsAvailableMap: {},
  // 批量划转需要扣除的账户（按顺序）
  applySortedMultiAccounts: [],
  // 如果顺序扣款的alert出现，那么理财的alert就不出现了。
  deductionAlertShow: false,
};

let promise = null;
function getTransferIsolatedTags(...args) {
  if (!promise) {
    promise = services.getTransferIsolatedTags(...args);
  }
  return promise;
}

// 获取 币种列表 的配置
const getCurrenciesConfig = (payload) => {
  const { payAccountType } = payload;
  if (payAccountType === 'MULTI') {
    return {
      paramsFormat() {
        const { recAccountType, recTag, multiAccounts, baseLegalCurrency } = payload;
        const params = {
          payAccountInfos: multiAccounts
            // 批量划转不支持逐仓, 到账账户
            .filter((item) => !['ISOLATED', recAccountType].includes(item.accountType))
            .map((item) => ({
              accountType: item.accountType,
              accountTag: 'DEFAULT',
            })),
          recAccountType,
          baseLegalCurrency,
        };
        if (recAccountType === 'ISOLATED') {
          params.recAccountTag = recTag;
        }
        return params;
      },
      service: services.getCombineTransferCurrencies,
      resFormat: (data) => {
        return map(data, (_currency) => {
          const { iconUrl, currency, currencyName, availableBalance, precision } = _currency;
          return {
            icon: iconUrl,
            currency,
            currencyName,
            total: setNumToPrecision(availableBalance),
            precision,
          };
        });
      },
    };
  }
  return {
    paramsFormat() {
      const { payAccountType, recAccountType, payTag, recTag, baseLegalCurrency } = payload;
      const params = {
        payAccountType,
        recAccountType,
        baseLegalCurrency,
        transferType: 'INTERNAL',
      };
      if (payAccountType === 'ISOLATED') {
        params.payAccountTag = payTag;
      }
      if (recAccountType === 'ISOLATED') {
        params.recAccountTag = recTag;
      }
      return params;
    },
    service: services.getTransferCurrenciesV2,
    resFormat: (data) => {
      return map(data, (_currency) => {
        const { iconUrl, currency, currencyName, availableBalance, precision } = _currency;
        return {
          icon: iconUrl,
          currency,
          currencyName,
          total: availableBalance,
          precision,
        };
      });
    },
  };
};

// 获取 币种余额 的配置
const getAvaliableConfig = (payload) => {
  const { currency, accountType, toAccountType, tag, toAccountTag } = payload;
  if (accountType === 'MULTI') {
    return {
      paramsFormat({ accounts }) {
        return {
          payAccountInfos: accounts.map((accountType) => ({
            accountType,
            accountTag: 'DEFAULT',
          })),
          recAccountType: toAccountType,
          recAccountTag: toAccountTag || 'DEFAULT',
          currency,
        };
      },
      service: services.getCombineTransferBalance,
    };
  }
  return {
    paramsFormat() {
      return {
        currency,
        accountType,
        toAccountType,
        tag: tag || 'DEFAULT',
        toAccountTag: toAccountTag || 'DEFAULT',
      };
    },
    service: services.getTransferBalance,
  };
};

// 调用划转的配置
const getTransferApplyConfig = (payload) => {
  const { t, ...params } = payload;
  const { payAccountType, currency, recAccountType, recTag, amount } = params;
  if (payAccountType === 'MULTI') {
    return {
      paramsFormat({ accounts }) {
        return {
          payAccountInfos: accounts.map((accountType) => ({
            accountType,
            accountTag: 'DEFAULT',
          })),
          recAccountType,
          recAccountTag: recTag || 'DEFAULT',
          currency,
          amount,
        };
      },
      service: services.multiTransferApply,
      resFormat(res) {
        if (every(res.data, (item) => !item.result)) {
          res.success = false;
          res.msg = t('mAraJ2gc2okKWYLEyzfcaD');
          throw res;
        } else if (some(res.data, (item) => !item.result)) {
          const accounts = filter(res.data, (item) => item.result).map((item) =>
            t(configMap[item.accountType].i18nKey),
          );
          res.customMsg = t('kc_transfer_pro_success_tip', { '1_account': accounts.join(',') });
        }
        return res;
      },
    };
  }
  return {
    paramsFormat() {
      return params;
    },
    service: services.transferApply,
    resFormat(res) {
      return res;
    },
  };
};

export default {
  namespace: MODEL_NAMESPACE,
  state: initialState,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset() {
      promise = null;
      return initialState;
    },
  },
  effects: {
    pullCurrencies: [
      function*({ payload }, { call, put }) {
        let { baseLegalCurrency } = payload;
        // 兜底逻辑，抄的老的代码，在法币是 中国的 人民币 时，兼容为USD
        if (baseLegalCurrency === 'CNY') {
          baseLegalCurrency = 'USD';
        }
        const { paramsFormat, service, resFormat } = getCurrenciesConfig({
          ...payload,
          baseLegalCurrency,
        });
        try {
          const { data } = yield call(service, paramsFormat());
          const currencies = resFormat(data);
          yield put({
            type: 'update',
            payload: {
              currencies,
            },
          });
          return currencies;
        } catch {
          yield put({
            type: 'update',
            payload: {
              currencies: [],
            },
          });
          return [];
        }
      },
      { type: 'takeLatest' },
    ],

    pullAccountsAvailableByCurrency: [
      function*({ payload }, { call, put }) {
        try {
          // NOTE accountsAvailable目前只用在获取开通账户的集合，不使用余额，所以这里currency随便传入，暂时先取
          const { data } = yield call(services.getAvaliableByCurrency, {
            currency: DEFAULT_CURRENCY,
          });
          const multiAccounts = data.filter((item) => item.openStatus);

          yield put({
            type: 'update',
            payload: {
              multiAccounts,
            },
          });
          return multiAccounts;
        } catch {
          yield put({
            type: 'update',
            payload: {
              multiAccounts: [],
            },
          });
          return [];
        }
      },
      { type: 'takeLatest' },
    ],
    queryTransferAvailable: [
      function*({ payload }, { call, put, select }) {
        const { currency, tag, toAccountTag, toAccountType } = payload;
        if (tag && !tag.includes(currency)) {
          return;
        }
        if (toAccountTag && !toAccountTag.includes(currency)) {
          return;
        }
        const multiAccounts = yield select((state) => state[MODEL_NAMESPACE].multiAccounts);
        const accounts = multiAccounts
          .map((item) => item.accountType)
          .filter((item) => item !== 'ISOLATED')
          .filter((item) => item !== toAccountType);
        const { paramsFormat, service } = getAvaliableConfig(payload);
        try {
          yield put({
            type: 'update',
            payload: {
              totalLoading: true,
            },
          });
          const { success, data } = yield call(service, paramsFormat({ accounts }));
          if (success) {
            const payload = {
              total: data.availableBalance,
            };
            if (data.balanceList) {
              const multiAccountsAvailableMap = {};
              data.balanceList.forEach((item) => {
                multiAccountsAvailableMap[item.accountType] = item;
              });
              payload.multiAccountsAvailableMap = multiAccountsAvailableMap;
            }
            yield put({
              type: 'update',
              payload,
            });
          }
        } finally {
          yield put({
            type: 'update',
            payload: {
              totalLoading: false,
            },
          });
        }
      },
      { type: 'takeLatest' },
    ],
    queryIsolateTag: [
      function*({ payload }, { call, put, select }) {
        const { baseLegalCurrency, updateSubOptionsKey, oppositeTag } = payload;
        const tagOptions = yield select((state) => state[MODEL_NAMESPACE].tagOptions);
        if (!tagOptions.length) {
          const { success, data } = yield call(getTransferIsolatedTags, {
            baseLegalCurrency,
          });
          if (success) {
            yield put({
              type: 'update',
              payload: {
                tagOptions: data,
              },
            });
          }
        }
        if (oppositeTag) {
          const seletedCurrencies = oppositeTag.split('-');
          const _tagOptions = tagOptions
            .filter((option) =>
              [option.base.currency, option.quote.currency].some((currency) =>
                seletedCurrencies.includes(currency),
              ),
            )
            .filter((option) => option.symbol !== oppositeTag);
          yield put({
            type: 'update',
            payload: {
              [updateSubOptionsKey]: _tagOptions,
            },
          });
        } else {
          const _tagOptions = yield select((state) => state[MODEL_NAMESPACE].tagOptions);
          yield put({
            type: 'update',
            payload: {
              [updateSubOptionsKey]: _tagOptions,
            },
          });
        }
      },
      { type: 'takeLatest' },
    ],
    querySupportBatch: [
      function*({ payload }, { call, put }) {
        try {
          if (payload.payAccountType === 'MULTI') {
            yield put({
              type: 'update',
              payload: {
                isSupportBatch: false,
                notAllowedAccounts: [],
              },
            });
            return;
          }
          const { data } = yield call(services.querySupportBatchV2, {
            ...payload,
            transferType: 'INTERNAL',
          });
          yield put({
            type: 'update',
            payload: {
              isSupportBatch: data.supportBatch,
              notAllowedAccounts: [],
            },
          });
        } catch (err) {
          const { payAccountType, recAccountType } = payload;
          const notAllowedAccounts = [];
          if (['112021', '112023'].includes(err.code)) {
            notAllowedAccounts.push(payAccountType);
          }
          if (['112022', '112023'].includes(err.code)) {
            notAllowedAccounts.push(recAccountType);
          }
          yield put({
            type: 'update',
            payload: {
              notAllowedAccounts,
            },
          });
        }
      },
      { type: 'takeLatest' },
    ],
    transferApply: [
      function*({ payload }, { call, put, select }) {
        const accounts = yield select((state) => state[MODEL_NAMESPACE].applySortedMultiAccounts);
        const { paramsFormat, service, resFormat } = getTransferApplyConfig(payload);
        try {
          const res = yield call(service, paramsFormat({ accounts }));
          const { success } = resFormat(res);
          if (success) {
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
              t_version: '1.0',
            });
          }
          return res;
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
            t_version: '1.0',
          });
          throw e;
        }
      },
      { type: 'takeLatest' },
    ],
    transferBatchApply: [
      function*({ payload }, { call, put }) {
        try {
          const { success, data } = yield call(services.transferBatchApply, {
            ...payload,
          });
          // 可能是部分划转失败
          if (!success || data.some((item) => !item.result)) {
            return Promise.reject(data);
          }
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
            t_version: '1.0',
          });
          return Promise.resolve(data);
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
            t_version: '1.0',
          });
          throw e;
        }
      },
      { type: 'takeLatest' },
    ],
    queryUserMarginPosition: [
      function*(_, { call, put }) {
        const { success, data } = yield call(services.queryUserMarginPosition);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              isAutoRepay: data?.isAutoRepay || false,
              isLiability: data?.status === 'LIABILITY',
            },
          });
        }
        return data || {};
      },
      { type: 'takeLatest' },
    ],
    queryIsolatedPosition: [
      function*({ payload }, { call, put }) {
        const { success, data } = yield call(services.queryIsolatedPosition, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              isAutoRepay: data?.isAutoRepay || false,
              isLiability: data?.status === 'BANKRUPTCY',
            },
          });
        }
        return data || {};
      },
      { type: 'takeLatest' },
    ],
    getPrices: [
      function*({ payload }, { call, put, select }) {
        const prices = yield select((state) => state[MODEL_NAMESPACE].prices);
        if (!isEmpty(prices)) return;
        const { success, data } = yield call(services.getPrices, payload);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              prices: data,
            },
          });
        }
      },
      { type: 'takeLatest' },
    ],
  },
};
