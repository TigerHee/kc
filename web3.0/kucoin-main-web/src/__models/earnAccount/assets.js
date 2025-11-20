/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
// import { formatNumber, add } from 'helper';
import moment from 'moment';

import {
  getCommomSelectOptions,
  // getAssetsTable,
  getAccountBills,
  getEarnIncomes,
  getUserPol,
  getOrderTxs,
  // getDualOrderHistory,
  // getDualAssetsTable,
} from 'services/earnAccount';
import { filter, keyBy, map } from 'lodash';
import { getLoanTradeFlowList } from 'services/earnAccount';

// 双币类型
const DUAL = 'DUAL';
const LENDING = 'LENDING';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const dealTimer = (timer) => {
  return typeof timer === 'string' ? moment(timer).valueOf() : timer.valueOf();
};
// 校验时间区间
const verifyDate =
  (limit = '1', format = 'y') =>
  (start, end) => {
    if (moment(start).add(limit, format).isBefore(moment(end).add(-1, 'd'))) {
      return false;
    }
    return true;
  };

export const LOAN_TO_EARN = {
  LOAN_B2C_PURCHASE: 'LOCK',
  LOAN_B2C_REDEEM: 'REDEEM',
  LOAN_B2C_INTEREST_RECEIVE: 'INCOME',
};

export const EARN_TO_LOAN = {
  LOCK: 'LOAN_B2C_PURCHASE',
  REDEEM: 'LOAN_B2C_REDEEM',
  INCOME: 'LOAN_B2C_INTEREST_RECEIVE',
};

// map 订单
export const LOAN_TO_EARN_ORDER = {
  LOAN_B2C_PURCHASE: 'LOCK_SUCCESS',
  LOAN_B2C_REDEEM: 'REDEEM_SUCCESS',
  // LOAN_B2C_INTEREST_RECEIVE: 'INCOME',
};

export const EARN_TO_LOAN_ORDER = {
  LOCK_SUCCESS: 'LOAN_B2C_PURCHASE',
  REDEEM_SUCCESS: 'LOAN_B2C_REDEEM',
  // LOAN_B2C_INTEREST_RECEIVE: 'INCOME',
};

function convertLendToEarnTradeFlow(data = [], category_text) {
  return map(data, (d, idx) => {
    const { bizType, tradeDate, currencyName, currency } = d;
    return {
      ...d,
      category_text,
      product_category: LENDING,
      biz_type: LOAN_TO_EARN[bizType],
      source: LENDING,
      source_created_at: tradeDate,
      created_at: tradeDate,
      side: bizType === 'LOAN_B2C_REDEEM' ? -1 : 1,
      product_name: currencyName,
      fee: '0',
      order_tx_status: LOAN_TO_EARN_ORDER[bizType],
      id: `${idx}_${currency}_${tradeDate}`,
    };
  });
}

