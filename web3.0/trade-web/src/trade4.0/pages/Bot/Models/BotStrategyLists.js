/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getMachineLists } from 'Bot/services/machine';

export default extend(base, {
  namespace: 'BotStrategyLists',
  state: {
    strategyMap: {}, //  策略列表
    category: 'ALL',
  },
  effects: {
    // 获取策略列表的使用人数/年华
    *getStrategyLists(_, { call, put }) {
      try {
        const { data: lists } = yield call(getMachineLists);
        const obj = {};
        lists.forEach((el) => (obj[el.id] = el));
        yield put({
          type: 'update',
          payload: {
            strategyMap: obj,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  subscriptions: {},
});
