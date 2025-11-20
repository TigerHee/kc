/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { get } from 'lodash';
import * as services from 'services/legoActivityPage';
import base from 'utils/common_models/base';

/**
 * 运营活动模板-model
 */
export default extend(base, {
  namespace: 'legoActivityPage',
  state: {
    config: {}, // 活动配置
    supportLangs: [], // 活动支持的语言列表
    inviteCode: '',
    showUserLimitedDialog: false, // 显示活动限制弹窗
    newShareImg: undefined,  // newShareModal 使用的分享图
    newSharePictures: undefined, // newShareModal 使用的覆盖在分享图上的自定义文案dom生成的svg图片
    dialogConfig: {
      show: false,
      content: '',
    },
  },
  effects: {
    // 获取线上配置
    *getActivityConfig({ payload, online = false }, { call, put }) {
      const handler = online ? services.getOnlineActivityConfig : services.getPreviewActivityConfig;
      const res = yield call(handler, payload);
      // 状态码异常，或者活动没有subject，均认为访问页面不合法，跳转404
      if (res?.code === '110020' || !get(res, 'data.subject')) {
        return { code: '110020', success: false };
      }
      const data = get(res, 'data') || {};
      data.content = JSON.parse(data.content || '{}');
      yield put({
        type: 'update',
        payload: {
          config: data,
          supportLangs: [get(data, 'standardLang'),...get(data, 'langs', [])].filter(i => !!i),
          standardLang: get(data, 'standardLang'),
        },
      });
      return { success: true };
    },
    // 获取邀请码
    *getInviteCode({ payload } = {}, { call, put }) {
      const { isUseNewCode = false } = payload || {};
      if (isUseNewCode) {
        yield put({
          type: 'getNewInviteCode',
        })
        return;
      } else {
        const { data } = yield call(services.getInvitationCode);
        yield put({
          type: 'update',
          payload: {
            inviteCode: data || '',
          },
        });
      }
    },
    *getNewInviteCode(_, { call, put }) {
      const { data } = yield call(services.getNewInvitationCode);
      yield put({
        type: 'update',
        payload: {
          inviteCode: data || '',
        },
      });
    },
  },
});
