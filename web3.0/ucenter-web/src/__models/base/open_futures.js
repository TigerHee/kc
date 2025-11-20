/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import {
  agreeRisk,
  agreeUser,
  getOpenFuturesIsBonus,
  getOpenStatus,
  openUserContract,
  postGetOpenFuturesBonus,
} from 'services/openFutures';

// 开通合约用户没有绑定邮箱
const EMAIL_NOT_BIND = '500007';
// 受限制的国家跟地区
const AREA_LIMIT_CODE = '400010';

export default extend(base, {
  namespace: 'open_futures',
  state: {
    reqEmailVisible: false,
    isBonus: false,
    openFuturesVisible: false,
    openContract: undefined,
    // 开通合约dialog
    kumexOpenDialogVisible: false,
  },
  effects: {
    *openContract({ payload = {} }, { call, put }) {
      try {
        yield call(agreeRisk, { version: 1.0 });
        yield call(agreeUser, { version: 1.0 });
        yield call(openUserContract);

        yield put({
          type: 'update',
          payload: {
            openFuturesVisible: false,
            openContract: true,
            kumexOpenDialogVisible: false,
          },
        });
        if (payload.isBonus) {
          const { data } = yield call(postGetOpenFuturesBonus);
          if (data.rewards && data.hasRewards) {
            return data;
          }
          return false;
        }
        return false;
      } catch (e) {
        const { code } = e;
        if (code === EMAIL_NOT_BIND) {
          yield put({
            type: 'update',
            payload: {
              reqEmailVisible: true,
              openFuturesVisible: false,
              kumexOpenDialogVisible: false,
            },
          });
        } else {
          throw e;
        }
        if (code === AREA_LIMIT_CODE) {
          throw e;
        }
        return false;
      }
    },
    *getOpenFuturesIsBonus(action, { call, put, select }) {
      const user = yield select((state) => state.user.user);
      if (!user) return;
      const params = {
        isForOpen: false,
        userId: user.uid,
      };
      const { data } = yield call(getOpenFuturesIsBonus, params) || {};
      yield put({
        type: 'update',
        payload: {
          isBonus: data.hasRewards,
        },
      });
    },
    *getOpenStatus(action, { call, put, select }) {
      const user = yield select((state) => state.user.user);
      if (!user) return;
      const { data } = yield call(getOpenStatus) || {};
      yield put({
        type: 'update',
        payload: {
          openContract: data,
        },
      });
    },
    *getFuturesBonusStatus(action, { call, put, select }) {
      const user = yield select((state) => state.user.user);
      if (!user) return;
      const params = {
        isForOpen: false,
        userId: user.uid,
      };
      const { data } = yield call(getOpenFuturesIsBonus, params) || {};
      return data.hasRewards;
    },
    *initDialogNeedStatus(action, { call, put, select }) {
      const user = yield select((state) => state.user.user);
      if (!user) return;
      const { data } = yield call(getOpenStatus) || {};
      if (!data) {
        const params = {
          isForOpen: false,
          userId: user.uid,
        };
        const { data: bonusData } = yield call(getOpenFuturesIsBonus, params) || {};
        yield put({
          type: 'update',
          payload: {
            isBonus: bonusData.hasRewards,
            openContract: data,
          },
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            openContract: data,
          },
        });
      }
    },
  },
});
