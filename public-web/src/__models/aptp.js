/**
 * Owner: solarxia@kupotech.com
 */
// import { message } from '@kux/mui';
import base from 'common/models/base';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import { cryptoPwd } from 'helper';
import { map } from 'lodash';
import moment from 'moment';
import {
  agreeBreakOrder,
  applyBreakOrder,
  cancelGreyMarketOrder,
  createGreyMarketOrder,
  createSplitMarketOrder,
  pullActivities,
  pullAllCurrencies,
  pullChartInfo,
  pullCurrencyInfo,
  pullDeliveryProgress,
  pullFinishedOrders,
  pullGreyMarketOrders,
  pullMineOfGreyMarketOrder,
  pullPriceChart,
  pullPriceInfo,
  pullSplitInfo,
  pullSupportBreakContractTime,
  pullTaxInfo,
  pullTaxTips,
  pullUserDealTotal,
  rejectBreakOrder,
  takeGreyMarketOrder,
} from 'services/aptp';
import { getUserSingleBlance } from 'services/assets';
import { verify } from 'services/ucenter/security';
import { getSeMethod } from 'src/services/security';
import { getUserFlag } from 'utils/user';
import { skip2Login } from '../components/Premarket/util';

const emptyArr = [];
const emptyObj = {};
const initialPagination = {
  // 后端用currentPage, table组件用current，models里统一都使用currentPage
  currentPage: 1,
  pageSize: 10,
};
const initialFilter = {
  ownOrder: false,
  maxAmount: null,
  minAmount: null,
  sortFields: null,
  sortValue: null,
  // 这里是相反的，想买需要查卖的挂单
  side: 'sell',
  ...initialPagination,
};
const initialConfirmInfo = {
  open: false,
  content: '',
  title: '',
  buttonText: '',
  buttonAction: () => {},
};
const initialMyOrderFilter = {
  baseCurrency: null,
  isActive: true,
  side: null,
  displayStatus: null,
  ...initialPagination,
};

