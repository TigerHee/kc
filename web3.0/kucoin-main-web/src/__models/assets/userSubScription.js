/**
 * Owner: willen@kupotech.com
 */
import { reduce, get, map } from 'lodash';
import { getSubScriptionList, subscribeNotice, unsubscribeNotice } from 'services/assets';

const listToMap = (...keys) => {
  return (list = []) => {
    return reduce(
      list || [],
      (total, current) => {
        const keyValue = map(keys, (key) => get(current, key)).join('-');
        if (keyValue) {
          total[keyValue] = current;
        }
        return total;
      },
      {},
    );
  };
};

const convertMap = {
  currencySubscriptionList: listToMap('currency'),
  chainSubscriptionList: listToMap('currency', 'chainId'),
};

export default {
  state: {
    currencySubscriptionList: [], // 币种订阅数据
    chainSubscriptionList: [], // 币链订阅数据
  },
  effects: {
    *resetSubscription({ payload: { category } = {} }, { put }) {
      if (!category) return;
      yield put({
        type: 'update',
        payload: {
          [category]: [],
        },
      });
    },
    *pullSubScriptionList({ payload }, { call, put }) {
      const { category, ...rest } = payload || {};
      if (!category) return;
      try {
        const { success, data } = yield call(getSubScriptionList, rest);
        if (!success) return;
        let newData = data;
        if (convertMap[category]) {
          newData = convertMap[category](newData || []);
        }
        yield put({
          type: 'update',
          payload: {
            [category]: newData,
          },
        });
      } catch (e) {
        yield put({
          type: 'resetSubscription',
          payload: {
            category,
          },
        });
      }
    },
    *userSubscribeNotice({ payload }, { call, put }) {
      const { subscribe, query } = payload || {};
      const { success } = yield call(subscribeNotice, subscribe);
      if (query && success) {
        yield put({
          type: 'pullSubScriptionList',
          payload: query,
        });
      }
      return success;
    },
    *userUnSubscribeNotice({ payload }, { call, put }) {
      const { subscribe, query } = payload || {};
      const { success } = yield call(unsubscribeNotice, subscribe);
      if (query && success) {
        yield put({
          type: 'pullSubScriptionList',
          payload: query,
        });
      }
      return success;
    },
  },
};
