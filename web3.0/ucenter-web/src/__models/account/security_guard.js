/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { pullCacheSecurityScore, pullSecurityScore } from 'services/security';

const IS_IN_APP = JsBridge.isApp();

const pullResultOnApp = () =>
  new Promise((resolve, reject) => {
    JsBridge.open(
      {
        type: 'func',
        params: { name: 'fetchSafeGuardData' },
      },
      (res) => {
        console.log('【security guard】pull result on app:', res);
        res.code === 0 ? resolve(res) : reject(res);
      },
    );
  });

export default extend(base, {
  namespace: 'securityGuard',
  state: {
    result: {
      level: null,
      score: null,
      methods: null,
    },
    cacheResult: {
      level: null,
    },
  },
  effects: {
    *pullResult({ payload = {} }, { put, call }) {
      const { data = {} } = yield call(IS_IN_APP ? pullResultOnApp : pullSecurityScore, payload);
      yield put({ type: 'update', payload: { result: data } });
    },
    *pullCacheResult(_, { put, call }) {
      const { data } = yield call(pullCacheSecurityScore);
      const { userSecurityLevel } = data ?? {};
      yield put({ type: 'update', payload: { cacheResult: { level: userSecurityLevel } } });
    },
  },
});
