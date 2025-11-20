/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import remoteEvent from '@tools/remoteEvent';
import base from './models/base';
import * as noticeEventService from './service';
import toDateTs from './utils/toDateTs';
import evtEmitter from './utils/evtEmitter';
import { delay } from './utils/delay';

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

export default extend(base, {
  namespace: 'notice_event_notice_center',
  state: {
    barVisible: false,
    count: 0, // 未读消息数
    hasMore: false,
    listMapArr: [], // [ { date: dateTs, list: [] }, ... ]
    userConditionInfo: null,
  },
  reducers: {},
  effects: {
    *fetch(action, { put }) {
      yield put({ type: 'fetchList' });
    },
    *fetchList(action, { put, call, select }) {
      const smallEvent = yield select((state) => {
        const _listMap = state.notice_event_notice_center.listMapArr;
        const latestDay = _listMap[_listMap.length - 1];

        let eventLast;
        if (latestDay) {
          const _list = latestDay.list;
          eventLast = _list[_list.length - 1];
        } else {
          eventLast = undefined;
        }

        return eventLast;
      });

      const beginSn = smallEvent ? smallEvent.sendTime : undefined;
      const { data } = yield call(noticeEventService.pullEvents, {
        beginSn,
        isReverse: true,
      });

      const { hasMore, letterList: onlineEventResponseList } = data;

      yield put({
        type: 'appendData',
        payload: {
          append: onlineEventResponseList,
          extra: {
            hasMore,
          },
        },
      });
    },

    *appendData(
      { payload: { append, fromWS, triggerNoticeMsg, extra = {} } },
      { put, select, call },
    ) {
      const { listMapArr, count, barVisible } = yield select((state) => {
        return {
          listMapArr: state.notice_event_notice_center.listMapArr,
          count: state.notice_event_notice_center.count,
          barVisible: state.notice_event_notice_center.barVisible,
        };
      });
      const _listMapArr = _.cloneDeep(listMapArr);

      _.each(append, (item) => {
        const { sendTime } = item;
        const dateTs = toDateTs(sendTime);

        let _foundDate = false;
        _.each(_listMapArr, ({ date, list }) => {
          if (date === dateTs) {
            _foundDate = true;

            const _find = list.filter((m) => m.sendTime === item.sendTime);
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
        yield put({ type: 'getCount' });
      }

      yield put({
        type: 'update',
        payload: {
          ...extra,
          listMapArr: _listMapArr,
        },
      });

      // list未展示时，弹窗
      if (fromWS && !barVisible) {
        for (let i = 0; i < append.length; i++) {
          const _visible = yield select((state) => state.notice_event_notice_center.barVisible);
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
            yield call(delay, 1333);
          }
        }
      }
    },
    *getCount(action, { put, call }) {
      const { data } = yield call(noticeEventService.getUnreadCount);
      const { count } = data || {};
      yield put({
        type: 'update',
        payload: {
          count: +count || 0,
        },
      });
    },
    *setRead({ payload: { eventIds, mark } }, { put, call, select }) {
      yield call(noticeEventService.setRead, { eventIds, mark });
      const _eventIds = eventIds || [];
      const { count, listMapArr } = yield select((state) => {
        return {
          count: state.notice_event_notice_center.count,
          listMapArr: state.notice_event_notice_center.listMapArr,
        };
      });
      let _c = 0;
      const listMapEditArr = _.map(listMapArr, ({ date, list }) => {
        return {
          date,
          list: _.map(list, (item) => {
            if (mark || _.indexOf(_eventIds, item.id) > -1) {
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
      yield put({
        type: 'update',
        payload: {
          count: _count < 0 ? 0 : _count,
          listMapArr: listMapEditArr,
        },
      });
    },
    *setDelete({ payload: { eventIds, mark } }, { put, call, select }) {
      yield call(noticeEventService.setDelete, { eventIds, mark });
      const _eventIds = eventIds || [];
      const { count, listMapArr } = yield select((state) => {
        return {
          count: state.notice_event_notice_center.count,
          listMapArr: state.notice_event_notice_center.listMapArr,
        };
      });

      let _c = 0;
      const listMapEditArr = _.map(listMapArr, ({ date, list }) => {
        const _list = [];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (!(mark || _.indexOf(_eventIds, item.id) > -1)) {
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
      yield put({
        type: 'update',
        payload: {
          count: _count < 0 ? 0 : _count,
          listMapArr: listMapEditArr.filter((item) => item.list.length > 0),
        },
      });
    },
    *pullUserKyc(__, { call, put }) {
      try {
        const { data } = yield call(noticeEventService.getUserKyc);
        yield put({
          type: 'update',
          payload: {
            userConditionInfo: data,
          },
        });
      } catch (e) {
        yield call(delay, RETRY_DELAY);
        yield put({ type: 'pullUserKyc' });
      }
    },
  },
  subscriptions: {
    watchPageChange({ dispatch, history }) {
      return history.listen(() => {
        dispatch({
          type: 'update',
          payload: {
            barVisible: false,
          },
        });
      });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      // {"data":{"display":"weak","context":{"symbol":"BTC/USDT","price":"32.000000","alertTime":1545814123563},"title":"价格预警","content":"BTC/USDT已涨至32.000000."},"subject":"notification.risen.to","id":"5c23406bcac4c16d849da2f0","sn":25946313590441,"type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      // {"data":{"display":"weak","context":{"symbol":"BTC/USDT","price":"323.000000","alertTime":1545814123123},"title":"价格预警","content":"BTC/USDT已涨至323.000000."},"subject":"notification.risen.to","id":"5c23406bca24c06d849da2ef","sn":25946313590442,"type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      const callbackMessages = (arr, triggerNoticeMsg = false) => {
        const _data = _.map(arr, (item) => {
          const res = {
            ...item.data,
            ...item,
            read: false,
          };
          delete res.userId;
          return res;
        });

        dispatch({
          type: 'appendData',
          payload: {
            fromWS: true,
            append: _data,
            triggerNoticeMsg,
          },
        });
      };
      remoteEvent.emit(remoteEvent.evts.GET_SOCKET, (socket, Topic) => {
        socket.topicNotice(Topic.NOTICE_CENTER, '', true)(callbackMessages);
      });

      remoteEvent.emit(remoteEvent.evts.GET_NOTICE_MSG, callbackMessages);
    },
  },
});
