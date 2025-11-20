/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import moment from 'moment';
import { isFunction, findIndex } from 'lodash';
import * as serv from 'services/prediction';
import { getSymbolTick } from 'services/market';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';

import { PAGE_KEY } from 'components/$/Prediction/config';
import {
  formatDateSchedule,
  formatScheduleList,
  getScheduleIdBySearchUnix,
} from 'components/$/Prediction/selector';


export default extend(base, polling, {
  namespace: 'prediction',
  state: {
    currentPageKey: PAGE_KEY.HOME_PAGE,
    prePageKey: PAGE_KEY.HOME_PAGE, // Header的返回上一个页面的key, 默认返回首页
    activityConfig: {}, // 活动配置
    showTipDialog: false, // 是否展示提示型弹窗
    showTradeDialog: false, // 是否展示交易跳转弹窗
    dialogType: undefined, // 提示型弹窗类型
    searchUnix: undefined, // 查询时间戳
    todayStartUnix: undefined, // today开始时间戳
    checkedUnix: undefined, // 被选中的日期时间戳
    searchScheduleId: undefined, // 查询的竞猜Id
    scheduleList: [], // 竞猜模块数据列表
    currentRound: {}, // 当前场次数据
    currentRoundIndex: 0, // 当前场次Index
    guessRecord: {}, // 中奖信息
    userGuessInfo: {}, // 单场用户竞猜记录
    winnerInfo: {}, // 模块中奖用户
    inviteCode: '', // 邀请码
    showWinnerTipDialog: false, // 是否展示中奖提醒弹窗
    winnerTipInfo: { gotRes: false }, // 中奖弹窗数据
    showActivityEndDialog: false, // 是否展示活动已经结束弹窗
  },
  effects: {
    // 获取活动配置
    *getConfig(action, { call, put }) {
      try {
        const { success, data } = yield call(serv.getConfig);
        if (success) {
          const newData = formatDateSchedule({ ...data } || {});
          yield put({
            type: 'update',
            payload: { activityConfig: newData },
          });
        }
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
    // 根据日期搜索竞猜模块数据
    *searchByUnix({ payload, callback }, { call, put, select }) {
      const { searchUnix } = payload;
      const date = moment.utc(searchUnix).format('YYYY-MM-DD');
      // 判断查询时间
      try {
        const { activityConfig } = yield select(state => state.prediction);
        const { start, end } = activityConfig;
        const res = yield call(serv.getSchedulesByDate, { date });
        if (res.success) {
          const newData = formatScheduleList(res.data || []);
          const searchScheduleId = getScheduleIdBySearchUnix(searchUnix, newData, { start, end });
          yield put({
            type: 'update',
            payload: { scheduleList: newData, searchScheduleId },
          });
          isFunction(callback) && callback(res);
        }
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
    // 根据竞猜模块Id获取竞猜模块数据
    *getDataByScheduleId({ payload, callback }, { call, put, select }) {
      const { id } = payload;
      try {
        const res = yield call(serv.getDataByScheduleId, { id });
        const { success, data } = res;
        if (success) {
          const newData = formatDateSchedule({ ...data } || {});
          const { scheduleList } = yield select(state => state.prediction);
          const index = findIndex(scheduleList, i => i.id === id) || 0;
          let newScheduleList = [...scheduleList];
          // 每次根据竞猜模块Id获取竞猜模块数据 都要根据最新的now去对比时间 否则会导致进行中倒计时结束后跳转下一场次时 scheduleList 的数据没同步,存在两个进行中的数据
          newScheduleList = newScheduleList.map(i => {
            if (i.id === id) {
              return {
                ...i,
                ...newData,
              };
            } else {
              const notStart = newData?.now < i.start; // 活动是否整体开始
              const isEnd = newData?.now > i.end; // 活动是否整体结束
              const inProcessing = newData?.now <= i.end && newData?.now >= i.start; // 活动是否进行中
              return {
                ...i,
                notStart, // 活动是否整体开始
                isEnd, // 活动是否整体结束
                inProcessing, // 活动是否进行中
                now: newData?.now,
                nowText: newData?.nowText,
              };
            }
          });
          yield put({
            type: 'update',
            payload: {
              currentRound: newData,
              currentRoundIndex: index,
              scheduleList: newScheduleList,
            },
          });
          isFunction(callback) && callback(res);
        }
      } catch (error) {
        const { msg } = error || {};
        console.error('error MSG:', msg);
        isFunction(callback) && callback(error);
      }
    },
    // 提交号码
    *submitNumber({ payload, callback }, { call, put, select }) {
      try {
        const { id } = payload;
        const res = yield call(serv.submitNumber, payload);
        isFunction(callback) && callback(res);
        if (res?.success) {
          // 拉取最新的当前竞猜数据
          yield put({
            type: 'getDataByScheduleId',
            payload: { id },
          });
          // 拉取最新的竞猜号码列表数据
          yield put({
            type: 'pullUserGuessList',
            payload: { id, isEnd: false, notStart: false },
          });
        }
      } catch (error) {
        isFunction(callback) && callback(error);
        const { msg } = error || {};
        console.error('error MSG:', msg);
      }
    },
    *pullMarketInfo({ payload = { symbols: 'ETH-USDT' } }, { put, call }) {
      const { symbols } = payload;
      // sokect正常连接并且topic_state为1时，阻止此次fetch
      const ws = yield call(() => import('@kc/socket'));
      const socket = ws.getInstance();
      if (socket.connected()) {
        const topic = ws.Topic.get(ws.Topic.MARKET_SNAPSHOT, {
          SYMBOLS: [symbols],
        });
        const topicStateData = socket.constructor.TOPIC_STATE.SUBSCRIBED;
        if (socket) {
          const { topicState } = socket;
          if (topicState[topic] && topicState[topic][0] === topicStateData) {
            return;
          }
        }
      }
      const { data } = yield call(getSymbolTick, payload);
      if (data && data.length) {
        yield put({
          type: 'update',
          payload: {
            marketInfo: data[0],
          },
        });
      }
    },
    *updateSnapshot({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: { marketInfo: payload },
      });
    },
    *pullGuessRecord({ payload = {} }, { call, put, select }) {
      const { type, ...otherPayload } = payload;
      const { guessRecord } = yield select(state => state.prediction);
      const params = {
        currentPage: 1,
        pageSize: 10,
        ...otherPayload,
        ...(type ? { isWinning: true } : {}),
      };
      const { data } = yield call(serv.getGuessRecord, params);
      const { items = [], ...other } = data || {};
      const newItems =
        params.currentPage <= 1 ? items : [...(guessRecord[type]?.items || []), ...items];
      yield put({
        type: 'update',
        payload: {
          guessRecord: { [type]: { ...other, items: newItems } },
        },
      });
    },
    *pullUserGuessList({ payload = {} }, { call, put, select }) {
      const { id, isEnd, notStart } = payload;
      const { userGuessInfo } = yield select(state => state.prediction);
      if (userGuessInfo[id]?.isEnd || notStart) return;
      const res = yield call(serv.getUserGuessList, { id });
      const { submitted = false } = res?.data || {};
      const nextUserGuessInfo = {
        ...userGuessInfo,
        submitted,
        [id]: { isEnd, ...res.data },
      };
      yield put({
        type: 'update',
        payload: {
          userGuessInfo: nextUserGuessInfo,
        },
      });
    },
    // 获取中奖用户列表
    *getWinnerList({ payload = {} }, { call, put, select }) {
      const { winnerInfo } = yield select(state => state.prediction);
      const params = {
        currentPage: 1,
        pageSize: 10,
        ...payload,
      };
      const { data } = yield call(serv.getWinnerList, params);
      const { items = [] } = data || {};
      const newItems = params.currentPage === 1 ? items : [...winnerInfo.items, ...items];
      yield put({
        type: 'update',
        payload: {
          winnerInfo: {
            ...data,
            items: newItems,
          },
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
    // 获取中奖提醒弹窗数据
    *getWinnerTip(_, { call, put }) {
      const { data } = yield call(serv.getWinnerTip);
      yield put({
        type: 'update',
        payload: {
          winnerTipInfo: { ...data, gotRes: true } || { gotRes: true },
          showWinnerTipDialog: data?.pop || false,
        },
      });
    },
    // 关闭中奖提醒弹窗
    *closeWinnerTip({ payload, callback }, { call, put }) {
      const res = yield call(serv.closeWinnerTip, payload);
      isFunction(callback) && callback(res);
      yield put({
        type: 'update',
        payload: {
          winnerInfo: { gotRes: true },
          showWinnerTipDialog: false,
        },
      });
    },
  },
});
