/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { maxPrecision } from 'config/base';
import moment from 'moment';
import pagination from 'common/models/paginate';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import * as serv from 'services/bonus';
import { getBorrowMultiple } from 'services/margin';
import waitFor from 'utils/waitForSaga';

const assetType = 'BTC';

export default extend(base, pagination, filter, polling, {
  namespace: 'bonus',
  state: {
    referralBonusOverview: {},
    // 邀请奖励相关
    referral: {
      totalAmount: null,
      yesterdayAmount: null,
      totalUsers: null,
      unreceive: null,
      inviteNumber: null,
      currency: null,
    },
    userYesterdayIncome: null,
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
    targetLendInfo: {},
    targetLendStatus: {},
    marginMulti: 0,
    marginBonusStatus: {},
    marginBonusList: [],
    marginBonusPagination: {},
    inviteCode: '',
    marginPosition: {},
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
    updateTargetLendInfo(state, { payload = {} }) {
      return {
        ...state,
        targetLendInfo: {
          ...state.targetLendInfo,
          ...payload,
        },
      };
    },
  },
  effects: {
    *pullOverview(a, { call, put, select }) {
      const { data } = yield call(serv.getOverview);
      const { referral, KCSBonus, rewards } = yield select((state) => state.bonus);
      const _referral = data.find((v) => v.type === 'INVITATION_REWARD');
      const _KCSBonus = data.find((v) => v.type === 'ENCOURAGEMENT');
      const _rewards = data.find((v) => v.type === 'OTHER_REWARD');
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
    *pullBonusSummary(a, { call, put, select }) {
      const { data } = yield call(serv.getBonusSummary);
      const { KCSBonus } = yield select((state) => state.bonus);
      const { undrawCount, holdAmount, currentHoldAmount, precision } = data;
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
    *receiveAllBonus(a, { call, put }) {
      yield call(serv.receiveAllBonus);
      yield put({ type: 'pullSummary' });
      yield put({ type: 'pullBonusRecords' });
    },
    // 鼓励金分页列表
    *pullBonusRecords({ payload: { current = 1, pageSize = 10 } }, { put, call }) {
      const { items, currentPage, totalNum, ...rest } = yield call(serv.getBonusRecords, {
        pageSize,
        page: current,
      });
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
    *pullReferralSummary(a, { call, put, select }) {
      const { data } = yield call(serv.getReferralTotal, { assetType });
      const { referral } = yield select((state) => state.bonus);
      referral.unreceive = data.waitReceiveNumber;
      referral.inviteNumber = data.inviteNumber;

      yield put({
        type: 'update',
        payload: {
          referral: { ...referral },
        },
      });
    },
    *pullReferralUserCount(a, { call, put }) {
      const { data } = yield call(serv.getReferralUserCount);
      yield put({
        type: 'update',
        payload: {
          referralUsers: data,
        },
      });
    },
    *pullUserYesterdayIncome(a, { call, put }) {
      const { success, data } = yield call(serv.getUserYesterdayIncome);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            userYesterdayIncome: data,
          },
        });
      }
    },
    *pullReferralRecords(a, { call, put, select }) {
      const { filters } = yield select((state) => state.bonus);
      const { items, currentPage, totalNum } = yield call(serv.getReferralRecords, {
        page: filters.currentPage,
        pageSize: 10,
      });
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
    *receiveAllReferral(a, { call, put }) {
      yield call(serv.receiveAllReferral);
      yield put({ type: 'pullReferralSummary' });
      yield put({ type: 'pullReferralRecords' });
    },
    // 其他获赠列表
    *query(a, { put, call, select }) {
      const { filters } = yield select((state) => state.bonus);
      const { items, currentPage, pageSize, totalNum } = yield call(serv.getRewardsRecords, {
        ...filters,
        startAt: filters.startAt.valueOf(),
        endAt: filters.endAt.valueOf(),
      });
      const t = moment().valueOf();
      yield put({
        type: 'savePage',
        payload: {
          // 手动插入TableRowKey 避免重新拉取后数据未更新
          items: items
            ? items.map((v, i) => {
                return {
                  ...v,
                  index: `${t}-${i}`,
                };
              })
            : [],
          currentPage,
          pageSize,
          totalNum,
        },
      });
    },
    *pullTargetLendInfo({ payload = {} }, { call, put, select }) {
      const { targetLendInfo } = yield select((state) => state.bonus);
      if (!targetLendInfo?.id) return;
      const serviceFn = payload.symbol ? serv.getIsolatedTargetLendInfo : serv.getTargetLendInfo;
      const { data } = yield call(serviceFn, { activityId: targetLendInfo.id, ...payload });
      yield put({
        type: 'updateTargetLendInfo',
        payload: data,
      });
    },
    *pullMarginPosition({ payload = {} }, { call, put, select }) {
      const { marginPosition } = yield select((state) => state.bonus);
      const { balanceCurrency } = yield select((state) => state.user);
      const key = payload.symbol ?? 'margin';
      const serviceFn = payload.symbol ? serv.getIsolatedPosition : serv.getCrossPosition;
      const { data } = yield call(serviceFn, { balanceCurrency, ...payload });
      yield put({
        type: 'update',
        payload: {
          marginPosition: {
            ...marginPosition,
            [key]: {
              status: data.status,
              totalBalance: data.totalBalance || 0,
              liabilityRate: data.liabilityRate || 0,
              balanceCurrency: data.balanceCurrency,
            },
          },
        },
      });
    },
    *borrowTargetLend({ payload = {} }, { call }) {
      const serviceFn = payload.symbol ? serv.borrowIsolatedTargetLend : serv.borrowTargetLend;
      let result;
      try {
        result = yield call(serviceFn, payload);
      } catch (e) {
        result = e;
      }
      return result;
    },
    *referralBonusOverview({ payload = {} }, { call, put }) {
      const { data } = yield call(serv.referralBonusOverview, payload);
      yield put({
        type: 'update',
        payload: {
          referralBonusOverview: data,
        },
      });
    },
    *pullTargetStatus({ payload = {} }, { call, put }) {
      const { data } = yield call(serv.getTargetLendStatus, payload);
      yield put({
        type: 'update',
        payload: {
          targetLendStatus: data,
        },
      });
    },
    *getMarginMulti({ payload = {}, callback }, { call, put }) {
      const serviceFn = payload.symbol ? serv.getBorrowMultiple : getBorrowMultiple;
      const { data } = yield call(serviceFn, payload);
      yield put({
        type: 'update',
        payload: {
          marginMulti: data,
        },
      });
      if (typeof callback === 'function') callback(data);
    },
    *pullMarginBonusStatus({ payload = {} }, { call, put }) {
      const { data } = yield call(serv.getMarginBonusStatus, payload);
      yield put({
        type: 'update',
        payload: {
          marginBonusStatus: data,
        },
      });
      return data;
    },
    *pullMarginBonusList({ payload = {} }, { call, put }) {
      const { items, totalNum, currentPage } = yield call(serv.getMarginBonusList, payload);
      yield put({
        type: 'update',
        payload: {
          marginBonusList: items || [],
          marginBonusPagination: {
            count: totalNum,
            page: currentPage - 1 > 0 ? currentPage - 1 : 0,
          },
        },
      });
    },
    *receiveMarginBonus({ payload = {} }, { call }) {
      const res = yield call(serv.receiveMarginBonus, payload);
      return res;
    },
    // 获取邀请码
    *getInviteCode(_, { call, put }) {
      const { data } = yield call(serv.getInvitationCode);
      yield put({
        type: 'update',
        payload: {
          inviteCode: data,
        },
      });
    },
    *watchUser(action, { select, put, take, call }) {
      yield call(waitFor, (state) => !!state.user.user, { select, take });
      yield put({
        type: 'bonus/pullReferralSummary',
      });
      yield put({
        type: 'bonus/pullBonusSummary',
      });
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
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
      dispatch({
        type: 'watchUser',
      });
    },
  },
});
