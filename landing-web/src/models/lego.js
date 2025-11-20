/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { get, isEmpty } from 'lodash';
import {
  getConfig,
  getPreviewConfig,
  getInvitationCode,
  activityReg,
  getRegStatus,
} from 'services/lego';
import base from 'utils/common_models/base';

export default extend(base, {
  namespace: 'lego',
  state: {
    isAe: false,
    config: {},
    contents: [],
    translate: {},
    isReg: false,
    inviteCode: '',
    dialogConfig: {
      show: false,
      content: '',
    },
  },
  effects: {
    // 获取预览页配置
    *getPreviewConfig({ payload }, { call, put }) {
      try {
        const res = yield call(getPreviewConfig, payload);
        const { code = '', data } = res || {};
        const config = get(data, 'config', {});
        const contents = get(data, 'contents.content', []);
        const translate = get(data, 'translation', {});

        if (isEmpty(translate)) {
          console.error('preview translation isEmpty');
        }

        yield put({
          type: 'update',
          payload: {
            config,
            contents,
            translate,
          },
        });
        return code;
      } catch (error) {
        console.error(error || 'getPreviewConfig error');
        throw error;
      }
    },
    // 获取线上配置
    *getConfig({ payload }, { call, put }) {
      try {
        const res = yield call(getConfig, payload);
        const { code = '', data } = res || {};
        const config = get(data, 'config', {});
        const contents = get(data, 'contents.content', []);
        const translate = get(data, 'translation', {});

        if (isEmpty(translate)) {
          console.error('lego translation isEmpty');
        }

        yield put({
          type: 'update',
          payload: {
            config,
            contents,
            translate,
          },
        });
        return code;
      } catch (error) {
        console.error(error || 'getLegoConfig error');
        throw error;
      }
    },
    // 获取邀请码
    *getInviteCode(_, { call, put }) {
      const { data } = yield call(getInvitationCode);
      yield put({
        type: 'update',
        payload: {
          inviteCode: data || '',
        },
      });
    },
    // 活动报名
    *activityReg({ payload }, { call }) {
      const { data, code } = yield call(activityReg, payload);
      return {
        data,
        code,
      };
    },
    // 活动报名状态
    *getRegStatus({ payload }, { call, put }) {
      const { data } = yield call(getRegStatus, payload);
      yield put({
        type: 'update',
        payload: {
          isReg: data ? data : false,
        },
      });
    },
  },
});
