/**
 * Owner: Owen.guo@kupotech.com
 */
/*
 * @Author: Owen.guo
 * @Date: 2023-04-11 11:15:09
 * @Description: collectionSensorsStore 神策apm监控上报交易体感指标实例仓库
 * @Wiki:https://wiki.kupotech.com/pages/viewpage.action?pageId=114017511
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';

export default extend(base, {
  namespace: 'collectionSensorsStore',
  state: {
    sensorsInstance: {}, // duration 实例
    swFrequency: {}, // sw数据刷新频率
  },
  effects: {
    *collectDuration({ payload = {} }, { select, put }) {
      yield put({
        type: 'update',
        payload: {
          sensorsInstance: payload,
        },
      });
    },
    *collectSwFrequency({ payload = {} }, { select, put }) {
      yield put({
        type: 'update',
        payload: {
          swFrequency: payload,
        },
      });
    },
    *clearSwFrequency({ payload = {} }, { select, put }) {
      yield put({
        type: 'update',
        payload: {
          swFrequency: {},
        },
      });
    },
  },
  subscriptions: {},
});
