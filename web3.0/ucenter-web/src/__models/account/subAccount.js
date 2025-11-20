/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import paginate from 'common/models/paginate';
import extend from 'dva-model-extend';
import { add, cryptoPwd } from 'helper';
import _ from 'lodash';
import {
  ACCOUNT_PERSONAL,
  SUB_ACCOUNT_TYPE_HOSTED,
  SUB_ACCOUNT_TYPE_NORMAL,
  SUB_ACCOUNT_TYPE_OES,
} from 'routes/AccountPage/SubAccount/config';
import * as serv from 'services/account';

const crypto = (str) => {
  return cryptoPwd(str);
};

const transformSubAsssets = (assetsList = []) => {
  const accountsMoney = {};
  let total = 0;
  let currency = '';
  _.forEach(assetsList, (v) => {
    if (!v.userId) v.userId = v.subUserId;
    accountsMoney[v.subName] = {
      ...v,
    };
    const {
      baseMainAmount = 0,
      baseTradeAmount = 0,
      baseMarginAmount = 0,
      baseIsolatedAmount = 0,
      baseTradeHFAmount = 0,
      baseOptionAmount = 0,
      baseFuturesAmount = 0,
    } = v || {};
    const cur = [
      baseMainAmount,
      baseTradeAmount,
      baseMarginAmount,
      baseIsolatedAmount,
      baseTradeHFAmount,
      baseOptionAmount,
      baseFuturesAmount,
    ].reduce((a, b) => add(a, b));
    total = cur.plus(total || 0).toFixed();
    currency = v.baseCurrency;
  });
  return {
    accountsMoney,
    totalAmount: total,
    baseCurrency: currency,
  };
};

// 添加子账号请求接口
const addSubAccountServiceMap = {
  [SUB_ACCOUNT_TYPE_NORMAL]: serv.createSubAccountGeneral,
  [SUB_ACCOUNT_TYPE_HOSTED]: serv.createSubAccountHosted,
  [SUB_ACCOUNT_TYPE_OES]: serv.createSubAccountHosted,
};

