/**
 * Owner: iron@kupotech.com
 */
import { create } from 'zustand';
import createStoreProvider from 'tools/createStoreProvider';
import _ from 'lodash-es';

const defaultNoticeNoticeState = {
  _publicMaxNoticeID: 0,
  publicNotice: [] as any[], // 公共消息列表
  openingGroupMap: {}, // 打开的notice的key分组， 以限制弹出个数
  toastConfig: {},
};

interface NoticeNoticeActions {
  updateNoticeNotice: (params: Partial<NoticeNoticeState>) => void;
  feed: (params: { type: string; message: string; extra: any; groupName?: string; maxCount?: number }) => void;
  setToast: (payload: any) => void;
  crowdOut: (params: { groupName: string }) => void;
  newNotification: (params: { type: string; message: string; extra: any; groupName: string }) => void;
  newNotice: (params: { type: string; message: string; extra: any }) => void;
  removeKeyInGroup: (params: { groupName: string; key: string }) => void;
  consume: (params: { ids: number[] }) => void;
}

export type NoticeNoticeState = typeof defaultNoticeNoticeState;

export const createNoticeNoticeStore = (initState: Partial<NoticeNoticeState> = {}) => {
  return create<NoticeNoticeState & NoticeNoticeActions>()((set, get) => ({
    ...defaultNoticeNoticeState,
    ...initState,

    updateNoticeNotice: params => {
      set(params);
    },

    async feed({ type, message, extra, groupName, maxCount }) {
      if (!extra) {
        if (type.indexOf('message.') === 0) {
          extra = [];
        } else {
          extra = {};
        }
      }
      const { openingGroupMap } = get();
      // 如果当前打开的notification数量达到最大值，关闭掉时间上最早进入的notification
      if (groupName && typeof groupName === 'string' && type.indexOf('notification.') === 0) {
        const { _publicMaxNoticeID } = get();
        const group = openingGroupMap[groupName];

        maxCount = typeof maxCount === 'number' && maxCount > 0 ? maxCount : 2;
        extra.groupName = groupName;
        extra.key = extra.key || _publicMaxNoticeID + 1;
        // 当前弹出数量达到设定的峰值，新进入的消息把之前的第一条挤掉
        if (Array.isArray(group) && group.length === maxCount) {
          get().crowdOut({ groupName });
        }
        get().newNotification({ type, message, extra, groupName });
      } else {
        get().newNotice({ type, message, extra });
      }
    },

    setToast(payload) {
      const _toastConfig = {
        type: 'error', // info,warning,error
        duration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        open: true,
        ...payload,
      };
      set({
        toastConfig: _toastConfig,
      });
    },

    newNotification({ type, message, extra, groupName }) {
      const _publicMaxNoticeID = get()._publicMaxNoticeID + 1;
      const group = get().openingGroupMap[groupName] || [];
      set({
        _publicMaxNoticeID,
        openingGroupMap: {
          ...get().openingGroupMap,
          [groupName]: [...group, extra.key],
        },
        publicNotice: [
          ...get().publicNotice,
          {
            type,
            message,
            extra: {
              duration: 4,
              placement: 'bottomRight',
              ...extra,
            },
            id: _publicMaxNoticeID,
          },
        ],
      });
    },
    // 新建一条普通notice
    newNotice({ type, message, extra }) {
      const _publicMaxNoticeID = get()._publicMaxNoticeID + 1;
      set({
        _publicMaxNoticeID,
        publicNotice: [
          ...get().publicNotice,
          { type, message, extra, id: _publicMaxNoticeID },
        ],
      });
    },

    crowdOut({ groupName }) {
      const _publicMaxNoticeID = get()._publicMaxNoticeID + 1;
      const group = get().openingGroupMap[groupName];
      const [targetKey, ...newGroup] = group;
      set({
        _publicMaxNoticeID,
        openingGroupMap: {
          ...get().openingGroupMap,
          [groupName]: newGroup,
        },
        publicNotice: [
          ...get().publicNotice,
          {
            id: _publicMaxNoticeID,
            type: 'notification.close',
            extra: {
              key: targetKey, // 被挤掉的key
            },
          },
        ],
      });
    },

    removeKeyInGroup({ groupName, key }) {
      const group = get().openingGroupMap[groupName];
      const newGroup = group.filter((v) => v !== key);
      set({
        openingGroupMap: {
          ...get().openingGroupMap,
          [groupName]: newGroup,
        },
      });
    },

    // 消费
    consume({ ids = [] }) {
      const { publicNotice } = get();
      const _list = publicNotice.filter((item) => _.indexOf(ids, item.id) === -1);

      set({
        publicNotice: _list,
      });
    },
  }));
};

export const { StoreProvider: NoticeNoticeStoreProvider, useStoreValue: useNoticeNoticeStore } = createStoreProvider<
  NoticeNoticeState & NoticeNoticeActions
>('NoticeNoticeStore', createNoticeNoticeStore);