const initFilters = {
  currency: '',
  bizType: '',
  // direction: '',
  productCategory: '',
  orderStatus: '',
  startAt: moment(`${moment().subtract(1, 'month').format('YYYY-MM-DD')} 00:00:00`),
  endAt: moment(`${moment().format('YYYY-MM-DD')} 23:59:59`),
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export default extend(base, {
  namespace: 'earnAccount-assets',
  state: {
    bizTypeList: {},
    productCategory: {},
    orderStatus: {},
    assetsTableInfo: {
      records: [],
      pagination: {
        total: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        current: 1,
      },
    },
    polTableInfo: {
      records: [],
      pagination: {
        total: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        current: 1,
      },
    },
    historyTableInfo: {
      records: [],
      pagination: {
        total: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        current: 1,
      },
    },
    filters: { ...initFilters },
    // staking计算出来的pol
    polTotal: '',
    overview: {
      yesterday_income: '',
      total_income: '',
      to_release_income: '',
    },
    messageInfo: {
      type: '',
      text: '',
      flag: '',
    },
  },
  reducers: {
    updateFilters(state, { payload }) {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...payload,
        },
      };
    },
    resetFilters(state) {
      return {
        ...state,
        filters: {
          ...initFilters,
        },
      };
    },
  },
  effects: {
    // 筛选项
    *getFilterList({ payload = {} }, { put, call, select }) {
      const { query, ..._payload } = payload;
      const { filters } = yield select((state) => state['earnAccount-assets']);
      const { data } = yield call(getCommomSelectOptions, _payload);
      let { product_category = [], biz_type = {}, order_tx_status = {} } = data;
      product_category = filter(product_category, (d) => d.value !== 'ETH2') || [];
      let firstValue = product_category[0]?.value || undefined;
      const mapCategory = keyBy(product_category, 'value');
      yield put({
        type: 'update',
        payload: {
          bizTypeList: biz_type,
          productCategory: product_category,
          orderStatus: order_tx_status,
          filters: {
            ...filters,
            productCategory: query?.productCategory || firstValue,
          },
          mapCategory,
        },
      });
      return firstValue;
    },

    // 总资产明细列表
    *getAssetsTable({ payload = {} }, { put, call, select }) {
      const { filters, mapCategory } = yield select((state) => state['earnAccount-assets']);
      const {
        productCategory: p_productCategory,
        bizType: p_bizType,
        currency: p_currency,
        startAt,
        endAt,
        page,
      } = payload;
      const args = {
        type: 0, // 表示web端调用
        // ...filters,
        // ...payload,
        startAt: startAt ? dealTimer(startAt) : dealTimer(filters.startAt),
        endAt: endAt ? dealTimer(endAt) : dealTimer(filters.endAt),
        page: page || DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      };
      // todo 判断时间选择区间最大为1年
      if (!verifyDate()(startAt, endAt)) {
        // message.error("选择的时间间隔最大为一年！")
        yield put({
          type: 'update',
          payload: {
            messageInfo: {
              type: 'error',
              text: '选择的时间间隔最大为一年！',
              flag: Date.now(),
            },
          },
        });
        return;
      }
      const { productCategory, bizType, currency } = filters;

      if (p_productCategory) {
        args.product_category = p_productCategory;
      } else if (p_productCategory === undefined && productCategory) {
        args.product_category = productCategory;
      }
      if (p_bizType) {
        args.biz_type = p_bizType;
      } else if (p_bizType === undefined && bizType) {
        args.biz_type = bizType;
      }
      if (p_currency) {
        args.currency = p_currency;
      } else if (p_currency === undefined && currency) {
        args.currency = currency;
      }

      yield put({
        type: 'updateFilters',
        payload: {
          ...payload,
        },
      });
      // 闲币赚息
      let items = [];
      let totalNum = 0;
      const isLending = args.product_category === LENDING;
      if (isLending) {
        args.biz_type = EARN_TO_LOAN[args.biz_type] || args.biz_type;
        let { data } = yield call(getLoanTradeFlowList, args);
        items = convertLendToEarnTradeFlow(data.items, mapCategory[LENDING]?.name);
        totalNum = data.totalNum;
      } else {
        const result = yield call(getAccountBills, args);
        items = result.items;
        totalNum = result.totalNum;
      }

      yield put({
        type: 'update',
        payload: {
          assetsTableInfo: {
            records: items,
            pagination: {
              total: totalNum,
              pageSize: args.pageSize,
              current: args.page,
            },
          },
        },
      });
    },
    // pol明细列表
    *getUserPolDetail({ payload = {} }, { put, call, select }) {
      const { filters } = yield select((state) => state['earnAccount-assets']);
      const { productCategory: p_productCategory, startAt, endAt, page } = payload;
      const args = {
        type: 'POL_INCOME',
        // productCategory: payload.productCategory || filters.productCategory,
        startAt: startAt ? dealTimer(startAt) : dealTimer(filters.startAt),
        endAt: endAt ? dealTimer(endAt) : dealTimer(filters.endAt),
        page: page || DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      };
      // todo 判断时间选择区间最大为1年
      if (!verifyDate()(startAt, endAt)) {
        // message.error("选择的时间间隔最大为一年！")
        yield put({
          type: 'update',
          payload: {
            messageInfo: {
              type: 'error',
              text: '选择的时间间隔最大为一年！',
              flag: Date.now(),
            },
          },
        });
        return;
      }

      const { productCategory } = filters;
      if (p_productCategory) {
        args.product_category = p_productCategory;
      } else if (p_productCategory === undefined && productCategory) {
        args.product_category = productCategory;
      }
      yield put({
        type: 'updateFilters',
        payload: {
          ...payload,
        },
      });
      const { items, totalNum } = yield call(getEarnIncomes, args);
      yield put({
        type: 'update',
        payload: {
          polTableInfo: {
            records: items,
            pagination: {
              total: totalNum,
              pageSize: args.pageSize,
              current: args.page,
            },
          },
        },
      });
    },
    // 历史订单
    *getOrderHistory({ payload = {} }, { put, call, select }) {
      const { filters, mapCategory } = yield select((state) => state['earnAccount-assets']);
      const {
        productCategory: p_productCategory,
        orderStatus: p_orderStatus,
        currency: p_currency,
        startAt,
        endAt,
        page,
      } = payload;
      const args = {
        // type: 0, // 表示web端调用
        // currency: payload.currency || filters.currency,
        // category: payload.productCategory || filters.productCategory,
        // order_status: payload.orderStatus || filters.orderStatus,
        startAt: startAt ? dealTimer(startAt) : dealTimer(filters.startAt),
        endAt: endAt ? dealTimer(endAt) : dealTimer(filters.endAt),
        page: page || DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      };
      // todo 判断时间选择区间最大为1年
      if (!verifyDate()(startAt, endAt)) {
        // message.error("选择的时间间隔最大为一年！")
        yield put({
          type: 'update',
          payload: {
            messageInfo: {
              type: 'error',
              text: '选择的时间间隔最大为一年！',
              flag: Date.now(),
            },
          },
        });
        return;
      }
      const { productCategory, orderStatus, currency } = filters;

      if (p_currency) {
        args.currency = p_currency;
      } else if (p_currency === undefined && currency) {
        args.currency = currency;
      }
      if (p_productCategory) {
        args.product_category = p_productCategory;
      } else if (p_productCategory === undefined && productCategory) {
        args.product_category = productCategory;
      }
      if (p_orderStatus) {
        args.order_tx_status = p_orderStatus;
      } else if (p_orderStatus === undefined && orderStatus) {
        args.order_tx_status = orderStatus;
      }
      yield put({
        type: 'updateFilters',
        payload: {
          ...payload,
        },
      });
      // 闲币赚息
      let items = [];
      let totalNum = 0;
      // 如果是借贷
      const isLending = args.product_category === LENDING;
      if (isLending) {
        // 处理参数
        args.biz_type = args.order_tx_status
          ? EARN_TO_LOAN_ORDER[args.order_tx_status] || args.order_tx_status
          : 'LOAN_B2C_PURCHASE,LOAN_B2C_REDEEM';
        args.order_tx_status = undefined;
        let { data } = yield call(getLoanTradeFlowList, args);
        items = convertLendToEarnTradeFlow(data.items, mapCategory[LENDING]?.name);
        totalNum = data.totalNum;
      } else {
        const result = yield call(getOrderTxs, args);
        items = result.items;
        totalNum = result.totalNum;
      }
      yield put({
        type: 'update',
        payload: {
          historyTableInfo: {
            records: items,
            pagination: {
              total: totalNum,
              pageSize: args.pageSize,
              current: args.page,
            },
          },
        },
      });
    },
    // 获取概览信息
    *getUserPol({ payload = {} }, { put, call }) {
      const { data } = yield call(getUserPol, payload);
      yield put({
        type: 'update',
        payload: {
          overview: { ...data },
        },
      });
    },
  },
});
