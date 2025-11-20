/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import { HOME_CURRENCY } from 'config';
import base from 'common/models/base';
import polling from 'common/models/polling';
import mulPagination from 'common/models/mulPagination';
import * as serv from 'services/homepage';
// import * as ws from '@kc/socket';
import throttleDataHoc from 'hocs/throttleDataHoc';
import { getUserQuota } from 'services/withdraw';
import { _t } from 'utils/lang';

// const socket = ws.getInstance();

// 订阅websocket数据，只挂载一次事件
// let subscriptionWs = false;

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
      honorLevel: -1,
      subLevel: -1,
      // apiEnableCount: 0,
      makerFeeRate: '',
      // securityLevel: 0,
      takerFeeRate: '',
      withdrawQuota: 0,
      kyc: 0,
      // credentialType: 'no_credential',
      vipLevel: 0,
      userLevel: 0,
    },
    // userLoginLogs: [],
    languageType: null,
    languageTypeMap: null,

    countryList: [], // 国家codes
    onlineDeviceNum: null,

    // kcs 抵扣手续费
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
    // 公用底部有用
    *pullSummary({ payload }, { call, put }) {
      const { data } = yield call(serv.getSummary, HOME_CURRENCY);
      const summary = {
        map: {},
      };
      if (data) {
        data.forEach((item) => {
          summary.map[item.type] = item;
          // summary[item.type] = `${separateNumber(item.amount)} ${HOME_CURRENCY}`;
          summary[item.type] = item.amount;
        });
      }
      yield put({
        type: 'update',
        payload: { summary },
      });
    },

    // 获取otc支持的语言列表
    *pullSupportLanguageTypes({ payload = {} }, { call, put }) {
      const { data, success } = yield call(serv.getLanguageTypes, { type: 'LANGUAGE' });
      if (success) {
        const languageTypeMap = {};
        _.each(data, (item) => {
          const { typeCode } = item;
          languageTypeMap[typeCode] = item;
        });
        yield put({
          type: 'update',
          payload: {
            languageType: data,
            languageTypeMap,
          },
        });
      }
    },

    /** ws data update */
    *updateSnapshotByMap({ payload }, { put, select }) {
      const map = payload;
      const oldMarketRecords = yield select(state => (state.homepage.marketRecords || []));

      const marketRecords = [...oldMarketRecords];
      _.each(marketRecords, (item, index) => {
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
    // 获取如账号等级，费率等信息，已弃用
    *getUserOverviewInfo(action, { put, call, select }) {
      const info = yield call(serv.getUserOverviewInfo);
      const { baseInfo } = yield select(state => state.homepage);
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
    *getSecurityLog({ payload = {} }, { put, call, select }) {
      const { SecurityLogs } = yield select(state => state.homepage);
      let { pagination = { current: 1, size: 6 } } = payload;
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
    // 获取国家codes
    *getCountryCodes({ payload }, { put, call }) {
      const result = yield call(serv.getCountryCodes);
      yield put({
        type: 'update',
        payload: {
          countryList: result.data || [],
        },
      });
    },

    // 获取提现额度
    *getQuota({ payload }, { put, call }) {
      const result = yield call(getUserQuota, { currency: 'BTC' });
      yield put({
        type: 'deepSave',
        payload: {
          withdrawQuota: result.data.limitBTCAmount,
        },
        target: 'baseInfo',
      });
    },
    // 获取手续费 -- 替换为新接口
    *getTradeFee({ payload }, { put, call }) {
      const { data = {} } = yield call(serv.getUserVipInfo);
      yield put({
        type: 'deepSave',
        payload: {
          honorLevel: data.honorLevel,
          subLevel: data.subLevel,
          makerFeeRate: data.makerFeeRate,
          takerFeeRate: data.takerFeeRate,
          vipLevel: data.level,
          userLevel: data.userLevel,
        },
        target: 'baseInfo',
      });
    },
    *getFeeDeductionConfig({ payload }, { put, call }) {
      const { data } = yield call(serv.getFeeDeductionConfig);
      yield put({
        type: 'update',
        payload: {
          feeDiscountConfig: data,
        },
      });
    },
    *getUserKcsDiscount({ payload }, { put, call }) {
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
  subscriptions: {
    setUpHomePage({ dispatch }) {

      // 当且仅当用户登录需要，逻辑迁移, 未使用，移除
      // dispatch({
      //   type: 'watchPolling',
      //   payload: { effect: 'accountPolling', interval: 30 * 1000 },
      // });
    },
    // 移除订阅，此字段在交易3.0之后似乎没有再使用
    // subscribeMessage({ dispatch }) {
    //   if (subscriptionWs) {
    //     return;
    //   }
    //   subscriptionWs = true;

    //   const throttleData = throttleDataHoc((cachedArrs) => {
    //     const map = {};
    //     // 后来的先覆盖
    //     _.eachRight(cachedArrs, (_arr) => {
    //       _.eachRight(_arr, (_message) => {
    //         const { data: { data = [] } = {} } = _message;

    //         /** 避免单个交易对订阅的snapshot造成污染 */
    //         if (data[0]) {
    //           _.eachRight(data, (item) => {
    //             const { symbolCode } = item;
    //             if (!map[symbolCode]) {
    //               map[symbolCode] = item;
    //             }
    //           });
    //         }
    //       });
    //     });
    //     /** update */
    //     dispatch({ type: 'updateSnapshotByMap', payload: map });
    //   }, 3000);

    //   socket.topicMessage(ws.Topic.MARKET_SNAPSHOT, 'trade.snapshot')(throttleData);
    // },
  },
});
