/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
// import { withLocale } from 'tools/i18n';

/*
  notice type:
    message.success
    message.info
    message.warn
    message.error
    message.loading
    message.toast
    notification.success
    notification.info
    notification.warn
    notification.error
    notification.open
 */
export default extend(base, {
  namespace: 'notice',
  state: {
    _publicMaxNoticeID: 0,
    publicNotice: [], // 公共消息列表
    openingGroupMap: {}, // 打开的notice的key分组， 以限制弹出个数
  },
  effects: {
    // 喂食
    /*
      {
        type: '' // 触发消息类型
        message: '', // 消息
        extra: {}, // 传递给消息组件的额外参数，服务端feed时不要传递函数等对象，否则状态到客户端会被序列化
        groupName: '', 需要限制弹出个数的notification组名
        maxCount: 2,  最大弹出数量
      }
    */
    *feed({ payload: { type, message, extra, groupName, maxCount } }, { select, put }) {
      if (!extra) {
        if (type.indexOf('message.') === 0) {
          extra = [];
        } else {
          extra = {};
        }
      }
      const { openingGroupMap } = yield select((state) => state.notice);
      // 如果当前打开的notification数量达到最大值，关闭掉时间上最早进入的notification
      if (groupName && typeof groupName === 'string' && type.indexOf('notification.') === 0) {
        const { _publicMaxNoticeID } = yield select((state) => state.notice);
        const group = openingGroupMap[groupName];

        maxCount = typeof maxCount === 'number' && maxCount > 0 ? maxCount : 2;
        extra.groupName = groupName;
        extra.key = extra.key || _publicMaxNoticeID + 1;
        // 当前弹出数量达到设定的峰值，新进入的消息把之前的第一条挤掉
        if (Array.isArray(group) && group.length === maxCount) {
          yield put({
            type: 'crowdOut',
            payload: {
              groupName,
            },
          });
        }

        yield put({
          type: 'newNotification',
          payload: {
            type,
            message,
            extra,
            groupName,
          },
        });
      } else {
        yield put({
          type: 'newNotice',
          payload: {
            type,
            message,
            extra,
          },
        });
      }
    },
  },
  reducers: {
    // 新开一个需要限制最大弹出数量的Notification
    newNotification(state, { payload: { type, message, extra, groupName } }) {
      const _publicMaxNoticeID = state._publicMaxNoticeID + 1;
      const group = state.openingGroupMap[groupName] || [];
      return {
        ...state,
        _publicMaxNoticeID,
        openingGroupMap: {
          ...state.openingGroupMap,
          [groupName]: [...group, extra.key],
        },
        publicNotice: [
          ...state.publicNotice,
          {
            type,
            message,
            extra: {
              duration: 4,
              placement: 'top-center',
              ...extra,
            },
            id: _publicMaxNoticeID,
          },
        ],
      };
    },
    // 新建一条普通notice
    newNotice(state, { payload: { type, message, extra } }) {
      const _publicMaxNoticeID = state._publicMaxNoticeID + 1;
      return {
        ...state,
        _publicMaxNoticeID,
        publicNotice: [
          ...state.publicNotice,
          {
            type,
            message,
            extra,
            id: _publicMaxNoticeID,
          },
        ],
      };
    },
    // 后来的挤掉最先弹出的
    crowdOut(state, { payload: { groupName } }) {
      const _publicMaxNoticeID = state._publicMaxNoticeID + 1;
      const group = state.openingGroupMap[groupName];
      const [targetKey, ...newGroup] = group;
      return {
        ...state,
        _publicMaxNoticeID,
        openingGroupMap: {
          ...state.openingGroupMap,
          [groupName]: newGroup,
        },
        publicNotice: [
          ...state.publicNotice,
          {
            id: _publicMaxNoticeID,
            type: 'notification.close',
            extra: {
              key: targetKey, // 被挤掉的key
            },
          },
        ],
      };
    },
    // 从openingKeys中删除某个key
    removeKeyInGroup(state, { payload: { groupName, key } }) {
      const group = state.openingGroupMap[groupName];
      const newGroup = group.filter((v) => v !== key);
      return {
        ...state,
        openingGroupMap: {
          ...state.openingGroupMap,
          [groupName]: newGroup,
        },
      };
    },
    // 消费
    consume(state, { payload: { ids = [] } }) {
      const { publicNotice } = state;
      const _list = publicNotice.filter((item) => _.indexOf(ids, item.id) === -1);

      return {
        ...state,
        publicNotice: _list,
      };
    },
  },
  subscriptions: {},
});
