/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import * as Rank from 'Bot/services/rank';
import { isEmpty } from 'lodash';
import { fetchAction } from 'Bot/Module/BotLeaderBoard/constant';
import { formatDataForSubmit, objectToID } from 'Bot/Module/BotLeaderBoard/util';

export default extend(base, polling, {
  namespace: 'BotRank',
  state: {
    criteria: {}, // 排行榜过滤条件
    strategyCondition: {
      tab: 'hour24ProfitRate', // tab
      templateType: 'ALL', // 策略类型
      code: 'ALL', // 币种
      condition: {}, // 过滤的条件
    }, // 排行榜策略过滤条件
    rankStrategy: {
      // profitRateYear: dft
    }, // 放策略排行榜数据
    marketCondition: {
      tab: 'increase',
    }, // 排行榜行情过滤条件
    rankMarket: {
      increase: [],
    }, // 放行情排行榜数据
  },
  reducers: {
    // 合并strategyCondition
    updateStrategyCondition(state, { payload }) {
      return {
        ...state,
        strategyCondition: {
          ...state.strategyCondition,
          ...payload,
        },
      };
    },
    // 合并marketCondition
    updateMarketCondition(state, { payload }) {
      return {
        ...state,
        marketCondition: {
          ...state.marketCondition,
          ...payload,
        },
      };
    },
  },
  effects: {
    // 获取排行榜过滤条件
    *getCriteria({ payload }, { call, put, select }) {
      try {
        const oldCriteria = yield select((state) => state.BotRank.criteria);
        if (!isEmpty(oldCriteria)) {
          return oldCriteria;
        }

        const { data } = yield call(Rank.getCriteria);
        const { sortFields, criteria } = data;
        yield put({
          type: 'update',
          payload: {
            criteria,
          },
        });
      } catch (error) {
        console.error(error);

      }
    },
    // 获取策略维度列表
    *getStrategyRank({ payload }, { call, put, select }) {
      const filterData = payload.filterData;
      const type = payload.type;
      const submitData = formatDataForSubmit(filterData);
      const { uniqueKey } = objectToID(filterData);
      let oldData = yield select((state) => state.BotRank.rankStrategy);
      const rawOldData = oldData;
      oldData = oldData[uniqueKey];

      if (type === fetchAction.conditionChange) {
        if (!isEmpty(oldData)) {
          // do nothing
          return;
        }
      } else if (type === fetchAction.fetchMore && oldData.hasMore) {
        submitData.currentPage = !isEmpty(oldData) ? oldData.currentPage + 1 : 0;
      }
      submitData.currentPage = submitData.currentPage || 0;
      try {
        yield put({
          type: 'update',
          payload: {
            rankStrategy: {
              ...rawOldData,
              [uniqueKey]: {
                ...oldData,
                isLoading: true,
                hasData: true,
                hasMore: true,
              },
            },
          },
        });
        const data = yield call(Rank.getStrategyRank, submitData);
        // 再次获取上次的就数据，有可能因为快速切换tab导致发起两个请求
        let oldDataLatest = yield select((state) => state.BotRank.rankStrategy);
        oldDataLatest = oldDataLatest[uniqueKey];
        const oldItems = oldDataLatest?.items ?? [];
        const nowItems = oldItems.concat(data.items);
        const totalNum = Math.min(data.totalNum, 100);
        const backendMaxPage = 4;
        let hasMore = true;
        // 后端限制的最大页数
        if (data.currentPage >= backendMaxPage) {
          hasMore = false;
        } else if (isEmpty(data.items)) {
          hasMore = false;
        } else {
          hasMore = nowItems.length < totalNum;
        }

        yield put({
          type: 'update',
          payload: {
            rankStrategy: {
              ...rawOldData,
              [uniqueKey]: {
                isFirstLoading: false,
                isLoading: false,
                hasData: !isEmpty(nowItems),
                hasMore,
                currentPage: data.currentPage,
                items: nowItems,
              },
            },
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            rankStrategy: {
              ...rawOldData,
              [uniqueKey]: {
                items: [],
                isFirstLoading: false,
                isLoading: false,
                hasData: false,
                hasMore: false,
              },
            },
          },
        });
      }
    },
    // 获取币种维度列表
    *getCoinRank({ payload: { filterData, type } }, { call, put, select }) {
      try {
        const oldData = yield select((state) => state.BotRank.rankMarket);
        const { data } = yield call(Rank.getCoinRank, filterData.tab);
        yield put({
          type: 'update',
          payload: {
            rankMarket: {
              ...oldData,
              [filterData.tab]: data,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
