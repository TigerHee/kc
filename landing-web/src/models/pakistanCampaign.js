/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import * as serv from 'services/luckydrawTurkey';
import base from 'utils/common_models/base';

export default extend(base, {
  namespace: 'pakistanCampaign',
  state: {
    config: {},
    isReg: false,
    inviteCode: '',
  },
  effects: {
    // 获取活动配置
    *getConfig({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.getActivityConfig, payload);
        yield put({
          type: 'update',
          payload: {
            config: data || {},
          },
        });
      } catch (e) {
        const { msg } = e || {};
        console.error('msg', msg);
      }
    },
    // 活动报名
    *activityReg({ payload }, { call }) {
      const { data } = yield call(serv.activityReg, payload);
      return {
        data,
      };
    },
    // 活动报名状态
    *getRegStatus({ payload }, { call, put }) {
      const { data } = yield call(serv.getRegStatus, payload);
      yield put({
        type: 'update',
        payload: {
          isReg: data ? data : false,
        },
      });
    },
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
  },
  subscriptions: {},
});
