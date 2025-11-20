/**
 * Owner: iron@kupotech.com
 */
import { create } from 'zustand';
import { cloneDeep, each, map, indexOf } from 'lodash-es';
import toDateTs from './utils/toDateTs';
import * as noticeEventService from './service';
import evtEmitter from './utils/evtEmitter';
import remoteEvent from 'tools/remoteEvent';
import { createStoreProvider } from 'tools';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

const evtNoticeEvent = evtEmitter.getEvt('notice_event_notice_center');

const RETRY_DELAY = 5000;

/**
 * 配置subject
 * UI相关配置在 src/components/Root/Header/NoticeBar/config.js
 * 新增通知subject需要同时在这两处添加配置
 */
const SUBJECT_CONFIG = {
  // 价格上涨预警通知 (BTC-USDT最近成交价高于设定价格后推送)
  'notification.risen.to': {},
  // 价格下跌预警通知 (BTC-USDT最近成交价低于设定价格后推送)
  'notification.fell.to': {},
  // 多端登录
  'notification.login': {},
  // 充值回滚 重新上账
  '1.payment.rollback_deposited': {},
  // 充值回滚 归还欠款
  '1.payment.rollback_pay_bill': {},
  // 充值回滚 发生回滚-不欠帐
  '1.payment.rollback_completed': {},
  // 充值回滚 发生回滚-欠帐
  '1.payment.rollback_completed_arrears': {},
  // 资产到账
  'notification.deposit': {},
  // 离线下载
  'notification.download': {},
  // 资产到账-旧地址
  'notification.deposit.old.address': {},
  // 系统公告
  'notice.custom': {},
  // 场外交易新订单
  'verification.notice.new.order': {},
  // 杠杆开通杠杆交易
  'notification.margin-enable-margin': {},
  // 杠杆爆仓预警
  'notification.margin-liquidation-alert': {},
  // 杠杆强平还款
  'notification.margin-liquidate-repay': {},
  // 杠杆穿仓
  'notification.margin-negative-balance': {},
  // 杠杆爆仓
  'notification.margin-liquidation': {},
  // // 取消订单
  'verification.notice.cancle.order': {},
  // 用户买币，已付款
  'verification.notice.buyer.payment': {},
  // 用户卖币，用户已放币
  'verification.notice.sellers.put.money': {},
  // 定向放贷
  'notification.target-lend-publish': {},
  // 杠杆代币: 申购成功
  'notification.margin-subscription-success': {},
  // 杠杆代币: 赎回成功
  'notification.margin-redemption-success': {},
  // 杠杆代币: 申购失败
  'notification.margin-subscription-failed': {},
  // 杠杆代币: 赎回失败
  'notification.margin-redemption-failed': {},
  // otc广告下架-买单
  'notification.otc.buy.ad.balance.limit': {},
  // otc广告下架-卖单
  'notification.otc.sell.ad.balance.limit': {},
  // 杠杆赠金发放
  'notification.margin-bonus.bonus-send': {},
  // 任务中心，注册成功-minica
  'platform.markting.newcomer.register': {},
  // 任务中心，注册成功3天内没有充值/入金行为-minica
  'platform.markting.deposit.advertisement': {},
  // 任务中心，累计充值满门槛值（接口传递）（只针对报名）报名之后，自动发奖的那一部分用户-minica
  'platform.markting.finish.accumulative.deposit': {},
  // 任务中心，提交提现申请-minica
  'platform.markting.withdraw.application': {},
  // 任务中心，提交提现申请-minica
  'platform.markting.withdraw.application.passed': {},
};

export interface NoticeCenterState {
  barVisible: boolean;
  count: number;
  hasMore: boolean;
  listMapArr: any[];
  userConditionInfo?: any;
  loading: boolean;
}

const defaultNoticeCenterState: NoticeCenterState = {
  barVisible: false,
  count: 0, // 未读消息数
  hasMore: false,
  listMapArr: [], // [ { date: dateTs, list: [] }, ... ]
  userConditionInfo: null,
  loading: false,
};

interface NoticeCenterActions {
  updateNoticeCenter: (params: Partial<NoticeCenterState>) => void;
  fetch: () => void;
  fetchList: () => Promise<void>;
  appendData: ({
    append,
    fromWS,
    triggerNoticeMsg,
    extra,
  }: {
    append: any[];
    fromWS?: boolean;
    triggerNoticeMsg?: any;
    extra?: any;
  }) => Promise<void>;
  getCount: () => Promise<void>;
  setRead: ({ eventIds, mark }: { eventIds?: string[]; mark?: boolean }) => Promise<void>;
  setDelete: ({ eventIds, mark }: { eventIds?: string[]; mark?: boolean }) => Promise<void>;
  pullUserKyc: () => Promise<void>;
  subscriptionWs: () => Promise<void>;
}

