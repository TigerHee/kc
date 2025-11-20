/**
 * Owner: willen@kupotech.com
 */
// import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
// import { checkValidations, verify } from 'services/security';
import { _t } from 'tools/i18n';
import * as airdropTRCServ from 'services/activity/airdropTRC';
import { message } from 'components/Toast';

const defaultPagination = {
  pageSize: 5,
  current: 1,
};
export default extend(base, polling, {
  namespace: 'airdropTRC',
  state: {
    rule: null,
    records: [],
    rewards: [],
    totalBalance: 0,
    rewardPagination: defaultPagination,
    fundPagination: defaultPagination,
  },
  effects: {
    *pullOperation({ payload = {} }, { call, put }) {
      const { items, currentPage, totalNum, pageSize } = yield call(
        airdropTRCServ.getOperationRecord,
        payload,
      );
      const fundPagination = {
        current: currentPage,
        total: totalNum,
        pageSize,
      };
      yield put({
        type: 'update',
        payload: {
          records: items,
          fundPagination,
        },
      });
    },
    *pullReward({ payload = {} }, { call, put }) {
      const { items, currentPage, totalNum, pageSize } = yield call(
        airdropTRCServ.getRewardRecord,
        payload,
      );
      const rewardPagination = {
        current: currentPage,
        total: totalNum,
        pageSize,
      };
      yield put({
        type: 'update',
        payload: {
          rewards: items,
          rewardPagination,
        },
      });
    },
    *pullBalance({ payload = {} }, { call, put }) {
      const { data } = yield call(airdropTRCServ.getTotalDeposit, payload);
      yield put({
        type: 'update',
        payload: {
          totalBalance: data,
        },
      });
    },
    *deposit({ payload = {} }, { call, put }) {
      yield call(airdropTRCServ.deposit, payload);
      yield put({
        type: 'afterSubmit',
      });
      message.success(_t('trxAirdrop.operate.success'));
    },
    *withdraw({ payload = {} }, { call, put }) {
      yield call(airdropTRCServ.withdraw, payload);
      yield put({
        type: 'afterSubmit',
      });
      message.success(_t('trxAirdrop.operate.success'));
    },
    *afterSubmit(a, { put }) {
      yield put({
        type: 'pullOperation',
        payload: {
          currentPage: defaultPagination.current,
          pageSize: defaultPagination.pageSize,
        },
      });
      yield put({
        type: 'pullBalance',
        payload: {
          currentPage: defaultPagination.current,
          pageSize: defaultPagination.pageSize,
        },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullOperation',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullReward',
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullBalance',
        },
      });
    },
  },
});
