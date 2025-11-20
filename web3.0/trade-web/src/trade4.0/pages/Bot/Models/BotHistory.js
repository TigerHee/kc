/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getHistoryLists } from 'Bot/services/history';
import _ from 'lodash';
import { _t } from 'Bot/utils/lang';
import { strasMap } from 'Bot/config';

export default extend(base, polling, {
  namespace: 'BotHistory',
  state: {
    lists: [], // 历史记录列表
    botType: null, // 机器人策略类型，默认null全部，1/2/3 等
    startTime: null, // 机器人订单开始时间，时间戳
    endTime: null, // 机器人订单结束时间，时间戳
    isFirstRunning: false,
  },
  effects: {
    // 获取历史列表
    *getHistoryLists({ payload }, { call, put, select }) {
      try {
        const { botType, startTime, endTime } = yield select(state => state.BotHistory);
        // 入参添加策略类型/开始时间/结束时间的筛选字段
        const params = {
          ...(botType && { types: botType }),
          ...(startTime && { start: startTime }),
          ...(endTime && { end: endTime }),
        };
        const { data } = yield call(getHistoryLists, params);
        // 因接口较慢，当前请求的类型参数与最新类型参数不同，则丢弃
        const { botType: newBotType } = yield select(state => state.BotHistory);
        if ((!params.types && newBotType) || (params.types && params.types !== newBotType)) {
          return;
        }

        let effective = data?.pageData;
        effective = effective.map((el) => {
          if (!el.name) {
            el.name = _t(strasMap.get(el.type)?.lang);
          }
          return el;
        });
        yield put({
          type: 'update',
          payload: {
            lists: effective,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  subscriptions: {},
});
