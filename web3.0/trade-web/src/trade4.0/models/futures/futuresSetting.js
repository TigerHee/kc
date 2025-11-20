/**
 * Owner: charles.yang@kupotech.com
 * 该 models 存储合约偏好设置的东西
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { sortBy, isObject } from 'lodash';
import polling from 'common/models/polling';

import {
  ORDER_CONFIRM_CHECKED,
  ORDER_DATA_SAVE_CHECKED,
  CHECK_RISK_LIMIT_ORDER,
  CONFIRM_DIALOG_EVENT_KEY,
} from '@/meta/futures';
import {
  ALL_NOTICE_CONFIRM_KEY,
  WEB_NOTICE_CONFIG,
  ALL_DIALOG_CONFIRM_KEY,
  CONFIRM_CONFIG,
} from '@/pages/InfoBar/SettingsToolbar/TradeSetting/futuresConfig';
import storage from 'utils/storage';
import { _t } from 'utils/lang';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import {
  getRiskLimits,
  getUserRiskLimit,
  postChangeRiskLimit,
  setNoticePreferences,
  getSymbolDetail,
} from '@/services/futures';
import { evtEmitter } from 'helper';

const event = evtEmitter.getEvt();

export default extend(base, polling, {
  namespace: 'futuresSetting',
  state: {
    riskLimits: [],
    userRiskLimit: {}, // 合约用户风险限额
    webNoticeConfig: [],
    confirmConfig: [],
    autoDeposit: false,
    // 风险限额弹窗显示
    onlyRiskLimitChangeVisible: false,
    // 自动追加保证金提示
    tipsVisible: false,
    autoMarginTipsStatus: false,
    tipsCallback: () => {},
    userMaxLeverage: 0,
    retentionData: storage.getItem(ORDER_DATA_SAVE_CHECKED) || false, // 订单数据保留
    confirmModal: storage.getItem(ORDER_CONFIRM_CHECKED) || true, // 下单确认
  },
  effects: {
    *initUserConfig({ payload }, { call, put }) {
      const { userConfigs } = payload;
      const { confirmConfig, webNoticeConfig } = userConfigs;
      const webNoticeConfigArray = Object.keys(webNoticeConfig).filter(
        (item) => webNoticeConfig[item],
      );
      const confirmConfigArray = Object.keys(confirmConfig).filter((item) => confirmConfig[item]);

      yield put({
        type: 'update',
        payload: {
          confirmConfig: confirmConfigArray,
          webNoticeConfig: webNoticeConfigArray,
        },
      });
    },
    *getRiskLimits({ payload }, { call, put }) {
      const { data } = yield call(getRiskLimits, payload);
      const sortDatas = sortBy(data || [], 'level');
      yield put({
        type: 'update',
        payload: {
          riskLimits: sortDatas,
        },
      });
    },
    *getUserRiskLimit({ payload }, { call, put }) {
      const oData = yield call(getUserRiskLimit, payload);
      if (oData && isObject(oData)) {
        yield put({
          type: 'update',
          payload: {
            userRiskLimit: oData.data,
          },
        });
      }
    },
    *postChangeRiskLimit({ payload }, { call, put }) {
      const data = yield call(postChangeRiskLimit, payload);
      yield put({
        type: 'notice/feed',
        payload: {
          type: 'message.success',
          message: _t('risk.limit.submit.success'),
        },
      });
      // yield put({
      //   type: 'getUserRiskLimit',
      //   payload: { symbol: payload.symbol },
      // });
      // yield put({
      //   type: 'getRiskLimits',
      //   payload: payload.symbol,
      // });
      return data;
    },
    *changeAllNoticeConfig({ payload: { allClose, type } = {} }, { call, put }) {
      let noticeKeys = [...ALL_NOTICE_CONFIRM_KEY];
      if (allClose) {
        noticeKeys = [];
      }
      yield call(setNoticePreferences, {
        type: WEB_NOTICE_CONFIG,
        configs: noticeKeys,
      });

      yield put({
        type: 'update',
        payload: {
          webNoticeConfig: noticeKeys,
        },
      });
    },
    *setNoticePreferencesByBool({ payload: { type, value, status } }, { call, put, select }) {
      const { webNoticeConfig } = yield select((state) => state.futuresSetting);
      const configs = [...webNoticeConfig];
      if (status) {
        // 删除
        const index = configs.indexOf(value);
        configs.splice(index, 1);
      } else {
        // 添加
        configs.push(value);
      }
      yield call(setNoticePreferences, {
        type: WEB_NOTICE_CONFIG,
        configs,
      });
      yield put({
        type: 'update',
        payload: {
          webNoticeConfig: configs,
        },
      });
    },
    *setConfirmByBool({ payload: { type, value, status } }, { call, put, select }) {
      const { confirmConfig } = yield select((state) => state.futuresSetting);
      const configs = [...confirmConfig];
      if (status) {
        // 删除
        const index = configs.indexOf(value);
        configs.splice(index, 1);
      } else {
        // 添加
        configs.push(value);
      }
      yield call(setNoticePreferences, {
        type: CONFIRM_CONFIG,
        configs,
      });
      yield put({
        type: 'update',
        payload: {
          confirmConfig: configs,
        },
      });
    },
    *changeAllConfirmConfig({ payload: { allClose, type } = {} }, { call, put }) {
      let noticeKeys = [...ALL_DIALOG_CONFIRM_KEY];
      if (allClose) {
        noticeKeys = [];
      }
      yield call(setNoticePreferences, {
        type: CONFIRM_CONFIG,
        configs: noticeKeys,
      });

      yield put({
        type: 'update',
        payload: {
          confirmConfig: noticeKeys,
        },
      });
    },
    *getSymbolAutoDeposit({ payload }, { call, put, select }) {
      const { symbol } = payload;
      const userInfo = yield select((state) => state.user.user);
      if (userInfo) {
        const { data } = yield call(getSymbolDetail, symbol);
        yield put({
          type: 'update',
          payload: {
            autoDeposit: data.autoDeposit,
          },
        });
      }
    },
    // 更新本地存储值
    *updateLocalSetting({ payload: { type, status } }, { put }) {
      storage.setItem([type], status);
      let updateKey = '';
      switch (type) {
        case ORDER_CONFIRM_CHECKED:
          updateKey = 'confirmModal';
          break;
        case ORDER_DATA_SAVE_CHECKED:
          updateKey = 'retentionData';
          break;
        default:
          break;
      }
      if (updateKey) {
        yield put({
          type: 'update',
          payload: {
            [updateKey]: status,
          },
        });
      }
    },
    *setPreferencesByBool({ payload: { type, value, status } }, { call, put, select }) {
      if (type === CONFIRM_CONFIG) {
        console.log(ORDER_CONFIRM_CHECKED, 'ORDER_CONFIRM_CHECKED');
        if (value === ORDER_CONFIRM_CHECKED) {
          yield put({
            type: 'updateLocalSetting',
            payload: { type: ORDER_CONFIRM_CHECKED, status: !status },
          });
        } else {
          yield put({
            type: 'setConfirmByBool',
            payload: {
              type,
              value,
              status,
            },
          });
        }
      } else {
        yield put({
          type: 'setNoticePreferencesByBool',
          payload: {
            type,
            value,
            status,
          },
        });
      }
    },
    *riskLimitChange({ payload: { data } = {} }, { put, select }) {
      let success = false;
      if (data) {
        success = data.find((item) => item.data.success);
        if (success) {
          const riskLimitOrderInfo = yield select((state) => state.futuresForm?.riskLimitOrderInfo);
          const symbol = yield select((state) => state.trade.currentSymbol);
          if (riskLimitOrderInfo?.size) {
            event.emit(CONFIRM_DIALOG_EVENT_KEY, {
              values: '',
              confirm: () => null,
              checkFlows: [CHECK_RISK_LIMIT_ORDER],
            });
          }
          yield put({
            type: 'futuresCommon/getUserMaxLeverage',
            payload: { symbol },
          });
          yield put({
            type: 'getUserRiskLimit',
            payload: { symbol },
          });
        }
      }
    },
  },
  subscriptions: {
    setUpSocket({ dispatch }) {
      futuresWorkerSocket.topicRiskLimitChange((data) => {
        dispatch({
          type: 'riskLimitChange',
          payload: {
            data,
          },
        });
      });
    },
  },
});
