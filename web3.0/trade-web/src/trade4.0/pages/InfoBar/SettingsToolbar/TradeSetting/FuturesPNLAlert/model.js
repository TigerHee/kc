/**
 * Owner: clyne@kupotech.com
 */
import extend from 'dva-model-extend';
import {
  setPnlAlert,
  setPnlAlertDetail,
  getPnlAlert,
  asyncPnlAlert,
  deletePnlAlertConfig,
  getPnlAlertList,
} from '@/services/futures';
import base from 'common/models/base';
import { namespace, defaultState } from './config';

export default extend(base, {
  namespace,
  state: defaultState,
  effects: {
    /**
     * 设置pnl alert开关
     */
    *pnlAlertSwitchUpdate({ payload }, { put, call }) {
      const { enable } = payload;
      const { success, msg } = yield call(setPnlAlert, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            pnlAlertState: enable,
          },
        });
      } else {
        //
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.error',
            message: msg,
          },
        });
      }
    },
    /**
     * 获取pnl alert 配置
     */
    *getPnlAlertConfig({ payload }, { put, call }) {
      const { success, msg, data } = yield call(getPnlAlert, payload);
      const ret = data || {};
      const status = ret.isEnable;
      if (success) {
        yield put({
          type: 'update',
          payload: {
            pnlAlertState: status,
            // pnlAlertList: items,
          },
        });
      } else {
        //
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.error',
            message: msg,
          },
        });
      }
    },

    // 获取列表值
    *getPnlAlertList({ payload }, { put, call }) {
      const { success, msg, data } = yield call(getPnlAlertList, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            pnlAlertList: data,
          },
        });
      } else {
        //
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.error',
            message: msg,
          },
        });
      }
    },

    *submitPnlAlertConfig({ payload }, { call }) {
      try {
        const ret = yield call(setPnlAlertDetail, payload);
        return ret;
      } catch (e) {
        return e;
      }
    },
    /**
     * async全部交易对
     */
    *asyncPnlAlert({ payload }, { call }) {
      try {
        const ret = yield call(asyncPnlAlert, payload);
        return ret;
      } catch (e) {
        return e;
      }
    },
    /**
     * 删除pnl alert配置
     */
    *deletePnlAlertConfig({ payload }, { call }) {
      try {
        const ret = yield call(deletePnlAlertConfig, payload);
        return ret;
      } catch (e) {
        return e;
      }
    },
  },
});