export default extend(base, paginate, {
  namespace: 'subAccount',
  state: {
    g2faKey: null,
    records: [],
    pagination: {
      pageSize: 20,
      current: 1,
      total: 0,
    },
    accountsMoney: {},
    subAccountsMoney: {},
    totalAmount: 0,
    hostedTotalAmount: 0,
    baseCurrency: '',
    keywords: '',
    hasLoadTotalAmount: false,
    subAccountTypeAmount: {},
    subAccountList: [],
    subAccountPosition: {
      hasMargin: false,
      hasFutures: false,
    },
    subAccountPermission: [],
    oesCustodyList: [], // 三方资金托管子账号绑定机构列表
    accountListType: ACCOUNT_PERSONAL, // 我的账户｜客户账户
    tradeTeamAccountData: {
      isTradeTeamAccount: false,
      applyingSubUserCount: 0,
    },
  },
  reducers: {
    updSearch(state, { payload }) {
      return {
        ...state,
        keywords: payload,
      };
    },
    resetCurSubAccount(state, { payload }) {
      return {
        ...state,
        subAccountPermission: [],
      };
    },
  },
  effects: {
    *getAccountList({ payload }, { call, put, select }) {
      try {
        const { balanceCurrency } = yield select((state) => state.user);
        const { page, refreshAmount = false, baseCurrency, baseAmount } = payload;
        const {
          pagination,
          keywords = '',
          hasLoadTotalAmount,
          accountListType,
          baseCurrency: preBaseCurrency,
        } = yield select((state) => state.subAccount);

        yield put({
          type: 'update',
          payload: {
            records: [],
          },
        });
        const data = yield call(serv.getSubAccountListWithAssets, {
          // ...pagination,
          // current: pagination.current,
          currentPage: page || pagination.current || 1,
          size: pagination.pageSize,
          keywords,
          filterRobot: true,
          balanceCurrency: baseCurrency || balanceCurrency || window._BASE_CURRENCY_,
          baseAmount,
          isParent: accountListType === ACCOUNT_PERSONAL,
        });
        // 进行数据整理，计算出每个子账号的数据
        const { accountsMoney, baseCurrency: _baseCurrency } = transformSubAsssets(
          data && data.items,
        );
        yield put({
          type: 'update',
          payload: {
            accountsMoney,
            subAccountsMoney: {},
            baseCurrency: _baseCurrency || preBaseCurrency,
          },
        });
        yield put({
          type: 'savePage',
          payload: data,
        });

        // 获取到baseCurrency后，请求totalAmount，获取子账号-子账号资产总计
        if (!hasLoadTotalAmount || refreshAmount) {
          yield put({
            type: 'getSubAccountTotalAssets',
            payload: {
              balanceCurrency: _baseCurrency || preBaseCurrency,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *submit({ payload = {}, subAccount }, { put }) {
      const { modal } = payload;
      let result = null;

      const nextEffectsMap = {
        addAccount: 'createSubAccountNew',
        modalStatus: 'freezeOrUnfreezeSubAccount',
        modifyMark: 'modifyRemark',
        modalTrans: 'fundTrans',
        modalResetPwd: 'resetPwdSubAccount',
        modalResetTradingPwd: 'resetTradingPwdSubAccount',
        modalReset2fa: 'reset2faSubAccount',
        resetPermission: 'updateSubAccountPermission',
      };
      result = yield put({
        type: nextEffectsMap[modal],
        payload,
        subAccount,
      });

      return result;
    },

    *resetPwdSubAccount({ payload, subAccount }, { call }) {
      const { values } = payload;
      const { password = '' } = values || {};
      const result = yield call(serv.resetPwdSubAccount, {
        subName: subAccount.subName,
        password: crypto(password),
      });
      return result;
    },

    *resetTradingPwdSubAccount({ payload, subAccount }, { call }) {
      const { values } = payload;
      const { password = '' } = values || {};
      const result = yield call(serv.resetTradingPwdSubAccount, {
        subName: subAccount.subName,
        password: crypto(password),
      });
      return result;
    },

    *reset2faSubAccount({ payload, subAccount }, { call }) {
      const { values } = payload;
      const result = yield call(serv.reset2faSubAccount, {
        ...values,
        subName: subAccount.subName,
      });
      return result;
    },

    *freezeOrUnfreezeSubAccount({ subAccount }, { call }) {
      const fn = subAccount.status === 2 ? 'freezeSubAccount' : 'unfreezeSubAccount';
      const result = yield call(serv[fn], subAccount.subName);
      return result;
    },
    *modifyRemark({ payload, subAccount }, { call, select }) {
      const { accountListType } = yield select((state) => state.subAccount);
      const { values } = payload;
      const isPersonal = accountListType === ACCOUNT_PERSONAL;
      const fn = isPersonal ? serv.modifySubAccountRemark : serv.tradeTeamsModifySubAccountRemark;

      const params = {
        subName: subAccount.subName,
        remarks: values.remarks,
        subUid: subAccount.uid,
      };

      const result = yield call(fn, params);
      return result;
    },
    // 已未使用 getSubAccountAmount
    *getSubAccountAmount({ payload }, { call, put, select }) {
      const { balanceCurrency } = yield select((state) => state.user);
      const { baseCurrency, baseAmount } = payload || {};
      const { data } = yield call(serv.getSubAccountAmount, {
        baseCurrency: baseCurrency || balanceCurrency || window._BASE_CURRENCY_,
        baseAmount,
      });
      // console.log('amount', amount);
      const accountsMoney = {};
      let total = 0;
      let currency = '';
      _.forEach(data, (v) => {
        if (v.robot) {
          return;
        }
        accountsMoney[v.subName] = {
          ...v,
        };
        const {
          baseMainAmount = 0,
          baseTradeAmount = 0,
          baseMarginAmount = 0,
          baseIsolatedAmount = 0,
          baseTradeHFAmount = 0,
          baseOptionAmount = 0,
          baseFuturesAmount = 0,
        } = v || {};
        const cur = [
          baseMainAmount,
          baseTradeAmount,
          baseMarginAmount,
          baseIsolatedAmount,
          baseTradeHFAmount,
          baseOptionAmount,
          baseFuturesAmount,
        ].reduce((a, b) => add(a, b));
        total = cur.plus(total || 0).toFixed();
        currency = v.baseCurrency;
      });
      yield put({
        type: 'update',
        payload: {
          accountsMoney,
          totalAmount: total,
          baseCurrency: currency || baseCurrency,
        },
      });
    },
    // 获取子账户的全部资产
    *getSubAccountTotalAssets({ payload = {} }, { call, put }) {
      try {
        const { data, success } = yield call(serv.getSubAccountsAsset, payload);
        const hostedRes = yield call(serv.getHostedSubAssets, payload);

        if (success) {
          const { subAsset } = data;
          yield put({
            type: 'update',
            payload: {
              totalAmount: subAsset?.totalAssets || 0,
              hostedTotalAmount: hostedRes?.data?.totalAssets || 0,
              hasLoadTotalAmount: true,
            },
          });
        }
      } catch (e) {
        console.error(e);
        yield put({
          type: 'update',
          payload: {
            hasLoadTotalAmount: true,
          },
        });
      }
    },
    *getSubAccountAmountDetail({ payload = {} }, { call, put, select }) {
      const { baseCurrency, baseAmount, subName } = payload || {};
      const { balanceCurrency } = yield select((state) => state.user);
      const { baseCurrency: stateBaseCurrency, accountsMoney: stateAccountsMoney } = yield select(
        (state) => state.subAccount,
      );
      // 先检查subName是否在stateAccountsMoney中，如果有数据，则设置subAccountsMoney = stateAccountsMoney
      // 否则请求接口
      if (stateAccountsMoney && stateAccountsMoney[subName]) {
        yield put({
          type: 'update',
          payload: {
            subAccountsMoney: stateAccountsMoney,
            baseCurrency:
              stateBaseCurrency || baseCurrency || balanceCurrency || window._BASE_CURRENCY_,
          },
        });
        yield put({
          type: 'user_assets/queryUserHasSubHighAccount',
          payload: {
            subUserId: stateAccountsMoney[subName]?.uid || '',
          },
        });
        return;
      }

      const params = {
        currentPage: 1,
        size: 50,
        keywords: subName,
        balanceCurrency: baseCurrency || balanceCurrency || window._BASE_CURRENCY_,
        baseAmount,
      };

      const data = yield call(serv.getSubAccountListWithAssets, {
        ...params,
        isParent: true,
      });
      const data2 = yield call(serv.getSubAccountListWithAssets, {
        ...params,
        isParent: false,
      });
      const itemList = [...(data?.items || []), ...(data2?.items || [])];
      // 进行数据整理，计算出每个子账号的数据
      const { accountsMoney, baseCurrency: _baseCurrency } = transformSubAsssets(itemList);

      yield put({
        type: 'update',
        payload: {
          subAccountsMoney: accountsMoney,
          baseCurrency: stateBaseCurrency || _baseCurrency,
        },
      });
      yield put({
        type: 'user_assets/queryUserHasSubHighAccount',
        payload: {
          subUserId: accountsMoney[subName]?.uid || '',
        },
      });
    },
    *getAccountBalancne(action, { call, put }) {
      const { data } = yield call(serv.queryMainAccount);

      yield put({
        type: 'update',
        payload: {
          categories: data,
        },
      });
    },
    *fundTrans({ payload }, { call }) {
      // const {} = payload;
      const params = { ...payload.values };
      // params.direction = params.direct === 1 ? 'IN' : 'OUT';
      params.direction = params.direct.direct;
      // params.accountType = params
      params.currency = params.coin;
      params.subUserId = params.account;
      const [from, to] = params.direct.ft;
      let transFnName = 'fundsTrans';
      if ([from, to].some((v) => v.indexOf('sub') === -1)) {
        // 母子划转
        params.accountType = 'MAIN';
        params.subAccountType = [from, to].indexOf('sub_trade') > -1 ? 'TRADE' : 'MAIN';
      } else {
        transFnName = 'subInnerTrans';
        params.payAccountType = from === 'sub_trade' ? 'TRADE' : 'MAIN';
        params.recAccountType = to === 'sub_trade' ? 'TRADE' : 'MAIN';

        // 子子划转
      }

      // console.log('params', params);
      ['coin', 'direct', 'account'].forEach((key) => {
        delete params[key];
      });

      // return;
      const result = yield call(serv[transFnName], params);
      // console.log('trans', result);
      return result;
    },
    *getSubAccountTypeAmount(action, { call, put }) {
      const { data } = yield call(serv.getSubAccountTypeAmount);

      yield put({
        type: 'update',
        payload: {
          subAccountTypeAmount: {
            ...data,
          },
        },
      });
    },
    *getOESCustodyList(action, { call, put }) {
      const { data } = yield call(serv.getOESCustodyList);

      yield put({
        type: 'update',
        payload: {
          oesCustodyList: data,
        },
      });
    },
    *createSubAccountNew({ payload }, { call, put }) {
      const { values } = payload;
      const { password = '' } = values || {};

      // 根据不同的子账号类型调用不同的接口
      const fn = addSubAccountServiceMap[values.type] ?? serv.createSubAccountGeneral;

      const result = yield call(fn, {
        ...values,
        password: crypto(password),
      });
      return result;
    },
    *updateSubAccountPermission({ payload }, { call, put }) {
      const { values } = payload;
      const result = yield call(serv.updateSubAccountPermission, values);
      return result;
    },
    *getSubAccountPosition({ payload }, { call, put }) {
      const { data, success } = yield call(serv.getSubAccountPosition, payload);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            subAccountPosition: data,
          },
        });
      }
      return success;
    },
    *getTradeTeamsInfo({ payload }, { call, put }) {
      const { data, success } = yield call(serv.getTradeTeamBindInfo);
      if (success) {
        const { hasHostedSubUser, applyingSubUserCount } = data || {};
        yield put({
          type: 'update',
          payload: {
            tradeTeamAccountData: {
              isTradeTeamAccount: hasHostedSubUser || applyingSubUserCount > 0,
              applyingSubUserCount,
            },
          },
        });
      }
    },
  },
  subscriptions: {},
});
