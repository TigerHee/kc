/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import filter from 'common/models/filter';
import * as serv from 'services/activity/activity';

export default extend(base, filter, {
  namespace: 'activity',
  state: {
    filters: {
      id: '',
    },
    pageData: null,
    competition: null,
    airDrop: null,
    vote: null,
    universal: null,
    list: null,
  },
  effects: {
    *query(_, { put, select }) {
      const { filters } = yield select((state) => state.activity);
      yield put({
        type: 'pullPage',
        payload: {
          ...filters,
        },
      });
    },
    *pullPage({ payload }, { call, put }) {
      const { data } = yield call(serv.pullPage, payload);
      yield put({
        type: 'update',
        payload: {
          pageData: {
            ...data,
          },
        },
      });
    },
    *pullCompetiton({ payload: { code, type } }, { call, put }) {
      const { data } = yield call(serv.pullActivity, { type, campaignId: code });
      yield put({
        type: 'update',
        payload: {
          competition: {
            ...data,
          },
        },
      });
    },
    *pullAirDrop({ payload: { code, type } }, { call, put }) {
      const { data } = yield call(serv.pullActivity, { type, campaignId: code });
      yield put({
        type: 'update',
        payload: {
          airDrop: {
            ...data,
          },
        },
      });
    },
    *pullVote({ payload: { code, type } }, { call, put }) {
      const { data } = yield call(serv.pullActivity, { type, campaignId: code });
      yield put({
        type: 'update',
        payload: {
          vote: {
            ...data,
          },
        },
      });
    },
    *pullUniversal({ payload: { code, type } }, { call, put }) {
      const { data } = yield call(serv.pullActivity, { type, campaignId: code });
      yield put({
        type: 'update',
        payload: {
          universal: {
            ...data,
          },
        },
      });
    },
    *joinCompetition({ payload: { code } }, { call }) {
      yield call(serv.joinCompetition, { campaignId: code, channel: 'web' });
    },
    *getCompetionRank({ payload: { code } }, { call }) {
      const { data } = yield call(serv.getCompetionRank, { campaignId: code });
      return data;
    },
    *getMyRank({ payload: { code } }, { call }) {
      const { data } = yield call(serv.getMyRank, { campaignId: code });
      return data;
    },
    *getReward({ payload: { code, type } }, { call }) {
      const { data } = yield call(serv.getReward, { type, campaignId: code });
      return data;
    },
    *addVote({ payload }, { call }) {
      const { success } = yield call(serv.addVote, payload);
      return success;
    },
    *pullActivityList({ payload: { page, pageSize } }, { put, call }) {
      const {
        data: { items },
      } = yield call(serv.getActivityList, { page, pageSize });
      yield put({
        type: 'update',
        payload: {
          list: items || [],
        },
      });
    },
  },
});
