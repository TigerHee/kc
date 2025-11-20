/**
 * Owner: garuda@kupotech.com
 * 存放保证金模式相关的字段
 */

import base from 'common/models/base';
import polling from 'common/models/polling';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import extend from 'dva-model-extend';
import { forEach, reduce } from 'lodash';

import storage from 'utils/storage';

import { ABC_MARGIN_MODE } from '@/components/AbnormalBack/constant';
import { MARGIN_MODE_OPENED_STORAGE_KEY, MARGIN_MODE_STORAGE_KEY } from '@/meta/futures';
import { getMarginModes, postMarginModeChange, getSwitchMarginModes } from '@/services/futures';
import { checkFuturesSocketTopic } from '@/utils/socket';

let getMarginModePolling = false;
const MARGIN_MODE_TOPIC = '/contract/marginMode';
export default extend(base, polling, {
  namespace: 'futuresMarginMode',
  state: {
    marginModeMap: storage.getItem(MARGIN_MODE_STORAGE_KEY) || {}, // 保证金模式
    // 账务模式， true占用模式，false表示冻结模式 ，灰度对接
    occupancyMode: storage.getItem(MARGIN_MODE_OPENED_STORAGE_KEY) || false,
    explainDialogVisible: false, // 解释弹框
    modeDialogVisible: false, // 仓位模式批量设置弹框
    switchMarginModes: [], // 批量切换列表
  },
  reducers: {
    updateMarginModes(state, { payload = {} }) {
      console.log('updates --->', payload);
      const updates = { ...state.marginModeMap, ...payload };
      storage.setItem(MARGIN_MODE_STORAGE_KEY, updates);
      return {
        ...state,
        marginModeMap: updates,
      };
    },
  },
  effects: {
    *getMarginModes({ payload }, { call, put }) {
      try {
        if (getMarginModePolling) return;
        getMarginModePolling = true;
        const symbol = payload?.symbol || 'ALL';
        const data = yield call(getMarginModes, { symbol });
        if (data.success) {
          let update = data.data;
          // 如果没值，需要清空下当前的状态
          if (!Object.keys(update)?.length) {
            update = { [payload?.symbol]: '' };
          }
          yield put({
            type: 'updateMarginModes',
            payload: update,
          });
          yield put({
            type: 'futuresCommon/updateCrossAbnormal',
            payload: {
              updateKey: ABC_MARGIN_MODE,
              status: true,
              locationId: '2',
            },
          });
        } else {
          yield put({
            type: 'futuresCommon/updateCrossAbnormal',
            payload: {
              updateKey: ABC_MARGIN_MODE,
              status: false,
              locationId: '2',
              error: data,
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_MARGIN_MODE,
            status: false,
            locationId: '2',
            error: e,
          },
        });
        throw e;
      } finally {
        getMarginModePolling = false;
      }
    },
    *postMarginModeChange({ payload }, { call }) {
      console.log('payload --->', payload);
      const { symbol, marginMode } = payload;
      let params = {};
      if (Array.isArray(symbol)) {
        forEach(symbol, (item) => {
          params[item] = marginMode;
        });
      } else {
        params = {
          [symbol]: marginMode,
        };
      }
      console.log('payload params --->', params);
      return yield call(postMarginModeChange, params);
    },
    // check margin mode 轮询
    *checkMarginModeSocket(__, { put }) {
      const checkFuturesTopic = yield checkFuturesSocketTopic({ topic: MARGIN_MODE_TOPIC });
      if (!checkFuturesTopic) {
        yield put({ type: 'getMarginModes' });
      }
    },
    *getSwitchMarginModes({ payload }, { call, put }) {
      const result = yield call(getSwitchMarginModes, payload);
      if (result?.data) {
        yield put({
          type: 'update',
          payload: {
            switchMarginModes: result.data,
          },
        });
      }
    },
  },
  subscriptions: {
    initLoop({ dispatch }) {
      // 10s
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'checkMarginModeSocket', interval: 10000 },
      });
    },
    initSocketTopicMessage({ dispatch }) {
      futuresWorkerSocket.topicFuturesMarginMode((data) => {
        const updateMap = reduce(
          data,
          (acc, item) => {
            forEach(item.data, (value, key) => {
              acc[key] = value;
            });
            return acc;
          },
          {},
        );
        dispatch({
          type: 'updateMarginModes',
          payload: updateMap,
        });
        dispatch({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_MARGIN_MODE,
            status: true,
            locationId: '2',
          },
        });
      });
    },
  },
});
