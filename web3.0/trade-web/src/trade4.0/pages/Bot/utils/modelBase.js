/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { getRunningDetail } from 'Bot/services/running';
/**
 * @description: 策略通用逻辑
 */
const detailState = () => {
  return {
    opentotalNum: 0,
    stoptotalNum: 0,
    open: {
      // 当前状态数据
      totalNum: 0,
      items: [],
    },
    stop: {
      // 历史记录
      totalNum: 0,
      items: [],
    },
    runParams: {}, // 机器人参数
    CurrentLoading: true, // 当前状态loader
    HistoryLoading: true, // 历史记录loader
    ParamaterLoading: true, // 参数设置loader
    stopChart: { // 合约现货CTA历史委托图表用到
      noMore: false,
      hourKline: [],
      arbitrageInfo: [],
    },
  };
};
export default (strategyModel = {}) => {
  return extend(
    base,
    polling,
    {
      state: {
        ...detailState(),
      },
      reducers: {
        initFirstLoading(state) {
          return {
            ...state,
            ...detailState(),
          };
        },
      },
      effects: {
        // 获取机器人参数
        *getParameter({ payload: { id } }, { call, put }) {
          try {
            const { data: runParams } = yield call(getRunningDetail, id);
            yield put({
              type: 'update',
              payload: {
                ParamaterLoading: false,
                runParams: runParams ? JSON.parse(runParams) : {},
              },
            });
          } catch (error) {
            console.error(error);
          }
        },
      },
    },
    strategyModel,
  );
};
