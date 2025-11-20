/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { add, cryptoPwd, formatNumber } from 'helper';
import { getUserTotalBlance } from 'services/assets';
import * as SecurityService from 'services/security';
import { replace } from 'utils/router';
import storage from 'utils/storage';

export default extend(base, {
  namespace: 'utransfer',
  state: {
    NeedVerify: false,
    questions: [],
    totalBalance: 0,
  },
  effects: {
    *get_verify_type({ payload = {} }, { call, put }) {
      const { data } = yield call(SecurityService.checkValidations, { ...payload });
      if (data && data.length) {
        yield put({
          type: 'update',
          payload: {
            NeedVerify: true,
          },
        });
        yield put({
          type: 'get_question_list',
        });
      }
    },
    *get_question_list(a, { call, put }) {
      const { data } = yield call(SecurityService.getQuestionList);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            questions: data,
          },
        });
      }
    },
    *upgrade_password({ payload }, { call, put }) {
      const { withdrawPassword } = payload;
      yield call(SecurityService.upgradePassword, {
        withdrawPassword: cryptoPwd(withdrawPassword),
      });
      storage.setItem('finishUpgrade', true);
      yield put({
        type: 'user/pullUser',
      });
      replace('/account');
    },
    *verify_question({ payload }, { call }) {
      const result = yield call(SecurityService.verify, payload);
      return result;
    },
    *getUserTotalBalance(_, { put, call }) {
      const { data } = yield call(getUserTotalBlance, { baseCurrency: 'BTC' });
      const { mainModel, tradeModel } = data;
      const totalBalance = formatNumber(add(mainModel.totalBalance, tradeModel.totalBalance), 8);
      yield put({
        type: 'update',
        payload: {
          totalBalance,
        },
      });
    },
  },
});
