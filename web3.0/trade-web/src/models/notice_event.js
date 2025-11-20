/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Jessie
 * @Date: 2019-07-05 10:54:41
 * @Description: ‘’
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import * as noticeEventService from 'services/notice_event';
import { toDateTs, evtEmitter } from 'helper';
import { delay } from 'utils/delay';
import workerSocket from 'common/utils/socketProcess';
import SUBJECT_CONFIG from 'services/workers/notice.subjects.conf';
import { isABNew } from '@/meta/const';
// import * as router from 'utils/router';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

const evtNoticeEvent = evtEmitter.getEvt('notice_event');


export default extend(base, {
  namespace: 'notice_event',
  state: {
    barVisible: false,
    count: 0, // 未读消息数
    hasMore: false,
    listMapArr: [], // [ { date: dateTs, list: [] }, ... ]
  },
  reducers: {
  },
  effects: {
    *fetch({ payload }, { put }) {
      yield put({ type: 'fetchList' });
    },
    *fetchList({ payload }, { put, call, select }) {
      const { user } = yield select(state => state.user);
      if (!user) return;

      const smallEvent = yield select((state) => {
        const _listMap = state.notice_event.listMapArr;
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

    *appendData({ payload: { append, fromWS, extra = {} } }, { put, select, call }) {
      const { listMapArr, count, barVisible } = yield select((state) => {
        return {
          listMapArr: state.notice_event.listMapArr,
          count: state.notice_event.count,
          barVisible: state.notice_event.barVisible,
        };
      });
      const _listMapArr = _.cloneDeep(listMapArr);

      let fetchPriceWarning = false;
      _.each(append, (item) => {
        const { sendTime, subject } = item;
        const dateTs = toDateTs(sendTime);

        let _foundDate = false;
        _.each(_listMapArr, ({ date, list }) => {
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
        if (subject === 'notification.risen.to' || subject === 'notification.fell.to') {
          fetchPriceWarning = true;
        }
      });

      if (fetchPriceWarning) {
        yield put({ type: 'priceWarn/pull' });
      }

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
          const _visible = yield select(state => state.notice_event.barVisible);
          if (!_visible) {
            const msg = append[i];
            const { subject } = msg;
            const config = SUBJECT_CONFIG[subject] || {};

            evtNoticeEvent.emit('notice_append', {
              msg,
              config,
            });
            // 4s一条，维持3条
            yield call(delay, 1333);
          }
        }
      }
    },
    *getCount({ payload }, { put, call }) {
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
          count: state.notice_event.count,
          listMapArr: state.notice_event.listMapArr,
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
            } else {
              return item;
            }
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
          count: state.notice_event.count,
          listMapArr: state.notice_event.listMapArr,
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
          listMapArr: listMapEditArr.filter(item => item.list.length > 0),
        },
      });
    },
  },
  subscriptions: {
    watchPageChange({ dispatch }) {
      // router.on('routeChangeStart', () => {
      //   dispatch({
      //     type: 'update',
      //     payload: {
      //       barVisible: false,
      //     },
      //   });
      // });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs || isABNew()) {
        return;
      }
      subscriptionWs = true;

      // {"data":{"display":"weak","context":{"symbol":"BTC/USDT","price":"32.000000","alertTime":1545814123563},"title":"价格预警","content":"BTC/USDT已涨至32.000000."},"subject":"notification.risen.to","id":"5c23406bcac4c16d849da2f0","sn":25946313590441,"type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      // {"data":{"display":"weak","context":{"symbol":"BTC/USDT","price":"323.000000","alertTime":1545814123123},"title":"价格预警","content":"BTC/USDT已涨至323.000000."},"subject":"notification.risen.to","id":"5c23406bca24c06d849da2ef","sn":25946313590442,"type":"message","userId":"5bbefbbd27f62b40dc1e8648"}
      const callbackMessages = (arr) => {
        // debugger;
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
          },
        });
      };

      // _.each(Object.keys(SUBJECT_CONFIG), (subject) => {
      //   (workerSocket[`noticeCenterMessage@${subject.replace(/[.-]/g, '')}`])((arr) => {
      //     window._x_topicTj('NOTICE_CENTER', subject, arr.length);
      //     callbackMessages(arr);
      //   });
      // });
      workerSocket.noticeCenterMessage((arr) => {
        window._x_topicTj('NOTICE_CENTER', '', arr.length);
        callbackMessages(arr);
      });
    },
  },
});