const initialCurrencyInfo = {
  offerCurrency: null,
  tradeStartAt: null,
  tradeEndAt: null,
  deliveryTime: null,
  pledgeRate: null,
  buyMakerFeeRate: null, // 买方maker费率
  buyTakerFeeRate: null, // 买方taker费率
  sellMakerFeeRate: null, // 卖方maker费率
  sellTakerFeeRate: null, // 卖方taker费率
  introDetail: null,
  websiteLink: null,
  logo: null,
  priceIncrement: null,
  sizeIncrement: null,
  id: null,
  buyMakerMaxFee: 0, // 买方maker最大手续费
  buyTakerMaxFee: 0, // 买方taker最大手续费
  sellMakerMaxFee: 0, // 卖方maker最大手续费
  sellTakerMaxFee: 0, // 卖方taker最大手续费
};
export default extend(base, polling, {
  namespace: 'aptp',
  state: {
    records: [],
    // pagination: { ...initialPagination, totalNum: 0 },
    // 过滤条件
    filter: initialFilter,
    // 后端用totalNum，table分页用total，此参数不做入参，models中用total
    totalNum: 0,
    // 挂单tab选中的类型
    buyOrSell: 1,
    deliveryCurrencyList: [],
    ongoingCurrencyList: [],
    // 交割币种id
    deliveryCurrencyId: null,
    // 交割币种shortName
    deliveryCurrency: null,
    // 交割币种信息
    deliveryCurrencyInfo: {},
    postOrderType: 1,
    // 挂单或吃单弹窗里的信息
    modalInfo: {
      visible: false,
      side: 'buy',
      postOrTake: 0,
      // 被吃单的单的id
      id: -1,
    },
    // 我的订单表格内容
    myOrderRecords: [],
    // 我的订单筛选条件
    myOrderFilter: initialMyOrderFilter,
    // 我的订单的数据分页总数
    myOrderTotalNum: 0,
    // 我的订单的活动的数据总数
    myOrderActivedTotalNum: 0,
    // myOrderPagination: { ...initialPagination, total: 0 },
    // 挂单入参
    createOrderParams: {
      // funds: null,
      price: null,
      size: null,
    },
    // 用户相关
    user: {
      availableBalance: 0,
    },
    // 活动状态 0 未开始 1 正在进行 2 已结束
    activityStatus: 1,
    // 全局的二次确认弹窗
    confirmInfo: initialConfirmInfo,
    // 获取是否设置过交易密码的配置
    hasTransactionPasswordSet: false,
    // 币种价格信息
    priceInfo: {
      latestPrice: null, // 最新成交价
      minSellPrice: null, // 最低卖出挂单价
      maxBuyPrice: null, // 最高买入挂单价
      avgPrice: null, // 平均成交价
    },
    // 拆单信息
    splitInfo: {},
    enableSplit: false,
    // 税费信息
    taxInfo: {},
    // 税费提示
    taxTips: undefined,
    // 用户挂单统计
    userDealTotal: {
      buyMatchVol: 0,
      buySettleVol: 0,
      dealTotalVol: 0,
      sellMatchVol: 0,
      sellSettleVol: 0,
    },
    // 用户挂单统计
    deliveryProgress: {
      deliveryPercent: 0,
      deliveryVol: 0,
    },
    applyCancelModalInfo: {
      visible: false,
      record: null,
    },
    reviewCancelModalInfo: {
      visible: false,
      record: null,
    },
    shareModal: '', // 分享组件没有关闭回调函数，需要使用Math.random()控制
    shareInfo: {},
    ongoingList: {
      // 进行中列表
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      totalPage: 0,
      items: undefined,
    },
    historyList: {
      // 历史列表
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      totalPage: 0,
      items: undefined,
    },
    historyListSymbol: '', // 历史列表过滤条件
    supportBreakContractTime: -1, // 支持违约功能的时间（对比币种的开始时间，在此之前的币种保留违约功能）
  },
  reducers: {},
  effects: {
    // 获取所有活动中的币种
    *pullAllCurrencies(__, { call, put }) {
      const { data: deliveryCurrencyList = [] } = yield call(pullAllCurrencies);
      yield put({
        type: 'update',
        payload: {
          deliveryCurrencyList,
        },
      });
    },
    // 获取币种信息(deliveryCurrencyId必传)
    pullCurrencyInfo: [
      function* ({ payload = { deliveryCurrencyId: null } }, { put, select, call }) {
        const { deliveryCurrencyId } = payload;
        const { data: deliveryCurrencyInfo } = yield call(pullCurrencyInfo, {
          currentPage: initialPagination.currentPage,
          pageSize: initialPagination.pageSize,
          id: deliveryCurrencyId,
        });
        const { tradeEndAt, tradeStartAt } = deliveryCurrencyInfo;
        const isActivityEnd = moment(tradeEndAt * 1000).isBefore(moment());
        const isActivityNotStarted = moment(tradeStartAt * 1000).isAfter(moment());
        const deliveryCurrencyList = yield select((state) => state.aptp.deliveryCurrencyList);
        const deliveryCurrency = deliveryCurrencyList.find(
          (dc) => dc.id === payload.deliveryCurrencyId,
        )?.shortName;

        yield put({
          type: 'update',
          payload: {
            deliveryCurrencyInfo,
            deliveryCurrency,
            deliveryCurrencyId,
            activityStatus: isActivityEnd ? 2 : isActivityNotStarted ? 0 : 1,
          },
        });
      },
      { type: 'takeLatest' },
    ],
    *resetCurrencyInfo({ payload }, { put, select }) {
      yield put({
        type: 'update',
        payload: {
          deliveryCurrencyInfo: initialCurrencyInfo,
          deliveryCurrency: null,
          deliveryCurrencyId: null,
          activityStatus: 1,
        },
      });
    },
    // 改变查询入参
    *updateFilterCondition({ payload }, { put, select }) {
      const { triggerSearch, resetFilter, ...filterCondition } = payload;
      // 清空表格数据
      yield put({
        type: 'update',
        payload: {
          records: [],
        },
      });
      const side = yield select((state) => state.aptp.filter.side);
      // 检测是否登录、未登录跳转到登录页
      const user = yield select((state) => state.user.user);
      if ('ownOrder' in filterCondition) {
        if (!user) {
          skip2Login();
          return;
        }
      }
      if (resetFilter) {
        yield put({
          type: 'update',
          payload: {
            filter: {
              ...initialFilter,
              side,
            },
          },
        });
      } else {
        const filter = yield select((state) => state.aptp.filter);
        yield put({
          type: 'update',
          payload: {
            filter: {
              ...filter,
              ...filterCondition,
            },
          },
        });
      }
      if (triggerSearch) {
        yield put({
          type: 'pullGreyMarketOrders',
        });
      }
    },
    // 吃单不需要传side, 需要传当前第几条records并带入到弹框中回显
    *openTakeModal({ payload }, { put, select }) {
      let side = yield select((state) => state.aptp.filter.side);
      side = side === 'buy' ? 'sell' : 'buy';
      // 检测是否登录、未登录跳转到登录页
      const user = yield select((state) => state.user.user);
      if (!user) {
        skip2Login();
        return;
      }
      yield put({
        type: 'update',
        payload: {
          modalInfo: {
            visible: true,
            side,
            postOrTake: 1,
            id: payload.id,
          },
        },
      });
    },
    *closeTakeModal(_, { put, select }) {
      const { side } = yield select((state) => state.aptp.modalInfo);
      yield put({
        type: 'update',
        payload: {
          modalInfo: {
            visible: false,
            side,
            postOrTake: 1,
            id: -1,
          },
        },
      });
    },
    *openPostModal({ payload = { side: 'buy' } }, { put, select }) {
      // 检测是否登录、未登录跳转到登录页
      const user = yield select((state) => state.user.user);
      if (!user) {
        skip2Login();
        return;
      }
      yield put({
        type: 'update',
        payload: {
          modalInfo: {
            visible: true,
            side: payload.side,
            postOrTake: 0,
            id: -1,
          },
        },
      });
    },
    *closePostModal(_, { put, select }) {
      const { side } = yield select((state) => state.aptp.modalInfo);
      yield put({
        type: 'update',
        payload: {
          modalInfo: {
            side,
            visible: false,
            postOrTake: 0,
            id: -1,
          },
        },
      });
    },
    *pullGreyMarketOrders(_, { call, put, select }) {
      const filter = yield select((state) => state.aptp.filter);
      const deliveryCurrency = yield select((state) => state.aptp.deliveryCurrency);
      const offerCurrency = yield select((state) => state.aptp.deliveryCurrencyInfo.offerCurrency);
      // 这里如果side是finished，则请求已完成订单接口
      const side = yield select((state) => state.aptp.filter.side);

      if (!deliveryCurrency) {
        return;
      }

      let requestParams;
      if (side === 'chart') {
        return;
      }
      if (side === 'finished') {
        requestParams = [
          pullFinishedOrders,
          {
            currentPage: initialPagination.currentPage,
            pageSize: initialPagination.pageSize,
            symbol: `${deliveryCurrency}-${offerCurrency}`,
            ...filter,
          },
        ];
      } else if (side === 'my') {
        requestParams = [
          pullMineOfGreyMarketOrder,
          {
            currentPage: initialPagination.currentPage,
            pageSize: initialPagination.pageSize,
            baseCurrency: deliveryCurrency,
            ...filter,
            ownOrder: undefined,
            side: undefined,
            isActive: true,
          },
        ];
      } else {
        requestParams = [
          pullGreyMarketOrders,
          {
            currentPage: initialPagination.currentPage,
            pageSize: initialPagination.pageSize,
            deliveryCurrency,
            ...filter,
          },
        ];
      }

      const { items, currentPage, totalNum, pageSize } = yield call(...requestParams);
      const records =
        side === 'finished'
          ? items.map((entity = []) => ({
              userShortName: entity?.[0],
              price: entity?.[1],
              size: entity?.[2],
              funds: entity?.[3],
              dealTime: entity?.[4],
            }))
          : items;
      // const records = items;
      yield put({
        type: 'update',
        payload: {
          records,
          filter: {
            ...filter,
            currentPage,
            pageSize,
          },
          totalNum,
        },
      });
    },
    *pullMineOfGreyMarketOrder(_, { call, put, select }) {
      const myOrderFilter = yield select((state) => state.aptp.myOrderFilter);
      const { items, currentPage, totalNum, pageSize } = yield call(pullMineOfGreyMarketOrder, {
        ...myOrderFilter,
      });
      yield put({
        type: 'update',
        payload: {
          myOrderRecords: items,
          myOrderFilter: {
            ...myOrderFilter,
            currentPage,
            pageSize,
          },
          myOrderTotalNum: totalNum,
        },
      });
      if (myOrderFilter.isActive) {
        yield put({
          type: 'update',
          payload: {
            myOrderActivedTotalNum: totalNum,
          },
        });
      }
    },
    *updateMyOrderFilterCondition({ payload }, { call, put, select }) {
      const { triggerSearch, isReset, ...filterCondition } = payload;
      const myOrderFilter = yield select((state) => state.aptp.myOrderFilter);
      const filter = isReset
        ? { baseCurrency: null, side: null, displayStatus: null }
        : myOrderFilter;
      yield put({
        type: 'update',
        payload: {
          myOrderFilter: {
            ...filter,
            ...initialPagination,
            ...filterCondition,
          },
        },
      });
      if (triggerSearch) {
        yield put({
          type: 'aptp/pullMineOfGreyMarketOrder',
        });
      }
    },
    *resetMyOrderFilter({}, { call, put, select }) {
      yield put({
        type: 'update',
        payload: {
          myOrderFilter: initialMyOrderFilter,
        },
      });
    },
    *changeCreateOrderParams({ payload = {} }, { select, put }) {
      // const createOrderParams = select((state) => state.aptp.createOrderParams);
      yield put({
        type: 'update',
        payload: {
          createOrderParams: payload,
        },
      });
    },
    // 挂单
    *createGreyMarketOrder({ payload }, { call, put, select }) {
      try {
        const createOrderParams = yield select((state) => state.aptp.createOrderParams);
        const deliveryCurrency = yield select((state) => state.aptp.deliveryCurrency);
        const { offerCurrency } = yield select((state) => state.aptp.deliveryCurrencyInfo);
        const enableSplit = yield select((state) => state.aptp.enableSplit);
        const { side } = yield select((state) => state.aptp.modalInfo);
        const user = yield select((state) => state.user.user);
        const userShortName = getUserFlag(user);

        const data = yield call(enableSplit ? createSplitMarketOrder : createGreyMarketOrder, {
          ...createOrderParams,
          deliveryCurrency,
          offerCurrency,
          side,
          userShortName,
          ...payload,
        });

        const { success } = data || {};
        if (success) {
          yield put({
            type: 'updateFilterCondition',
            payload: {
              resetFilter: true,
              triggerSearch: true,
            },
          });
          yield put({
            type: 'changeCreateOrderParams',
            payload: {},
          });
          yield put({
            type: 'pullUserDealTotal',
            payload: {
              currency: deliveryCurrency,
            },
          });
        }
        return data;
      } catch (e) {
        return e;
      }
    },
    // 撤单(在主站)
    *cancelGreyMarketOrder({ payload: { id: orderId } }, { call, put, select }) {
      // const records = yield select((state) => state.aptp.records);
      const deliveryCurrency = yield select((state) => state.aptp.deliveryCurrency);
      const { success } = yield call(cancelGreyMarketOrder, {
        // orderId: records[payload.takeIndex]?.id,
        orderId,
      });
      if (success) {
        yield put({
          type: 'aptp/updateFilterCondition',
          payload: {
            currentPage: 1,
            triggerSearch: true,
          },
        });
        yield put({
          type: 'pullUserDealTotal',
          payload: {
            currency: deliveryCurrency,
          },
        });
      }
    },
    // 撤单(在我的订单)
    *cancelMyGreyMarketOrder({ payload: { id: orderId } }, { call, put, select }) {
      // const records = yield select((state) => state.aptp.records);
      const { success } = yield call(cancelGreyMarketOrder, {
        // orderId: records[payload.takeIndex]?.id,
        orderId,
      });
      if (success) {
        yield put({
          type: 'aptp/updateMyOrderFilterCondition',
          payload: {
            currentPage: 1,
            triggerSearch: true,
          },
        });
      }
    },
    // 发起主动违约申请(在我的订单)
    *applyBreakOrder({ payload: { orderId, compensationRate, currency } }, { call, put, select }) {
      const { success } = yield call(applyBreakOrder, {
        orderId,
        compensationRate,
        currency,
      });
      if (success) {
        yield put({
          type: 'aptp/updateMyOrderFilterCondition',
          payload: {
            currentPage: 1,
            triggerSearch: true,
          },
        });
      }
    },
    // 审核主动违约申请(在我的订单)
    *reviewBreakOrder({ payload: { requestId, currency, reviewType } }, { call, put, select }) {
      const { success } = yield call(reviewType === 1 ? agreeBreakOrder : rejectBreakOrder, {
        requestId,
        currency,
      });
      if (success) {
        yield put({
          type: 'aptp/updateMyOrderFilterCondition',
          payload: {
            currentPage: 1,
            triggerSearch: true,
          },
        });
      }
    },
    // 吃单
    *takeGreyMarketOrder({ payload }, { call, select, put }) {
      try {
        const id = yield select((state) => state.aptp.modalInfo.id);
        const deliveryCurrency = yield select((state) => state.aptp.deliveryCurrency);
        const user = yield select((state) => state.user.user);
        const userShortName = getUserFlag(user);
        const data = yield call(takeGreyMarketOrder, {
          counterOrderId: id,
          userShortName,
          channel: 'WEB',
          ...payload,
        });

        const { success } = data || {};

        if (success) {
          yield put({
            type: 'aptp/updateFilterCondition',
            payload: {
              currentPage: 1,
              triggerSearch: true,
            },
          });
          yield put({
            type: 'pullUserDealTotal',
            payload: {
              currency: deliveryCurrency,
            },
          });
        }
        return data;
      } catch (e) {
        return e;
      }
    },
    // 获取账户余额
    *queryUserSingleBlance({ payload }, { call, put, select }) {
      const { success, data } = yield call(getUserSingleBlance, payload);
      if (success) {
        const user = yield select((state) => state.aptp.user);
        yield put({
          type: 'update',
          payload: {
            user: {
              ...user,
              availableBalance: data.availableBalance,
            },
          },
        });
      }
    },
    *changeConfirmVisible({ payload = { open: true } }, { call, put, select }) {
      const { open } = payload;
      if (open) {
        yield put({
          type: 'update',
          payload: {
            confirmInfo: payload,
          },
        });
      } else {
        yield put({
          type: 'update',
          payload: {
            confirmInfo: initialConfirmInfo,
          },
        });
      }
    },
    // 获取交易密码相关信息
    *getPasswordInfo(_, { put, call }) {
      const { success, data } = yield call(getSeMethod);
      if (success) {
        const hasTransactionPasswordSet = Boolean(data?.WITHDRAW_PASSWORD);
        yield put({
          type: 'update',
          payload: {
            hasTransactionPasswordSet,
          },
        });
        return hasTransactionPasswordSet;
      }
      return false;
    },
    // 验证交易密码
    *verify({ payload }, { call }) {
      const { password } = payload;
      try {
        yield call(verify, {
          bizType: 'GRAY_MARKET',
          [`validations[withdraw_password]`]: cryptoPwd(password),
        });
      } catch (e) {
        // if (+e.code === 40001 || +e.code === 40007) {
        //   return e.msg;
        // }
        return e.msg;
      }
      return null;
    },
    // 获取价格信息(
    *pullPriceInfo({ payload }, { put, call }) {
      const { data } = yield call(pullPriceInfo, payload);
      if (data) {
        yield put({
          type: 'update',
          payload: {
            priceInfo: {
              ...data,
            },
          },
        });
      }
    },
    // 查询图表数据
    *pullChartInfo({ payload }, { put, call }) {
      const { data } = yield call(pullChartInfo, payload);

      if (data) {
        const list = (data.orders || []).concat(data.volume || []);
        if (list?.length) {
          const targetList = map(list, (item) => {
            item.price = item.price ? +item.price : undefined;
            item.volume = item.volume ? +item.volume : undefined;
            item.time = +item.orderTime * 1000;
            return item;
          });

          // targetList?.sort();

          const labelList = [];
          const hourNum = 60 * 60 * 1000;
          const dayNum = 24 * 60 * 60 * 1000;
          const sortVolume = data.volume?.sort((a, b) => +a?.orderTime - +b?.orderTime);
          map(sortVolume, (item) => {
            if (labelList.length === 0) {
              labelList.push(+item.orderTime * 1000);
            } else if (payload.timeType === 'day') {
              // 补充空缺值
              const newDate = labelList[labelList.length - 1];
              const num = (+item.orderTime * 1000 - newDate) / hourNum;
              for (let i = 0; i < num - 1; i++) {
                labelList.push(newDate + hourNum * (i + 1));
              }
              labelList.push(+item.orderTime * 1000);
            } else {
              // 补充空缺值
              const newDate = labelList[labelList.length - 1];
              const num = (+item.orderTime * 1000 - newDate) / dayNum;
              for (let i = 0; i < num - 1; i++) {
                labelList.push(newDate + dayNum * (i + 1));
              }
              labelList.push(+item.orderTime * 1000);
            }
          });

          yield put({
            type: 'update',
            payload: {
              chartList: targetList,
              chartLabelList: labelList,
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              chartList: emptyArr,
              chartLabelList: emptyArr,
            },
          });
        }
      }
    },
    // 获取订单拆分配置信息
    *pullSplitInfo(__, { call, put }) {
      const { data } = yield call(pullSplitInfo);
      yield put({
        type: 'update',
        payload: {
          splitInfo: data || emptyObj,
        },
      });
    },
    // 查询税费信息
    *pullTaxInfo({ payload }, { put, call }) {
      const { data, success } = yield call(pullTaxInfo, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            taxInfo: data || emptyObj,
          },
        });
      }
    },
    // 查询税费提示文案
    *pullTaxTips(__, { put, call }) {
      const { data } = yield call(pullTaxTips);
      yield put({
        type: 'update',
        payload: {
          taxTips: data,
        },
      });
    },
    *pullUserDealTotal({ payload }, { put, call }) {
      const { data } = yield call(pullUserDealTotal, payload);
      yield put({
        type: 'update',
        payload: {
          userDealTotal: data || emptyObj,
        },
      });
    },
    *pullDeliveryProgress({ payload }, { put, call }) {
      const { data } = yield call(pullDeliveryProgress, payload);
      yield put({
        type: 'update',
        payload: {
          deliveryProgress: data || emptyObj,
        },
      });
    },
    *openApplyCancelModal({ payload }, { put, select }) {
      const { record } = payload;
      yield put({
        type: 'update',
        payload: {
          applyCancelModalInfo: {
            visible: true,
            record,
          },
        },
      });
    },
    *closeApplyCancelModal(_, { put, select }) {
      yield put({
        type: 'update',
        payload: {
          applyCancelModalInfo: {
            visible: false,
            record: null,
          },
        },
      });
    },
    *openReviewCancelModal({ payload }, { put, select }) {
      const { record, actionRecord } = payload;
      yield put({
        type: 'update',
        payload: {
          reviewCancelModalInfo: {
            visible: true,
            record,
            actionRecord,
          },
        },
      });
    },
    *closeReviewCancelModal(_, { put, select }) {
      yield put({
        type: 'update',
        payload: {
          reviewCancelModalInfo: {
            visible: false,
          },
        },
      });
    },
    // 查询当前活动列表和历史活动列表
    *pullOngoingActivities({ payload = {} }, { call, put, select }) {
      const { currentPage: oldCurrentPage, pageSize: oldPageSize } = yield select(
        (state) => state.aptp.ongoingList,
      );

      const params = {
        currentPage: oldCurrentPage || 1,
        pageSize: oldPageSize || 5,
        ongoing: true,
        ...payload,
      };

      const { success, msg, retry, code, items, ...others } = yield call(pullActivities, params);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            ongoingList: {
              ...others,
              items: items || [],
            },
          },
        });
      }
    },
    // 查询当前活动列表和历史活动列表
    *pullHistoryActivities({ payload = {} }, { call, put, select }) {
      const historyList = yield select((state) => state.aptp.historyList);
      const historyListSymbol = yield select((state) => state.aptp.historyListSymbol);
      const { currentPage: oldCurrentPage, pageSize: oldPageSize } = historyList || {};
      const { symbol, ...otherParams } = payload;

      const params = {
        currentPage: oldCurrentPage || 1,
        pageSize: oldPageSize || 5,
        currency: historyListSymbol || undefined,
        ongoing: false,
        ...otherParams,
      };

      if (symbol !== undefined) {
        yield put({
          type: 'update',
          payload: {
            historyListSymbol: symbol,
          },
        });

        params.currency = symbol || undefined;
      }

      const { success, msg, retry, code, items, ...others } = yield call(pullActivities, params);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            historyList: {
              ...others,
              items: items || [],
            },
          },
        });
      }
    },
    // 查询价格图表
    *pullPriceChart({ payload: { type, ...others } }, { call, put, select }) {
      const { success, items } = yield call(pullPriceChart, { ...others });

      if (success) {
        if (type === 'priceTrend') {
          // 数据格式转换
          /**
           * [
           *   {price: '78.89', type: 'high', datetime: 1731416400000},
           *   {price: '77.63', type: 'low', datetime: 1731416400000}
           * ]
           */
          const transformData = (items || []).flatMap((item) => [
            {
              price: item.lowPrice,
              type: 'low',
              datetime: item.datetime * 1000,
            },
            {
              price: item.highPrice,
              type: 'high',
              datetime: item.datetime * 1000,
            },
          ]);
          yield put({
            type: 'update',
            payload: {
              priceTrendData: transformData || [],
            },
          });
        } else {
          const transformData = (items || []).map((item) => ({
            ...item,
            datetime: item.datetime * 1000,
          }));
          yield put({
            type: 'update',
            payload: {
              priceChartData: transformData || [],
            },
          });
        }
      }
    },
    // 查询支持违约功能的时间
    *pullSupportBreakContractTime(__, { call, put }) {
      const { success, data } = yield call(pullSupportBreakContractTime);

      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            supportBreakContractTime: data,
          },
        });
      }
    },
  },
  subscriptions: {
    setUpPolling({ dispatch }) {
      dispatch({ type: 'watchPolling', payload: { effect: 'pullPriceInfo', interval: 30 * 1000 } });
    },
  },
});
