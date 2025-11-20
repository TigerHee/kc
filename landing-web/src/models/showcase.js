/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import map from 'lodash/map';
import { _t }  from 'utils/lang';
import { getPublish, getUserHold, getUserVote, postVote, getTokenVote } from 'services/showcase';
import { SHOWCASE_STATUS } from 'config';
import { v4 as uuid } from 'uuid';
import Toast from 'components/Toast';
import router from 'umi/router';
import { compareVersion } from 'helper';
import JsBridge from 'utils/jsBridge';
import { LANDING_HOST } from 'utils/siteConfig';

export default extend(base, {
  namespace: 'showcase',
  state: {
    publishDetail: {},
    userLogin: false,
    kcsHolds: undefined,
    userVote: {},
    openLogin: false,
    finish: false,
    showcaseId: '',
    mobileBarY: 0,
    tokenVote: [],
    supportCookieLogin: true,
  },
  effects: {
    *init({ payload = {} }, { put, take, select }) {
      const { showcaseId } = yield select(state => state.showcase);
      yield put({ type: 'getPublish', payload: { id: payload.id || showcaseId } });
      yield take('getPublish/@@end');
      const { publishDetail } = yield select(state => state.showcase);
      yield put({ type: 'getUserHold', payload: { id: publishDetail.id } });
      yield put({ type: 'getUserVote', payload: { id: publishDetail.id } });
      return true;
    },
    *getPublish({ payload = {} }, { call, put, select }) {
      const isInApp = yield select(state => state.app.isInApp);
      const { data } = yield call(getPublish, payload);
      if (!data || data.status === 1 || (data.status === 2 && data.beginStatus === 0)) {
        if (isInApp) {
          JsBridge.open({
            type: 'jump',
            params: {
              url: `/link?url=${LANDING_HOST}/error`,
            }
          });
          return;
        }
        router.push('/error')
        return;
      };
      // data.status = 2;
      // data.beginStatus = 4;
      // data.voteEndAt = 1594894157345;
      // data.voteStartAt = 1603195200000;
      yield put({
        type: 'update',
        payload: {
          publishDetail: data,
          showcaseId: payload.id,
          finish: {
            [SHOWCASE_STATUS.PROCESSING]: false,
            [SHOWCASE_STATUS.END]: true,
          }[data.status]
        },
      });
    },
    *getUserHold({ payload = {} }, { call, put }) {
      const { items } = yield call(getUserHold, payload);
      if (!items) return;
      const kcsHolds = map(items, item => ({ ...item, key: uuid() }));
      yield put({
        type: 'update',
        payload: {
          userLogin: !!items,
          kcsHolds: kcsHolds,
        },
      });
    },
    *getUserVote({ payload = {} }, { call, put }) {
      const { data } = yield call(getUserVote, payload);
      if (!data) return;
      // data.voted = false;
      // data.userCount = 8;
      // data.new = true
      // data.tokenId = '5f02eace1fb9f00008169734';
      yield put({
        type: 'update',
        payload: {
          userLogin: !!data,
          userVote: data,
        },
      });
    },
    *postVote({ payload = {} }, { call, put }) {
      const { success } = yield call(postVote, payload);
      if (success) {
        yield put({ type: 'init' });
        return true;
      } else {
        Toast({
          type: 'error',
          msg: _t('choice.vote.toast.failed')
        })
      }
    },
    *getTokenVote({ payload = {} }, { call, put }) {
      const { items } = yield call(getTokenVote, payload);
      if (!items) return;
      yield put({
        type: 'update',
        payload: {
          tokenVote: items,
        },
      });
    },
    *needDrawerLogin({ payload = {} }, { put }) {
      // 判断当前App版本是否小于给定的App版本
      if (compareVersion(payload, '3.15.0') < 0) {
        yield put({
          type: 'update',
          payload: { supportCookieLogin: false }
        });
      }
    }
  },
  subscriptions: {
  },
  reducers: {
  },
});
