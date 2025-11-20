/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import { getRankData, getActivityData, isJoin, join } from 'src/services/nftActivity';


export default extend(base, polling, {
  namespace: 'nftActivity',
  state: {
    rankData: {
      records: [],
      totalPage: 0,
      isBit: null,
      bitNumber: null,
      assetSnapshot: null,
    },
    activityData: null,
    joinStatus: null,
    filter: {
      pageSize: 10,
      pageNo: 1,
    },
    rankLoading: false,
  },
  reducers: {},
  effects: {
    *getRankData({ payload = {} }, { select, call, put }) {
      yield put({
        type: 'update',
        payload: { rankLoading: true },
      });
      const { filter, rankData } = yield select(state => state.nftActivity);
      try {
        const params = {
          ...filter,
          ...payload
        };
        const { data } = yield call(getRankData, params);
        const { items, totalPage, isBit, bitNumber, updateTime, assetSnapshot } = data;
        yield put({
          type: 'update',
          payload: {
            rankLoading: false,
            filter: params,
            rankData: {
              totalPage,
              isBit,
              bitNumber,
              updateTime,
              assetSnapshot,
              records: items,
            },
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: { rankLoading: false, rankData: { ...rankData, records: [] } },
        });
      }
    },
    *getActivityData({ payload }, { call, put }) {
      const { data = {} } = yield call(getActivityData, payload);
      yield put({
        type: 'update',
        payload: { activityData: data },
      });
    },
    *getJoinStatus({ payload }, { call, put }) {
      const { data = {} } = yield call(isJoin, payload);
      yield put({
        type: 'update',
        payload: { joinStatus: data },
      });
    },
    *join({ payload }, { call, put }) {
      try {
        const { data } = yield call(join, payload);
        yield put({
          type: 'update',
          payload: { joinStatus: !!data },
        });
      } catch (e) {
        throw e;
      }
    },
  },
  subscriptions: {},
});
