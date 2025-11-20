/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import { maxPrecision } from 'config/base';
import extend from 'dva-model-extend';
import { createDecimals, numberFixed } from 'helper';
import _ from 'lodash';
import { EARN_ACCOUNT_TYPES } from 'routes/AssetsPage/EarnAccountV3/config';
import { getUserTotalBlance } from 'services/assets';
import {
  getAssetDetail,
  getAssetsOverview,
  getAutoEarnProducts,
  // getAssetCategory,
  getCommomSelectOptions,
  getCurrencies,
  getEarnCurrencies,
  getHisHoldAssets,
  // getStakingAssetsList,
  getHoldAssets,
  getStructStatus,
  pullAprsChartData,
  pullDayAprsChartData,
  unlock,
  getAutoEarnYearIncome,
  pullPaymentCoins,
} from 'services/earnAccount';
import { getSymbolTick } from 'services/market';
import message from 'tools/ext/message';
import precision from 'utils/precision';

const PAGE_SIZE = 10;
const filters = {
  page: 1,
  pageSize: PAGE_SIZE,
  category: [],
  currency: undefined,
  duration: undefined,
  type: EARN_ACCOUNT_TYPES[0], // current:当前持有，history：历史持有
};

const ButtonGroup = ['LOCKDROP', 'ETH2', 'NFT'];
const defaultCategory = [
  'DUAL',
  'DEMAND',
  'STAKING',
  'ACTIVITY',
  'POLKA_FUND',
  'MINING_POOL',
  'SHARKFIN_BASE',
  'KCS_STAKING',
  'SHARKFIN',
  'PROTECTIVE_EARN',
  'TWIN_WIN',
  'CONVERT_PLUS',
  'FUTURE_PLUS',
  'RANGE_BOUND',
  'DUAL_EXTRA',
  'DUAL_BOOSTER',
];

