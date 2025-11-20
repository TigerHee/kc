/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import mulPagination from 'common/models/mulPagination';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import { bootConfig } from 'kc-next/boot';
import throttleDataHoc from 'hocs/throttleDataHoc';
import { each, forEachRight } from 'lodash-es';
import * as serv from 'services/homepage';
import { IS_SERVER_ENV } from 'kc-next/env';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

export default extend(base, polling, mulPagination, {
  namespace: 'homepage',
  state: {
    summary: {},
    news: [],
    activities: [],
    ads: {},
    marketRecords: [],
    deviceTable: [], // 信任设备列表
    sLevel: 0,

    SecurityLogs: {
      pagination: {
        current: 1,
        pageSize: 5,
      },
      records: [],
    },
    LoginLogs: {
      pagination: {
        current: 1,
        pageSize: 5,
      },
      records: [],
    },
    baseInfo: {
      apiEnableCount: 0,
      makerRate: '~',
      securityLevel: 0,
      takerRate: '~',
      withdrawQuota: 0,
      kyc: 0,
      credentialType: 'no_credential',
      vipLevel: 0,
    },

    countryList: [], // 国家codes
    onlineDeviceNum: null,

    feeDiscountConfig: {
      discountRate: 100,
      isGlobalDeductionEnabled: false,
    },
    userKcsDiscountStatus: false,
  },
  reducers: {
    deepSave(state, { payload, target }) {
      return {
        ...state,
        [target]: {
          ...state[target],
          ...payload,
        },
      };
    },
  },
  effects: {
    *pull(action, { put, fork, select }) {
      const { isLogin } = yield select((state) => state.user);
      yield put({ type: 'pullSummary' });

      if (isLogin) {
        yield fork(put, { type: 'api_key/getEnabledApi' });
        yield fork(put, { type: 'getSecurityLevel' });
      }
    },

    // 公用底部有用
    *pullSummary(action, { call, put }) {
      const { data } = yield call(serv.getSummary, bootConfig._BASE_CURRENCY_);
      let contractData = null;
      try {
        contractData = yield call(serv.getContractSummary, window._BASE_CURRENCY_);
      } catch (e) {
        contractData = { data: { volume: 0 } };
      }
      const {
        data: { volume: contractVolume },
      } = contractData;
      const summary = {
        map: {},
      };
      if (data) {
        data.forEach((item) => {
          summary.map[item.type] = item;
          summary[item.type] = item.amount;
        });
      }
      // 交易量统计加入合约的交易量
      if (summary.TRADING_VOLUME !== undefined) {
        const item = summary.map.TRADING_VOLUME;
        item.amount = contractVolume;
        summary.TRADING_VOLUME = item.amount;
      }
      yield put({
        type: 'update',
        payload: { summary },
      });
    },

    /** ws data update */
    *updateSnapshotByMap({ payload }, { put, select }) {
      const map = payload;
      const oldMarketRecords = yield select((state) => state.homepage.marketRecords || []);

      const marketRecords = [...oldMarketRecords];
      each(marketRecords, (item, index) => {
        const { symbolCode } = item;
        if (map[symbolCode]) {
          marketRecords[index] = map[symbolCode];
        }
      });

      yield put({
        type: 'update',
        payload: {
          marketRecords,
        },
      });
    },

    *getSecurityLevel(action, { call, put }) {
      const result = yield call(serv.getSecurityLevel);
      yield put({
        type: 'update',
        payload: {
          sLevel: result.data,
        },
      });
    },
    *removeDevice({ payload }, { call, put }) {
      const result = yield call(serv.removeTrust, payload.deviceId);
      yield put({
        type: 'notice/feed',
        payload: {
          type: 'message.success',
          message: result.msg,
        },
      });
      yield put({ type: 'getDeviceList' });
    },
    *securityDataInit(action, { put, fork }) {
      yield fork(put, { type: 'getDeviceList' });
      yield fork(put, { type: 'getLoginLogs' });
      yield fork(put, { type: 'getSecurityLog' });
    },

    // 获取如账号等级，费率等信息
    *getUserOverviewInfo(action, { put, call, select }) {
      const info = yield call(serv.getUserOverviewInfo);
      const { baseInfo } = yield select((state) => state.homepage);
      yield put({
        type: 'update',
        payload: {
          baseInfo: {
            ...baseInfo,
            ...info.data,
          },
        },
      });
      yield put({ type: 'getTradeFee' });
    },
    // 获取登录信息
    *getLoginLogs({ payload = {} }, { call, put, select }) {
      const { LoginLogs } = yield select((state) => state.homepage);
      let { current = 1, pageSize = 5 } = payload;
      if (!payload.current) {
        current = LoginLogs.pagination.current;
        pageSize = LoginLogs.pagination.pageSize;
      }
      const result = yield call(serv.getLoginLogs, {
        page: current,
        pageSize,
      });

      if (result && result.items) {
        yield put({
          type: 'savePage',
          payload: result,
          listName: 'LoginLogs',
        });
      }
      if (current === 1) {
        const onlineDevices = result.items.filter((c) => {
          return c.onlineStatus;
        });
        yield put({
          type: 'update',
          payload: {
            onlineDeviceNum: onlineDevices.length,
          },
        });
      }

      return result;
    },
    // 获取信任设备列表
    *getDeviceList(action, { call, put }) {
      const result = yield call(serv.getDeviceList);
      yield put({
        type: 'update',
        payload: {
          deviceTable: result.data,
        },
      });
    },
    *getSecurityLog({ payload = {} }, { put, call, select }) {
      const { SecurityLogs } = yield select((state) => state.homepage);
      let { pagination = { current: 1, size: 5 } } = payload;
      if (!payload.pagination) {
        pagination = {
          page: SecurityLogs.pagination.current || 1,
          pageSize: SecurityLogs.pagination.pageSize,
        };
      }
      pagination.page = pagination.page || pagination.current;

      const log = yield call(serv.getUserOperationLog, pagination);
      if (log && log.items) {
        yield put({
          type: 'savePage',
          payload: log,
          listName: 'SecurityLogs',
        });
      }
    },
    *pullCountryList(_, { put, select }) {
      const countryList = select((state) => state.homepage.countryList);
      if (countryList && countryList.length) {
        return;
      }
      yield put({ type: 'getCountryCodes' });
    },
    // 获取国家codes
    *getCountryCodes(action, { put, call }) {
      const result = yield call(serv.getCountryCodes);
      yield put({
        type: 'update',
        payload: {
          countryList: result.data || [],
        },
      });
    },

    // 获取手续费
    *getTradeFee(action, { put, call }) {
      const { data } = yield call(serv.getUserTradeFee);
      yield put({
        type: 'deepSave',
        payload: {
          makerRate: data.makerFeeRate,
          takerRate: data.takerFeeRate,
          vipLevel: data.level,
        },
        target: 'baseInfo',
      });
    },
    *getFeeDeductionConfig(action, { put, call }) {
      const { data } = yield call(serv.getFeeDeductionConfig);
      yield put({
        type: 'update',
        payload: {
          feeDiscountConfig: data,
        },
      });
    },
    *getUserKcsDiscount(action, { put, call }) {
      const { data } = yield call(serv.checkIsKcsDiscountOn);
      yield put({
        type: 'update',
        payload: {
          userKcsDiscountStatus: (data || {}).isDeductionEnabled || false,
        },
      });
    },
    *updateUserKcsDiscount({ payload }, { put, call }) {
      yield call(serv.updateKcsDiscount, payload.enabled);
      yield put({
        type: 'getUserKcsDiscount',
      });
    },
  },
  subscriptions: IS_SERVER_ENV ? {} : {
    setUp({ dispatch }) {
      // @deprecated 未触发
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'accountPolling', interval: 30 * 1000 },
      });
      setTimeout(() => {
        dispatch({ type: 'pull' });
      });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }
      subscriptionWs = true;

      const throttleData = throttleDataHoc((cachedArrs) => {
        const map = {};
        // 后来的先覆盖
        forEachRight(cachedArrs, (_arr) => {
          forEachRight(_arr, (_message) => {
            const { data: { data = [] } = {} } = _message;

            /** 避免单个交易对订阅的snapshot造成污染 */
            if (data[0]) {
              forEachRight(data, (item) => {
                const { symbolCode } = item;
                if (!map[symbolCode]) {
                  map[symbolCode] = item;
                }
              });
            }
          });
        });
        /** update */
        dispatch({ type: 'updateSnapshotByMap', payload: map });
      }, 3000);
      import('@kc/socket').then((ws) => {
        const socket = ws.getInstance();
        socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')(throttleData);
      });
    },
  },
});
