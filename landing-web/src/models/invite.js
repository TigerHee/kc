/**
 * Owner: terry@kupotech.com
 */
import extend from 'dva-model-extend';
import * as serv from 'services/invite';
import base from 'utils/common_models/base';

export default extend(base, {
  namespace: 'invite',
  state: {
    inviteCode: '', // 邀请码
    userInfo: {
      nickName: '',
    },
    activityInfo: {},
    broadcastList: [],
  },
  effects: {
    // 获取邀请码
    *getInviteCode(_, { call, put }) {
      const { data } = yield call(serv.getInvitationCode);
      yield put({
        type: 'update',
        payload: {
          inviteCode: data || '',
        },
      });
    },
    *getUserName({ payload }, { call, put }) {
      const { data } = yield call(serv.getUserName, payload);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            userInfo: {
              nickName: data,
            }
          }
        })
      }
    },
    *getActivityInfo({ payload }, { call, put }) {
      const { data } = yield call(serv.getActivityInfo, payload);
      if (data) yield put({
        type: 'update',
        payload: {
          activityInfo: data,
        }
      });
    },
    *getPrizeList({ payload }, { call, put }) {
      const { data } = yield call(serv.getPrizeList, payload);
      if (data) yield put({
        type: 'update',
        payload: {
          broadcastList: data,
        }
      });
    },
  },
});