export default extend(base, {
  namespace: 'earnAccount',
  state: {
    currenciesList: [],
    baseCurrency: 'USDT',
    overview: {
      currency: '',
      total_value: '',
      yesterday_income: '',
      total_income: '',
      pol_total_income: '',
    },
    searchParams: {
      category: [],
      params: {},
    }, // todo这里的数据更新可以简单直接取获取table请求的参数
    tableInfo: {
      dataSource: [],
      pagination: {
        total: 0,
        pageSize: PAGE_SIZE,
        current: 1,
      },
    },
    filters,
    assetsOverview: {
      MAIN: {},
      MARGIN: {},
      TRADE: {},
    },
    assetCategory: [],
    chartData: [],
    earnCurrencies: [],
    detail: {},
    detailVisible: false,
    categoriesEarn: {},
    verifyModalData: {
      data: {},
      visible: false,
      title: '',
      effectCb: () => {},
    },
    singleCurrencyPrice: '',
    filterCategoryAll: [],
    prodductCategoryMap: {},
    autoEarnAllCoins: [],
    autoEarnIdMap: {},
    autoEarnAprMap: {},
    autoEarnOpen: false,
    autoEarnIsOn: false,
    autoEarnOnCoins: [],
    autoEarnYearIncome: {},
    maxApr: 0,
    initPaymentCoin: false,
    paymentSymbols: {},
  },
  reducers: {
    updateAssetCategory(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 获取概览信息
    *getAssetsOverview({ payload = { base_currency: 'USDT' } }, { put, call }) {
      const { data } = yield call(getAssetsOverview, payload);
      yield put({
        type: 'update',
        payload: {
          overview: { ...data },
          baseCurrency: data.currency,
        },
      });
    },
    *getAutoEarnAllCoins(_, { put, call }) {
      try {
        const res = yield call(getAutoEarnProducts, {
          product_category: 'DEMAND',
          product_type: 'SAVING',
          is_auto_lock: 1,
          order_by: 'apr_desc',
        });
        const { data = [], success = false, msg = '' } = res;
        if (!success) {
          message.error(msg);
        }
        const _idMaps = {};
        const _aprMaps = {};
        let _maxApr = 0;
        const _data = data?.map((i) => {
          _idMaps[i?.currency] = i?.product_id;
          _aprMaps[i?.currency] = i?.apr;
          _maxApr = +_maxApr < +i?.apr ? i?.apr : _maxApr;
          return i?.currency;
        });
        yield put({
          type: 'update',
          payload: {
            autoEarnAllCoins: _data,
            autoEarnIdMap: _idMaps,
            autoEarnAprMap: _aprMaps,
            maxApr: _maxApr,
          },
        });
      } catch (e) {
        let msg = e?.msg;
        message.error(msg);
      }
    },
    *getAutoEarnStatus(_, { put, call }) {
      try {
        const res = yield call(getAutoEarnProducts, {
          product_category: 'DEMAND',
          product_type: 'SAVING',
          user_auto_lock: 1,
        });
        const { data = [], success = false, msg = '' } = res;
        if (!success) {
          message.error(msg);
        }
        const _data = data?.map((i) => {
          return i?.currency;
        });
        yield put({
          type: 'update',
          payload: {
            autoEarnIsOn: !!data?.length,
            autoEarnOnCoins: _data,
          },
        });
      } catch (e) {
        let msg = e?.msg;
        message.error(msg);
      }
    },
    *getAutoEarnStatusNoCache({}, { put, call }) {
      try {
        const res = yield call(getAutoEarnProducts, {
          product_category: 'DEMAND',
          product_type: 'SAVING',
          is_auto_lock: 1,
        });
        const { data = [], success = false, msg = '' } = res;
        if (!success) {
          message.error(msg);
        }
        const _data = _.filter(data, ({ user_auto_lock }) => !!user_auto_lock);
        const coins = _.map(_data, ({ currency }) => currency);
        yield put({
          type: 'update',
          payload: {
            autoEarnIsOn: !!coins?.length,
            autoEarnOnCoins: coins,
          },
        });
      } catch (e) {
        let msg = e?.msg;
        message.error(msg);
      }
    },
    *changeAutoEarnOpen({ payload }, { put }) {
      const { visible } = payload;
      yield put({
        type: 'update',
        payload: {
          autoEarnOpen: visible,
        },
      });
    },
    *getAutoEarnYearIncome(_, { put, call }) {
      try {
        const res = yield call(getAutoEarnYearIncome);
        const { data = {}, success = false } = res;
        if (!success) {
        } else {
          yield put({
            type: 'update',
            payload: {
              autoEarnYearIncome: data,
            },
          });
        }
      } catch (e) {
        let msg = e?.msg;
        message.error(msg);
      }
    },

    // 设置 filter
    *updateFilters({ payload = {} }, { put, call, select }) {
      const filters = yield select((state) => state.earnAccount.filters);
      yield put({
        type: 'update',
        payload: {
          filters: {
            ...filters,
            ...payload,
          },
        },
      });
    },

    // 设置filter更新table
    *filters({ payload = {} }, { put, call, select }) {
      const filters = yield select((state) => state.earnAccount.filters);
      yield put({
        type: 'update',
        payload: {
          filters: {
            ...filters,
            ...payload,
          },
        },
      });
      yield put({
        type: 'getTableList',
      });
    },

    // 获取各table信息
    *getTableList({ payload = {} }, { put, call, select }) {
      const { page, category, currency, duration, type } = yield select(
        (state) => state.earnAccount.filters,
      );
      const newParams = {
        page: payload.page || 1,
        // ...filters,
        page,
        category,
        currency,
        duration,
        pageSize: PAGE_SIZE,
      };

      if (!newParams.currency) {
        delete newParams.currency;
      }

      // 默认值增加 矿工理财 MINING_POOL SHARKFIN_BASE category
      // 如果查询条件是ALL 查询条件需要带上 MINING_POOL SHARKFIN_BASE
      newParams.product_category =
        (newParams.category?.includes('ALL')
          ? defaultCategory.join(',')
          : _.filter(newParams.category || [], (n) => n !== 'ALL').join(',')) ||
        defaultCategory.join(',');
      newParams.duration = _.filter(newParams.duration || [], (n) => n !== 'ALL');
      if (newParams.duration.length > 1) {
        newParams.duration = undefined;
      } else {
        newParams.duration = newParams.duration[0];
      }
      const fetchFn = type === EARN_ACCOUNT_TYPES[0] ? getHoldAssets : getHisHoldAssets;
      const { items = [], totalNum = 0 } = yield call(fetchFn, newParams);

      yield put({
        type: 'update',
        payload: {
          tableInfo: {
            dataSource: items,
            totalNum,
            pagination: {
              total: totalNum,
              pageSize: PAGE_SIZE,
              current: newParams.page,
            },
          },
        },
      });

      // 更新searchParams
      yield put({
        type: 'update',
        payload: {
          searchParams: {
            type: newParams.category,
            params: {
              ...newParams,
            },
          },
        },
      });

      try {
        // 对于当前持有产品，如果有雪球产品，则需要单独获取雪球产品系列自动复投开关，并更新到 table 数据中
        if (type === EARN_ACCOUNT_TYPES[0]) {
          const orderIdList = items
            .filter(
              (i) =>
                i.product_type === 'PROTECTIVE_EARN' ||
                i.product_type === 'SHARKFIN' ||
                i.product_type === 'DUAL',
            )
            .map((item) => item.source_id);
          if (orderIdList.length) {
            const { data: reInvestStatus } = yield call(getStructStatus, orderIdList);
            const targetItems = items.map((item) => {
              if (
                item.product_type === 'PROTECTIVE_EARN' ||
                item.product_type === 'SHARKFIN' ||
                item.product_type === 'DUAL'
              ) {
                item[item.source].is_reinvestment_enabled =
                  reInvestStatus?.[item.source_id]?.isReinvestmentEnabled;
                item[item.source].is_reinvestment_update_enable =
                  reInvestStatus?.[item.source_id]?.isReinvestmentUpdateEnable;
              }
              return { ...item };
            });
            const { tableInfo } = yield select((state) => state.earnAccount);
            yield put({
              type: 'update',
              payload: {
                tableInfo: {
                  ...tableInfo,
                  dataSource: targetItems,
                },
              },
            });
          }
        }
      } catch (e) {
        message.error(e?.msg);
        console.error(e);
      }

      try {
        // 对于当前持有产品，如果有双向盈产品，需要单独读取是否可以提前赎回
        if (type === EARN_ACCOUNT_TYPES[0]) {
          const orderIdList = items
            .filter((i) => i.product_type === 'TWIN_WIN' || i.product_type === 'FUTURE_PLUS')
            .map((item) => item.source_id);
          if (orderIdList.length) {
            const { data: redeemStatus } = yield call(getStructStatus, orderIdList);
            const targetItems = items.map((item) => {
              if (item.product_type === 'TWIN_WIN' || item.product_type === 'FUTURE_PLUS') {
                item[item.source].is_early_redeem =
                  redeemStatus?.[item.source_id]?.earlyRedemptionState;
              }
              return { ...item };
            });
            const { tableInfo } = yield select((state) => state.earnAccount);
            yield put({
              type: 'update',
              payload: {
                tableInfo: {
                  ...tableInfo,
                  dataSource: targetItems,
                },
              },
            });
          }
        }
      } catch (e) {
        message.error(e?.msg);
        console.error(e);
      }
    },

    *setSearchParams({ payload = {} }, { put }) {
      yield put({
        type: 'update',
        payload: {
          searchParams: {
            ...payload,
          },
        },
      });
    },

    // 获取account各个账户对应币种的余额,用于划转选择账户
    *getAccountTotalBalance({ payload = {} }, { put, call }) {
      const { data } = yield call(getUserTotalBlance, payload);
      const { mainModel = {}, marginModel = {}, tradeModel = {} } = data;
      yield put({
        type: 'update',
        payload: {
          assetsOverview: {
            MAIN: mainModel,
            MARGIN: marginModel,
            TRADE: tradeModel,
          },
        },
      });
    },

    // 赎回
    *unlock({ payload }, { call }) {
      try {
        const { password, lock_id, amount } = payload;
        const result = yield call(unlock, {
          password,
          lock_id,
          amount,
        });
        return result;
      } catch (e) {
        // status 404 处理response中的msg
        let msg = e.msg;
        if (e.response) {
          const json = yield e.response.json();
          msg = json.msg;
        }
        if (msg) message.error(msg);
        return e;
      }
    },
    // 获取account各个账户对应币种的余额,用于划转选择账户
    *getCurrencies({ payload = {} }, { put, call }) {
      const { data = [] } = yield call(getCurrencies, payload);
      const map = {};
      _.each(data, (item) => {
        item.precision = parseInt(item.precision || maxPrecision, 10);
        precision(item.coin, item.precision);
        const newItem = {
          ...item,
          key: item.currency,
          coin: item.currency,
          // icon: `${ASSETS_PATH}/${item.currency}.png`,
          step: numberFixed(1 / Math.pow(10, item.precision)),
          decimals: createDecimals(item.precision),
          shortDisplayPrecision: +item.shortDisplayPrecision || item.precision,
        };
        map[item.currency] = newItem;
      });

      yield put({
        type: 'update',
        payload: {
          currenciesList: data,
          categoriesEarn: map || {},
        },
      });
    },

    // 产品种类列表-对应账户首页的tabs
    *getAssetCategory({ payload = {} }, { put, call, select }) {
      const searchParams = yield select((state) => state.earnAccount.searchParams);
      const newParams = { ...payload };
      if (!newParams.scene) {
        newParams.scene = 'user_his_assets';
      }
      const {
        data: { product_category = [] },
      } = yield call(getCommomSelectOptions, { ...newParams });
      // const pastAssetCategory = yield select((state) => state.earnAccount.assetCategory);
      const productCategoryList = _.map(product_category, ({ value, name }) => ({
        category: value,
        i18n: name,
      }));
      // todo 单独新增NFT
      productCategoryList.push({
        category: 'NFT',
        i18n: 'NFT',
      });

      yield put({
        type: 'update',
        payload: {
          assetCategory: productCategoryList,
          prodductCategoryMap: _.keyBy(product_category, 'value'),
        },
      });
      // yield put({
      //   type: 'filters',
      //   payload: {
      //     category: _.filter(
      //       ['ALL', ..._.map(productCategoryList, (item) => item.category)],
      //       (item) => !ButtonGroup.includes(item),
      //     ),
      //   },
      // });
      const filters = yield select((state) => state.earnAccount.filters);
      // 初始化选择所有可选产品
      const filterCategoryAll = _.filter(
        ['ALL', ..._.map(productCategoryList, (item) => item.category)],
        (item) => !ButtonGroup.includes(item),
      );
      const filterCategory = filters?.category;
      yield put({
        type: 'update',
        payload: {
          filters: {
            ...filters,
            // category: _.filter(
            //   ['ALL', ..._.map(productCategoryList, (item) => item.category)],
            //   (item) => !ButtonGroup.includes(item),
            // ),
            category: filterCategory && filterCategory?.length ? filterCategory : filterCategoryAll,
          },
          filterCategoryAll: filterCategoryAll,
        },
      });
    },

    // 清楚table数据
    *clearTableInfo(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          tableInfo: {
            dataSource: [],
            pagination: {
              total: 0,
              pageSize: PAGE_SIZE,
              current: 1,
            },
          },
          filters,
        },
      });
    },

    // tab切换重置条件
    *resetTableParams(_, { put, select }) {
      const filters = yield select((state) => state.earnAccount.filters);
      const filterCategoryAll = yield select((state) => state.earnAccount.filterCategoryAll);

      yield put({
        type: 'update',
        payload: {
          tableInfo: {
            dataSource: [],
            pagination: {
              total: 0,
              pageSize: PAGE_SIZE,
              current: 1,
            },
          },
          filters: {
            ...filters,
            // category: ['ALL'],// todo
            category: filterCategoryAll,
            page: 1,
            pageSize: PAGE_SIZE,
            duration: undefined,
          },
        },
      });
    },

    //   活期赚币七日年化数据，走势图.
    *pullAprsChartData({ id, params }, { put, call }) {
      try {
        const { data } = yield call(pullAprsChartData, { id, params });
        yield put({
          type: 'update',
          payload: {
            chartData: data,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            chartData: [],
          },
        });
      }
    },

    *pullDayAprsChartData({ id, params }, { put, call }) {
      try {
        const { data } = yield call(pullDayAprsChartData, { id, params });
        yield put({
          type: 'update',
          payload: {
            chartData: data,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            chartData: [],
          },
        });
      }
    },

    /**
     * 持仓产品详情
     * @param {number} id
     * @returns
     */

    *getAssetDetail({ payload = {} }, { put, call }) {
      const { data } = yield call(getAssetDetail, payload);
      yield put({
        type: 'update',
        payload: {
          detail: data,
        },
      });
      return data || [];
    },

    *clearAprsChartData(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          chartData: [],
        },
      });
    },

    // 获取支持賺币币种
    *getEarnCurrencies(_, { put, call }) {
      const { data } = yield call(getEarnCurrencies);
      yield put({
        type: 'update',
        payload: {
          earnCurrencies: data || [],
        },
      });
    },

    *setVerifyModalData({ payload = {} }, { put }) {
      yield put({
        type: 'update',
        payload: {
          verifyModalData: { ...payload },
        },
      });
    },

    *resetVerifyModalData(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          verifyModalData: {
            data: {},
            visible: false,
            title: '',
            effectCb: () => {},
          },
        },
      });
    },
    // 获取当前价格--详情查询单个交易对，后续需要再支持轮训
    *getSingleCurrencyPrice({ payload: { symbols } }, { put, call }) {
      const { data = [] } = yield call(getSymbolTick, { symbols });
      //  这里详情只会查询单个交易对，所以只需要取第一个；
      const records = _.get(data, '[0]', {});
      yield put({
        type: 'update',
        payload: {
          singleCurrencyPrice: _.get(records, 'lastTradedPrice', ''),
        },
      });
    },

    *pullPaymentCoins({ payload = {} }, { call, put, select }) {
      const initPaymentCoin = yield select((state) => state.earnAccount.initPaymentCoin);
      if (initPaymentCoin) return;
      const { data } = yield call(pullPaymentCoins, payload);
      yield put({
        type: 'update',
        payload: {
          paymentSymbols: data?.symbols || {},
          initPaymentCoin: true,
        },
      });
    },
  },

  subscriptions: {
    setUp({ dispatch }) {
      dispatch({ type: 'getCurrencies' });
    },
  },
});
