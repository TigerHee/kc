/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import { maxPrecision } from 'config';
import moment from 'moment';
import base from 'common/models/base';
import pagination from 'common/models/paginate';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import * as serv from 'services/bonus';

const assetType = 'BTC';

export default extend(base, pagination, filter, polling, {
  namespace: 'bonus',
  state: {
    // 邀请奖励相关
    referral: {
      totalAmount: null,
      yesterdayAmount: null,
      totalUsers: null,
      unreceive: null,
      inviteNumber: null,
      currency: null,
    },
    referralUsers: {
      directCount: null,
      secondhandCount: null,
      thirdhandCount: null,
      totalCount: null,
      currency: null,
    },
    referalRecords: [],
    referalPagination: {
      current: 1,
      total: null,
    },
    // KCS鼓励金相关
    KCSBonus: {
      totalAmount: null,
      yesterdayAmount: null, // 昨日获赠数量
      unreceive: null,
      precision: maxPrecision,
      currency: null,
    },
    rewards: {
      totalAmount: null,
      yesterdayAmount: null,
    },
    // 鼓励金可与其他获赠可共用records\pagination存放分页数据
    records: [],
    // 其他获赠filter
    filters: {
      startAt: moment().subtract(1, 'month'),
      endAt: moment(),
      type: '',
      currency: '',
      page: 1,
      pageSize: 10,
      currentPage: 1,
    },
    // 全站数据
    site: {
      totalReferral: null,
      totalBonus: null,
    },
    marginBonusStatus: {},
    lastCouponInfo: null,
  },
  reducers: {
    initFilters(state) {
      return {
        ...state,
        filters: {
          startAt: moment().subtract(1, 'month'),
          endAt: moment(),
          type: '',
          currency: '',
          page: 1,
          pageSize: 10,
          currentPage: 1,
        },
      };
    },
  },
  effects: {
    // *watchUser({ type }, { take, put, select }) {
    //   while (true) {
    //     yield take('user/pullUser/@@end');
    //     const { user } = yield select(state => state.user);
    //     if (user) {
    //       yield put({ type: 'bonus/pullMarginBonusStatus' });
    //     }
    //   }
    // },
    *pullOverview({ payload }, { call, put, select }) {
      const { data } = yield call(serv.getOverview);
      const { referral, KCSBonus, rewards } = yield select(state => state.bonus);
      const _referral = data.find(v => v.type === 'INVITATION_REWARD');
      const _KCSBonus = data.find(v => v.type === 'ENCOURAGEMENT');
      const _rewards = data.find(v => v.type === 'OTHER_REWARD');
      referral.totalAmount = _referral.totalAmount;
      referral.yesterdayAmount = _referral.yesterdayAmount;
      referral.currency = _referral.currency;
      KCSBonus.totalAmount = _KCSBonus.totalAmount;
      KCSBonus.yesterdayAmount = _KCSBonus.yesterdayAmount;
      KCSBonus.currency = _KCSBonus.currency;
      rewards.totalAmount = _rewards.totalAmount;
      rewards.yesterdayAmount = _rewards.yesterdayAmount;
      rewards.currency = _rewards.currency;

      yield put({
        type: 'update',
        payload: {
          referral: { ...referral },
          KCSBonus: { ...KCSBonus },
          rewards: { ...rewards },
        },
      });
    },
    *pullBonusSummary({ payload }, { call, put, select }) {
      const { data } = yield call(serv.getBonusSummary);
      const { KCSBonus } = yield select(state => state.bonus);
      const {
        undrawCount,
        holdAmount,
        currentHoldAmount,
        precision,
      } = data;
      KCSBonus.unreceive = undrawCount;
      KCSBonus.holdAmount = holdAmount;
      KCSBonus.currentHoldAmount = currentHoldAmount;
      KCSBonus.precision = precision || maxPrecision;
      yield put({
        type: 'update',
        payload: {
          KCSBonus: { ...KCSBonus },
        },
      });
    },
    // 提取所有鼓励金
    *receiveAllBonus({ payload }, { call, put }) {
      yield call(serv.receiveAllBonus);
      yield put({ type: 'pullSummary' });
      yield put({ type: 'pullBonusRecords' });
    },
    // 鼓励金分页列表
    *pullBonusRecords({ payload: { current = 1, pageSize = 10 } }, { put, call }) {
      const {
        items, currentPage, totalNum, ...rest
      } = yield call(serv.getBonusRecords, { pageSize, page: current });
      yield put({
        type: 'savePage',
        payload: {
          items: items ? [...items] : [],
          currentPage,
          pageSize: rest.pageSize,
          totalNum,
        },
      });
    },
    *pullReferralSummary({ payload }, { call, put, select }) {
      const { data } = yield call(serv.getReferralTotal, { assetType });
      const { referral } = yield select(state => state.bonus);
      referral.unreceive = data.waitReceiveNumber;
      referral.inviteNumber = data.inviteNumber;

      yield put({
        type: 'update',
        payload: {
          referral: { ...referral },
        },
      });
    },
    *pullReferralUserCount({ payload }, { call, put }) {
      const { data } = yield call(serv.getReferralUserCount);
      yield put({
        type: 'update',
        payload: {
          referralUsers: data,
        },
      });
    },
    *pullReferralRecords({ payload }, { call, put, select }) {
      const { filters } = yield select(state => state.bonus);
      const { items, currentPage, totalNum } = yield call(serv.getReferralRecords, {
        page: filters.currentPage, pageSize: 10 });
      yield put({
        type: 'update',
        payload: {
          referalRecords: items,
          referalPagination: {
            current: currentPage,
            total: totalNum,
          },
        },
      });
    },
    *receiveAllReferral({ payload }, { call, put }) {
      yield call(serv.receiveAllReferral);
      yield put({ type: 'pullReferralSummary' });
      yield put({ type: 'pullReferralRecords' });
    },
    // 其他获赠列表
    *query({ payload }, { put, call, select }) {
      const { filters } = yield select(state => state.bonus);
      const {
        items, currentPage, pageSize, totalNum,
      } = yield call(serv.getRewardsRecords, {
        ...filters,
        startAt: filters.startAt.valueOf(),
        endAt: filters.endAt.valueOf(),
      });
      const t = moment().valueOf();
      yield put({
        type: 'savePage',
        payload: {
          // 手动插入TableRowKey 避免重新拉取后数据未更新
          items: items ? items.map((v, i) => {
            return {
              ...v,
              index: `${t}-${i}`,
            };
          }) : [],
          currentPage,
          pageSize,
          totalNum,
        },
      });
    },
    *pullLastCoupon(_, { call, put }) {
      const { data } = yield call(serv.getLastCoupon);
      yield put({
        type: 'update',
        payload: {
          lastCouponInfo: data,
        },
      });
    },
    *pullMarginBonusStatus({ payload = {} }, { call, put }) {
      const { data } = yield call(serv.getMarginBonusStatus, payload);
      const { isUnReceive } = data || {};
      if (!isUnReceive) {
        yield [
          put({ type: 'pullLastCoupon' }),
        ];
      }
      yield put({
        type: 'update',
        payload: {
          marginBonusStatus: data,
        },
      });
    },
  },
  subscriptions: {
    setUpBouns({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullReferralRecords' },
      });
      dispatch({
        type: 'initFilters',
      });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'query' },
      });
    },
    // watchUser({ dispatch }) {
    //   dispatch({
    //     type: 'watchUser',
    //   });
    // },
    // @deprecated 逻辑迁移到 user/afterUserPulled
    // watchUser({ dispatch }) {
    //   dispatch({
    //     type: 'watchUser',
    //   });
    // },
  },
});
