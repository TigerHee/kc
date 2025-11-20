/**
 * Owner: garuda@kupotech.com
 * 该 models 存储合约的一些公共信息
 */
import { LOGIN_401 } from 'codes';

import base from 'common/models/base';
import polling from 'common/models/polling';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import extend from 'dva-model-extend';
import { isObject, forEach, reduce, get } from 'lodash';
import { trackClick } from 'utils/ga';
import { _t } from 'utils/lang';

import storage from 'utils/storage.js';

import { ABC_CROSS_LEVERAGE } from '@/components/AbnormalBack/constant';

import {
  QUANTITY_UNIT,
  storagePrefix,
  CROSS_MAX_LEVERAGE_STORAGE_KEY,
  CROSS_LEVERAGE_STORAGE_KEY,
  ISOLATED_LEVERAGE_STORAGE_KEY,
  ISOLATED_MAX_LEVERAGE_STORAGE_KEY,
} from '@/meta/futures';
import { CROSS_FUTURES_CORE_INTERFACE } from '@/meta/futuresSensors/cross';

import {
  getFuturesUserInfo,
  getUserFee,
  getUserMaxLeverage,
  getTrialFundUserMaxLeverage,
  postContractUserConfig,
  getV2UserMaxLeverage,
  getCrossUserLeverage,
  postCrossUserLeverage,
  getContractUserConfig,
  getUserKyc,
  getPnlShareDetail,
  getUserVIPInfo,
  getBaseShareInfo,
} from '@/services/futures';
import { checkFuturesSocketTopic } from '@/utils/socket';

const makeCrossAbnormal = ({ state, updateKey, locationId, status, error = {} }) => {
  const crossAbnormal = { ...state.crossAbnormal };
  crossAbnormal[updateKey] = status;
  if (!status) {
    const { code, msg, message, response } = error || {};
    let codeText = code;
    let msgText = msg || message;
    if (!codeText) {
      codeText = get(response, 'code') || get(response, 'data.code');
    }
    if (!msgText) {
      msgText = get(response, 'msg') || get(response, 'data.msg');
    }
    try {
      msgText = msgText || JSON.stringify(error);
    } catch (err) {
      msgText = err;
    }
    trackClick([CROSS_FUTURES_CORE_INTERFACE, locationId], {
      is_success: false,
      fail_reason_code: codeText,
      fail_reason: `${codeText || ''}:${msgText}`,
    });
  } else {
    trackClick([CROSS_FUTURES_CORE_INTERFACE, locationId], { is_success: true });
  }
  return crossAbnormal;
};