export const createNoticeCenterStore = (initState: Partial<NoticeCenterState> = {}) => {
  return create<NoticeCenterState & NoticeCenterActions>()((set, get) => ({
    ...defaultNoticeCenterState,
    ...initState,

    updateNoticeCenter: params => {
      set(params);
    },

    fetch() {
      get().fetchList();
    },

    async fetchList() {
      set({ loading: true });
      const _listMap = get().listMapArr as { list: any[] }[];
      const latestDay = _listMap[_listMap.length - 1];
      let smallEvent;
      if (latestDay) {
        const _list = latestDay.list;
        smallEvent = _list[_list.length - 1];
      } else {
        smallEvent = undefined;
      }

      const beginSn = smallEvent ? smallEvent.sendTime : undefined;
      const { data } = await noticeEventService.pullEvents({
        beginSn,
        isReverse: true,
      });

      const { hasMore, letterList: onlineEventResponseList } = data;
      await get().appendData({
        append: onlineEventResponseList,
        extra: {
          hasMore,
        },
      });
      set({ loading: false });
    },

    async appendData({ append, fromWS, triggerNoticeMsg, extra = {} }) {
      const { listMapArr, count, barVisible } = get();
      const _listMapArr = cloneDeep(listMapArr);

      each(append, item => {
        const { sendTime } = item;
        const dateTs = toDateTs(sendTime);

        let _foundDate = false;
        each(_listMapArr, ({ date, list }) => {
          if (date === dateTs) {
            _foundDate = true;

            const _find = list.filter(m => m.sendTime === item.sendTime);
            if (!_find.length) {
              list.push(item);
              list.sort((a, b) => {
                return b.sendTime - a.sendTime;
              });
            }
            return false;
          }
        });
        if (!_foundDate) {
          _listMapArr.push({
            date: dateTs,
            list: [item],
          });
        }
      });

      _listMapArr.sort((a, b) => {
        return b.date - a.date;
      });

      if (fromWS) {
        extra.count = count + append.length;
      } else {
        get().getCount();
      }

      set({
        ...extra,
        listMapArr: _listMapArr,
      });

      // list未展示时，弹窗
      if (fromWS && !barVisible) {
        for (let i = 0; i < append.length; i++) {
          const _visible = get().barVisible;
          if (!_visible) {
            const msg = append[i];
            const { subject } = msg;
            const config = SUBJECT_CONFIG[subject] || {};
            evtNoticeEvent.emit('notice_append', {
              msg,
              config,
              triggerNoticeMsg,
            });
            // 4s一条，维持3条
            await new Promise(resolve => setTimeout(resolve, 1333));
          }
        }
      }
    },
    async getCount() {
      const { data } = await noticeEventService.getUnreadCount();
      const { count } = data || {};
      set({
        count: +count || 0,
      });
    },
    async setRead({ eventIds, mark }) {
      await noticeEventService.setRead({ eventIds, mark });
      const _eventIds = eventIds || [];
      const { count, listMapArr } = get();
      let _c = 0;
      const listMapEditArr = map(listMapArr, ({ date, list }) => {
        return {
          date,
          list: map(list, item => {
            if (mark || indexOf(_eventIds, item.id) > -1) {
              if (!item.read) {
                _c += 1;
              }

              return {
                ...item,
                read: true,
              };
            }
            return item;
          }),
        };
      });

      const _count = count - _c;
      set({
        count: _count < 0 ? 0 : _count,
        listMapArr: listMapEditArr,
      });
    },
    async setDelete({ eventIds, mark = false }) {
      await noticeEventService.setDelete({ eventIds, mark });
      const _eventIds = eventIds || [];
      const { count, listMapArr } = get();

      let _c = 0;
      const listMapEditArr = map(listMapArr, ({ date, list }) => {
        const _list: any[] = [];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (!(mark || indexOf(_eventIds, item.id) > -1)) {
            _list.push(item);
          } else if (!item.read) {
            _c += 1;
          }
        }

        return {
          date,
          list: _list,
        };
      });

      const _count = count - _c;
      set({
        count: _count < 0 ? 0 : _count,
        listMapArr: listMapEditArr.filter(item => item.list.length > 0),
      });
    },
    async pullUserKyc() {
      try {
        const { data } = await noticeEventService.getUserKyc();
        set({
          userConditionInfo: data,
        });
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        get().pullUserKyc();
      }
    },

    async subscriptionWs() {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      // {"data":{"display":"weak","context":{"symbol":"BTC/USDT","price":"32.000000","alertTime":1545814123563},"title":"价格预警","content":"BTC/USDT已涨至32.000000."},"subject":"notification.risen.to","id":"5c23406bcac4c16d849da2f0","sn":25946313590441,"type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      // {"data":{"display":"weak","context":{"symbol":"BTC/USDT","price":"323.000000","alertTime":1545814123123},"title":"价格预警","content":"BTC/USDT已涨至323.000000."},"subject":"notification.risen.to","id":"5c23406bca24c06d849da2ef","sn":25946313590442,"type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      const callbackMessages = (arr: any[], triggerNoticeMsg = false) => {
        const _data = map(arr, (item: any) => {
          const res = {
            ...item.data,
            ...item,
            read: false,
          };
          delete res.userId;
          return res;
        });
        get().appendData({
          fromWS: true,
          append: _data,
          triggerNoticeMsg,
        });
      };
      remoteEvent.emit(remoteEvent.evts.GET_SOCKET, (socket, Topic) => {
        socket.topicNotice(Topic.NOTICE_CENTER, '', true)(callbackMessages);
      });
      remoteEvent.emit(remoteEvent.evts.GET_NOTICE_MSG, callbackMessages);
    },
  }));
};

export const { StoreProvider: NoticeCenterStoreProvider, useStoreValue: useNoticeCenterStore } = createStoreProvider<
  NoticeCenterState & NoticeCenterActions
>('NoticeCenterStore', createNoticeCenterStore);
