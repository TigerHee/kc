/**
 * Owner: gavin.liu1@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import * as services from 'services/referFriend';
import { toastError } from 'components/$/ReferFriends/Toast';

export default extend(base, {
  namespace: 'referFriend',
  state: {
    referInfo: {},
    getPlatformAssist: '',
    // assistRecords: {},
    assistList: [],
    notHasMoreAssistList: false, // 用于无限列表
    awardRecords: {},
    gift: {},
    curModalId: '',
    invitationCode: '',
    userByRcode: {},
  },
  effects: {
    *reportEntry({ payload }, { call, put }) {
      try {
        const res = yield call(services.reportEntry, payload);
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        return data || {};
      } catch (error) {
        console.error('reportEntry api error:', error);
        toastError(error);
      }
    },
    *getReferInfo({ payload }, { call, put }) {
      try {
        const res = yield call(services.getReferInfo, { ...payload, ts: Date.now() });
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        yield put({
          type: 'update',
          payload: {
            referInfo: data || {},
          },
        });
        return data || {};
      } catch (error) {
        console.error('getReferInfo api error:', error);
        toastError(error);
      }
    },
    *userByRcode({ payload }, { call, put }) {
      try {
        const res = yield call(services.userByRcode, { ...payload, ts: Date.now() });
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        yield put({
          type: 'update',
          payload: {
            userByRcode: data || {},
          },
        });
        return data || {};
      } catch (error) {
        console.error('userByRcode api error:', error);
        toastError(error);
      }
    },
    *userAssist({ payload }, { call, put }) {
      try {
        const res = yield call(services.userAssist, payload);
        return res;
      } catch (error) {
        console.error('userAssist api error:', error);
        toastError(error);
        return error;
      }
    },
    *invitationCode({ payload }, { call, put }) {
      try {
        const res = yield call(services.invitationCode, { ...payload, ts: Date.now() });
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        yield put({
          type: 'update',
          payload: {
            invitationCode: data || '',
          },
        });
        return data || {};
      } catch (error) {
        console.error('invitationCode api error:', error);
        toastError(error);
      }
    },
    *getPlatformAssist({ payload }, { call, put }) {
      try {
        const res = yield call(services.getPlatformAssist, payload);
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        yield put({
          type: 'update',
          payload: {
            getPlatformAssist: data || '',
          },
        });
        return data || '0';
      } catch (error) {
        console.error('getPlatformAssist api error:', error);
        toastError(error);
      }
    },
    *getAssistRecords({ payload }, { call, put, select }) {
      try {
        const { loadMore = false, ...params } = payload
        const res = yield call(services.getAssistRecords, { ...params, ts: Date.now() });
        const { code = '', items = [] } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        const pageSize = params?.pageSize || 10
        if (items?.length < pageSize) {
          yield put({
            type: 'update',
            payload: {
              notHasMoreAssistList: true,
            },
          });
        }
        if (loadMore) {
          const { assistList = [] } = yield select(state => state.referFriend);
          yield put({
            type: 'update',
            payload: {
              assistList: [...assistList, ...items],
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              assistList: items || [],
            },
          });
        }
        return items || [];
      } catch (error) {
        console.error('getAssistRecords api error:', error);
        toastError(error);
      }
    },
    *getAwardRecords({ payload }, { call, put }) {
      try {
        const res = yield call(services.getAwardRecords, { ...payload, ts: Date.now() });
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        yield put({
          type: 'update',
          payload: {
            awardRecords: res || {},
          },
        });
        return data || {};
      } catch (error) {
        console.error('getAwardRecords api error:', error);
        toastError(error);
      }
    },
    *supportFriend({ payload }, { call, put }) {
      try {
        const res = yield call(services.supportFriend, payload);
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        return data || {};
      } catch (error) {
        console.error('supportFriend api error:', error);
        toastError(error);
      }
    },
    *getGift({ payload }, { call, put }) {
      try {
        const res = yield call(services.getGift, payload);
        const { code = '', data } = res || {};
        if (String(code) !== '200') {
          toastError(code);
          return;
        }
        yield put({
          type: 'update',
          payload: {
            gift: data || {},
          },
        });
        return data || {};
      } catch (error) {
        console.error('getGift api error:', error);
        toastError(error);
      }
    },
  },
});