let getCrossLeveragePolling = false;
const CROSS_LEVERAGE_TOPIC = '/contract/crossLeverage';
export default extend(base, polling, {
  namespace: 'futuresCommon',
  state: {
    tradingUnit: storage.getItem('tradingUnit', storagePrefix) || QUANTITY_UNIT, // 交易单位
    futuresReady: false, // 是否初始化完成
    userConfigs: {}, //  合约用户保存的设置
    userMaxLeverage: 1, // 用户最大杠杆
    trialFundUserMaxLeverage: 1, // 体验金用户最大杠杆
    takerFeeRate: 0, // taker fee
    fixTakerFee: 0, // fix fee
    maxIsolatedLeverageMap: storage.getItem(ISOLATED_MAX_LEVERAGE_STORAGE_KEY) || {},
    maxCrossLeverageMap: storage.getItem(CROSS_MAX_LEVERAGE_STORAGE_KEY) || {},
    isolatedLeverageMap: storage.getItem(ISOLATED_LEVERAGE_STORAGE_KEY) || {},
    crossLeverageMap: storage.getItem(CROSS_LEVERAGE_STORAGE_KEY) || {},
    crossAbnormal: {}, // 全仓异常展示
    resultPromptInfo: false, // 异常弹框提示
    kycInfo: {}, // 用户 kyc
    pageHidden: false,
    pageExpiredTimer: false,
    shareDisplayName: true,
    posterVisible: false,
  },
  reducers: {
    updateCrossLeverage(state, { payload: { leverageMap, crossAbnormal } }) {
      const crossLeverageMap = { ...state.crossLeverageMap };
      forEach(leverageMap, (item, key) => {
        crossLeverageMap[key] = item.leverage;
      });

      storage.setItem(CROSS_LEVERAGE_STORAGE_KEY, crossLeverageMap);
      const updateState = {
        ...state,
        crossLeverageMap,
      };
      if (crossAbnormal) {
        const abnormalState = makeCrossAbnormal({ state, ...crossAbnormal });
        updateState.crossAbnormal = abnormalState;
      }
      return updateState;
    },
    updateCrossAbnormal(state, { payload: { updateKey, status, locationId, error } }) {
      // 过滤 401 报错
      if (error && error?.code === LOGIN_401) {
        return;
      }
      const crossAbnormal = makeCrossAbnormal({ state, updateKey, status, locationId, error });
      return {
        ...state,
        crossAbnormal,
      };
    },
  },
  effects: {
    *getUserKyc(_, { call, put }) {
      const oData = yield call(getUserKyc);
      if (oData && isObject(oData.data)) {
        yield put({
          type: 'update',
          payload: {
            kycInfo: oData.data,
          },
        });
      }
    },
    *getFuturesUserInfo(__, { call, put }) {
      const oData = yield call(getFuturesUserInfo);
      if (oData && isObject(oData.data)) {
        const { basicConfigs, userConfigs } = oData.data;
        yield put({
          type: 'update',
          payload: {
            tradingUnit: basicConfigs?.tradingUnit,
            userConfigs,
          },
        });
        yield put({
          type: 'futuresSetting/initUserConfig',
          payload: {
            userConfigs,
          },
        });
      }
    },
    *getUserFee({ payload: { symbol } = {} }, { call, put }) {
      const oData = yield call(getUserFee, {
        symbol,
      });
      if (oData && isObject(oData.data)) {
        const { takerFeeRate, fixTakerFee } = oData.data;
        yield put({
          type: 'update',
          payload: {
            takerFeeRate,
            fixTakerFee,
          },
        });
      }
    },
    *getUserMaxLeverage({ payload = {} }, { call, select, put }) {
      const oData = yield call(getUserMaxLeverage, payload);
      const maxIsolatedLeverageMap = yield select(
        (state) => state.futuresCommon.maxIsolatedLeverageMap,
      );
      if (oData && oData.data != null) {
        const updateMap = {
          ...maxIsolatedLeverageMap,
          [payload.symbol]: oData.data,
        };
        yield put({
          type: 'update',
          payload: {
            userMaxLeverage: Number(oData.data),
            maxIsolatedLeverageMap: updateMap,
          },
        });
      }
    },
    *getTrialFundUserMaxLeverage({ payload = {} }, { call, select, put }) {
      const oData = yield call(getTrialFundUserMaxLeverage, payload);
      if (oData && oData.data != null) {
        yield put({
          type: 'update',
          payload: {
            trialFundUserMaxLeverage: Number(oData.data),
          },
        });
      }
    },
    *getCrossLeverageConfig({ payload }, { call, put }) {
      try {
        if (getCrossLeveragePolling) return;
        getCrossLeveragePolling = true;
        const symbol = payload?.symbol || 'ALL';
        const oData = yield call(getCrossUserLeverage, { symbol });
        if (oData && isObject(oData.data)) {
          yield put({
            type: 'updateCrossLeverage',
            payload: {
              leverageMap: oData.data,
              crossAbnormal: { updateKey: ABC_CROSS_LEVERAGE, status: true, locationId: '5' },
            },
          });
        } else {
          yield put({
            type: 'updateCrossAbnormal',
            payload: {
              updateKey: ABC_CROSS_LEVERAGE,
              status: false,
              locationId: '5',
              error: oData,
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'updateCrossAbnormal',
          payload: {
            updateKey: ABC_CROSS_LEVERAGE,
            status: false,
            locationId: '5',
            error: e,
          },
        });
        throw e;
      } finally {
        getCrossLeveragePolling = false;
      }
    },
    *getV2UserMaxLeverage({ payload: { symbol } = {} }, { call, select, put }) {
      const maxIsolatedLeverageMap = yield select(
        (state) => state.futuresCommon.maxIsolatedLeverageMap,
      );
      const maxCrossLeverageMap = yield select((state) => state.futuresCommon.maxCrossLeverageMap);

      const oData = yield call(getV2UserMaxLeverage, { symbol });
      if (oData && oData.data != null) {
        const { isolatedMaxLeverage, crossMaxLeverage } = oData.data;
        const updateCrossMap = {
          ...maxCrossLeverageMap,
          [symbol]: crossMaxLeverage,
        };
        const updateIsolatedMap = {
          ...maxIsolatedLeverageMap,
          [symbol]: isolatedMaxLeverage,
        };
        yield put({
          type: 'update',
          payload: {
            maxCrossLeverageMap: updateCrossMap,
            maxIsolatedLeverageMap: updateIsolatedMap,
          },
        });
        storage.setItem(ISOLATED_MAX_LEVERAGE_STORAGE_KEY, updateIsolatedMap);
        storage.setItem(CROSS_MAX_LEVERAGE_STORAGE_KEY, updateCrossMap);
      }
    },
    *getContractUserConfig(__, { call, put }) {
      const oData = yield call(getContractUserConfig);
      if (oData && isObject(oData.data)) {
        const isolatedLeverageMap = {};
        forEach(oData.data, (item, key) => {
          isolatedLeverageMap[key] = item.leverage;
        });
        yield put({
          type: 'update',
          payload: { userConfig: oData.data, isolatedLeverageMap },
        });
        storage.setItem(ISOLATED_LEVERAGE_STORAGE_KEY, isolatedLeverageMap);
      }
    },
    // 更新逐仓杠杆值
    *isolatedLeverageChange({ payload: { leverage, symbol } }, { put, select, call }) {
      const isolatedLeverageMap = yield select((state) => state.futuresCommon.isolatedLeverageMap);
      // 逐仓更新杠杆值接口报错不影响
      try {
        yield call(postContractUserConfig, { symbol, defaultLeverage: leverage });
        yield put({
          type: 'getContractUserConfig',
        });
      } catch (err) {
        const updateLeverageMap = { ...isolatedLeverageMap, [symbol]: leverage };
        yield put({
          type: 'update',
          payload: { isolatedLeverageMap: updateLeverageMap },
        });
        storage.setItem(ISOLATED_LEVERAGE_STORAGE_KEY, updateLeverageMap);
      }
    },
    *crossLeverageChange({ payload }, { put, call }) {
      const result = yield call(postCrossUserLeverage, payload);
      if (result && result.data) {
        const { leverage, symbol } = payload;
        yield put({
          type: 'updateCrossLeverage',
          payload: {
            leverageMap: { [symbol]: { leverage } },
            crossAbnormal: { updateKey: ABC_CROSS_LEVERAGE, status: true, locationId: '5' },
          },
        });
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('success'),
          },
        });
      }
    },
    // check margin mode 轮询
    *checkCrossLeverageSocket(__, { put }) {
      const checkFuturesTopic = yield checkFuturesSocketTopic({ topic: CROSS_LEVERAGE_TOPIC });
      if (!checkFuturesTopic) {
        yield put({ type: 'getCrossLeverageConfig' });
      }
    },
    *getPnlShareDetail({ payload }, { call }) {
      try {
        return yield call(getPnlShareDetail, payload);
      } catch (err) {
        // 这里如果是正常报错，直接走逻辑提示
        if (err && err.code) {
          return {
            success: false,
          };
        }
        throw err;
      }
    },
    // 请求用户 vip 等级
    *getUserVIPInfo(__, { put, call }) {
      const result = yield call(getUserVIPInfo);
      if (result?.data) {
        yield put({
          type: 'update',
          payload: {
            vipInfo: result.data,
          },
        });
      }
    },
    // 请求分享信息
    *getBaseShareInfo(__, { put, call }) {
      const result = yield call(getBaseShareInfo);
      if (result?.data) {
        yield put({
          type: 'update',
          payload: {
            baseShareInfo: result.data,
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
        payload: { effect: 'checkCrossLeverageSocket', interval: 10000 },
      });
    },
    initSocketTopicMessage({ dispatch }) {
      futuresWorkerSocket.topicFuturesCrossLeverage((data) => {
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
          type: 'updateCrossLeverage',
          payload: {
            leverageMap: updateMap,
            crossAbnormal: { updateKey: ABC_CROSS_LEVERAGE, status: true, locationId: '5' },
          },
        });
      });
    },
  },
});
