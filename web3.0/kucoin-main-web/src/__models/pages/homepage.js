/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { HOME_CURRENCY } from 'config/base';
import polling from 'common/models/polling';
import mulPagination from 'common/models/mulPagination';
import * as serv from 'services/homepage';
import throttleDataHoc from 'hocs/throttleDataHoc';
import { getHotSymbolTick, getChangeTick } from 'services/market';
import { getUserQuota } from 'services/withdraw';
import intl from 'react-intl-universal';

// 订阅websocket数据，只挂载一次事件
let subscriptionWs = false;

const activityData = {
  en: [
    {
      title: 'ONOT Round Two Campaign Rewards Distributed',
      link: '/news/en-onot-round-two-campaign-rewards-distributed/',
    },
    {
      title: 'XYO Campaign Rewards Distributed',
      link: '/news/en-xyo-campaign-rewards-distributed/',
    },
  ],
  cn: [
    {
      title: 'ONOT第二轮活动奖励已发放',
      link: '/news/onot第二轮活动奖励已发放/',
    },
    {
      title: 'XYO活动奖励已发放',
      link: '/news/xyo活动奖励已发放/',
    },
  ],
};

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
      // yield put({ type: 'pullNews' });
      // yield put({ type: 'pullActivity' });
      // yield put({ type: 'pullAds' });
      // yield put({ type: 'getLoginLogs' });
      // yield put({ type: 'getDeviceList' });
      // yield put({ type: 'getSecurityLevel' });

      if (isLogin) {
        yield fork(put, { type: 'api_key/getEnabledApi' });
        yield fork(put, { type: 'getSecurityLevel' });
      }
    },
    // 用于首页ssr获取数据
    *pullHomePage(action, { put, take, all }) {
      function* newsPull() {
        yield put({ type: 'pullNews' });
        yield take('pullNews/@@end');
      }
      function* activityPull() {
        yield put({ type: 'pullActivity' });
        yield take('pullActivity/@@end');
      }
      function* adsPull() {
        yield put({ type: 'pullAds' });
        yield take('pullAds/@@end');
      }

      yield all([newsPull(), activityPull(), adsPull()]);
    },
    // 公用底部有用
    *pullSummary(action, { call, put }) {
      const { data } = yield call(serv.getSummary, HOME_CURRENCY);
      let contractData = null;
      try {
        contractData = yield call(serv.getContractSummary, 'USDT');
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
          // summary[item.type] = `${separateNumber(item.amount)} ${HOME_CURRENCY}`;
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
    *pullNews(action, { call, put }) {
      try {
        const { items } = yield call(serv.getNews, { pageSize: 10 });
        yield put({
          type: 'update',
          payload: {
            news: (items || []).sort((a, b) => {
              return a.stick - b.stick;
            }),
          },
        });
      } catch (e) {
        console.log('homepage pullNews error');
        // Raven.captureException(e);
      }
    },
    *pullActivity(action, { call, put }) {
      try {
        const currentLang = intl.options.currentLocale;
        let { items } = yield call(serv.getActivity, { pageSize: 3 });
        if (items.length > 3) {
          items = items.slice(0, 3);
        }
        const data = currentLang === 'zh_CN' ? activityData.cn : activityData.en;
        const activities = (items || []).concat(data);
        yield put({
          type: 'update',
          payload: {
            activities: activities.slice(0, 3),
          },
        });
      } catch (e) {
        console.log('homepage pullActivity error');
        // Raven.captureException(e);
      }
    },
    *pullAds(action, { call, put }) {
      try {
        const { data } = yield call(serv.getAds);
        yield put({
          type: 'update',
          payload: {
            ads: data,
          },
        });
      } catch (e) {
        console.log('homepage pullAds error');
        // Raven.captureException(e);
      }
    },
    *pullMarketRecords({ payload: { activeTab } }, { call, put }) {
      let sevice = null;
      let params = {};
      if (activeTab === 'hot') {
        sevice = getHotSymbolTick;
        params = { count: 15 };
      } else {
        sevice = getChangeTick;
        params = { number: 15, sort: activeTab === 'increase' };
      }
      const { data } = yield call(sevice, params);
      let records = data.filter((item) => !!item) || [];
      if (activeTab === 'hot') {
        records = records.sort((a, b) => {
          return +b.volValue - +a.volValue;
        });
      }
      yield put({
        type: 'update',
        payload: {
          marketRecords: records,
        },
      });
    },

    /** ws data update */
    *updateSnapshotByMap({ payload }, { put, select }) {
      const map = payload;
      const oldMarketRecords = yield select((state) => state.homepage.marketRecords || []);

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
      import('components/Toast').then(({ message }) => {
        message.success(result.msg);
      });
      yield put({ type: 'getDeviceList' });
    },
    *accountPolling(action, { put, fork }) {
      yield fork(put, { type: 'getDeviceList' });
      yield fork(put, { type: 'getLoginLogs' });
      yield fork(put, { type: 'getSecurityLog' });
      yield fork(put, { type: 'getUserOverviewInfo' });
      // yield fork(put, { type: 'getDeviceList' });
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
    *getSecurityLog({ payload = {} }, { put, call, select }) {
      const { SecurityLogs } = yield select((state) => state.homepage);
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
    *getCountryCodes(action, { put, call }) {
      const result = yield call(serv.getCountryCodes);
      yield put({
        type: 'update',
        payload: {
          countryList: result.data || [],
        },
      });
    },

    // 获取提现额度
    *getQuota(action, { put, call }) {
      const result = yield call(getUserQuota, { currency: 'BTC' });
      yield put({
        type: 'deepSave',
        payload: {
          withdrawQuota: result.data.limitBTCAmount,
        },
        target: 'baseInfo',
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

    *updateUserKcsDiscount({ payload }, { put, call }) {
      yield call(serv.updateKcsDiscount, payload.enabled);
      yield put({
        type: 'getUserKcsDiscount',
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullMarketRecords', interval: 60 * 1000 },
      });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'accountPolling', interval: 30 * 1000 },
      });
      dispatch({ type: 'pull' });
    },
    subscribeMessage({ dispatch }) {
      if (subscriptionWs) {
        return;
      }

      const throttleData = throttleDataHoc((cachedArrs) => {
        const map = {};
        // 后来的先覆盖
        _.eachRight(cachedArrs, (_arr) => {
          _.eachRight(_arr, (_message) => {
            const { data: { data = [] } = {} } = _message;

            /** 避免单个交易对订阅的snapshot造成污染 */
            if (data[0]) {
              _.eachRight(data, (item) => {
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

      import('src/utils/socket').then(({ kcWs: socket, Topic }) => {
        subscriptionWs = true;
        socket.topicMessage(Topic.MARKET_SNAPSHOT, 'trade.snapshot')(throttleData);
      });
    },
  },
});
