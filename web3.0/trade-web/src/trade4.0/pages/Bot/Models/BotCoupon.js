/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import {
  getRule,
  postCouponLists,
  getCouponByTaskIds,
  getBotsByCouponId,
  receiveCouponById,
  receiveBigCouponDialog,
} from 'Bot/services/coupon';
import { formatEffectiveDecimal } from 'Bot/helper';
import { couponPrecision } from 'Bot/config';
import { takeEvery } from 'redux-saga/effects';

// 是否已经获取过优惠券弹窗接口标记
let hasFetchCouponDialog = false;
// 是否已经开始监听运行中/历史记录
let hasWatch = false;
// 获取体验机器人/卡券数据
export default extend(base, polling, {
  namespace: 'BotCoupon',
  state: {
    rules: {},
    EXPIRE: [], // 过期卡券
    CREATE: [], // 根据投资额卡券
    RUNNING: [], // 运行中卡券
    canCouponTasks: {}, // 从卡券选择匹配的机器人
    globalCounponData: [], // 首页卡券弹窗数据，
    allCouponMap: {}, // 运行列表卡券数据
    allHistoryCouponMap: {}, // 历史列表所有卡券数据
    globalExpData: {}, // 首页体验机器人弹窗数据
    isShowBigCouponDialog: false, // 首页大额弹窗
    inBlackList: false, // 后台国家黑名单配置
  },
  effects: {
    *getRule({ payload = 'FEE_REBATE' }, { call, put, select }) {
      try {
        const { data } = yield call(getRule, payload);
        const oldRules = yield select((state) => state.coupon.rules);
        yield put({
          type: 'update',
          payload: {
            rules: {
              ...oldRules,
              [payload]: data,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 获取卡券
    *postCouponLists({ payload: { type, ...rest } }, { call, put, take, all }) {
      try {
        if (!hasFetchCouponDialog) {
          // 等待这两个接口获取之后再请求,避免creat栏的卡券没有展示最新优惠券
          yield all([take('getCouponExpSync/@@end'), take('receiveBigCouponDialog/@@end')]);
          hasFetchCouponDialog = true;
        }
        const { data } = yield call(postCouponLists, rest);
        yield put({
          type: 'update',
          payload: {
            [type]: data?.couponsDetailResponseList,
            inBlackList: data?.inBlackList,
          },
        });
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    // 从卡券选择匹配的机器人
    *getBotsByCouponId({ payload: couponId }, { call, put, select }) {
      try {
        const { data: canCouponTaskIds } = yield call(getBotsByCouponId, couponId);
        if (!canCouponTaskIds.length) return;
        const running = yield select((state) => state.running.running);
        // canCouponTaskIds中含有未触发开单价格的数据， 需要这里去除
        const canCouponTasks = running.filter((task) => {
          const isServerOk = canCouponTaskIds.includes(task.id);
          const hasOpenUnitPrice = +task.openUnitPrice !== 0 && task.isOpenUnit === false;
          return isServerOk && !hasOpenUnitPrice;
        });
        const oldCanCouponTasks = yield select((state) => state.coupon.canCouponTasks);

        yield put({
          type: 'update',
          payload: {
            canCouponTasks: {
              ...oldCanCouponTasks,
              [couponId]: canCouponTasks,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    // 监听运行列表接口，那边发起，这里也发起
    *watchRunning(payload, { put, select, call }) {
      if (!hasWatch) {
        hasWatch = true;
      } else {
        return;
      }
      // 根据运行列表获取卡券数据，并把数据合并到运行列表running中
      function* getCouponListsByTaskIds({ modelKey, modelName }) {
        try {
          const running = yield select((state) => state[modelName].lists);
          const taskIds = running.filter((el) => el.id && el.couponId).map((el) => el.id);

          if (!taskIds.length) return;
          // 根据运行taskId去获取卡券数据
          const { data } = yield call(getCouponByTaskIds, taskIds);
          const taskIdsMap = {};
          data.forEach((el) => {
            if (el && el.couponsId) {
              // 用于判断是否倒计时完毕
              el.isCountdownFinish =
                (el.expiredTime && Number(el.expiredTime) <= 0) || !el.expiredTime;
              // tag 函数变动 整数位为0精度只保留3位有效数字
              el.rewardSize = formatEffectiveDecimal(
                el.rewardSize || 0,
                couponPrecision.idealPrecision,
              );
              taskIdsMap[el.taskId] = el;
            }
          });
          yield put({
            type: 'update',
            payload: {
              [modelKey]: taskIdsMap,
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
      // 一直监听所有策略的运行接口saga
      yield takeEvery(
        (saga) => {
          if (saga?.type.endsWith('BotRunning/getRunningLists/@@end')) {
            return saga.type;
          }
        },
        getCouponListsByTaskIds,
        { modelKey: 'allCouponMap', modelName: 'BotRunning' },
      );

      // 一直监听所有策略的历史接口saga
      yield takeEvery(
        (saga) => {
          if (saga?.type.endsWith('BotHistory/getHistoryLists/@@end')) {
            return saga.type;
          }
        },
        getCouponListsByTaskIds,
        { modelKey: 'allHistoryCouponMap', modelName: 'BotHistory' },
      );
    },

    // 同时后去卡券 体验机器人
    *getCouponExpSync({ payload: { coupon } }, { call, put }) {
      try {
        // 优先展示卡券弹窗， 其次体验机器人
        const res = yield call(receiveCouponById, coupon ? [coupon] : undefined);
        // const res = {
        //   success: true,
        //   code: '200',
        //   msg: 'success',
        //   retry: false,
        //   data: [
        //     {
        //       id: '616e7b0d5e3b8f0001da2a40',
        //       type: 'FEE_REBATE',
        //       phaseId: 'A00001',
        //       userId: '6087cf7a98ba390009247b1a',
        //       taskId: 0,
        //       receiveTime: 1634630470387,
        //       expirationTime: 1635494470387,
        //       startUseTime: null,
        //       status: 'NOT_USED',
        //       usableInfo: null,
        //       rules: {
        //         receiveOnlyForNewUser: false,
        //         maxReceiveNumber: 9000000,
        //         receiveStartTime: 1633017601000,
        //         receiveEndTime: 1638287999000,
        //         validPeriodSeconds: 864000,
        //         rewardSeconds: 432000,
        //         scope: {
        //           MARTIN_GALE: ['KCS-USDT'],
        //           GRID: ['BTC-USDT'],
        //         },
        //         minTotalInvestments: '0',
        //         maxReward: '20',
        //         rewardPercent: '0.6',
        //         rewardCurrency: 'USDT',
        //         rewardAccountType: 'TRADE'
        //       },
        //       name: null
        //     },
        //     {
        //       id: '616e7b255e3b8f0001da2a41',
        //       type: 'FEE_REBATE',
        //       phaseId: 'A00001',
        //       userId: '6087cf7a98ba390009247b1a',
        //       taskId: 0,
        //       receiveTime: 1634630470395,
        //       expirationTime: 1635494470395,
        //       startUseTime: null,
        //       status: 'NOT_USED',
        //       usableInfo: null,
        //       rules: {
        //         receiveOnlyForNewUser: false,
        //         maxReceiveNumber: 9000000,
        //         receiveStartTime: 1633017601000,
        //         receiveEndTime: 1638287999000,
        //         validPeriodSeconds: 864000,
        //         rewardSeconds: 432000,
        //         scope: {
        //           POSITION: [],
        //           CONTRACT_GRID: [],
        //           GRID: [
        //             'BTC-USDT'
        //           ],
        //           AIP: []
        //         },
        //         minTotalInvestments: '0',
        //         maxReward: '20',
        //         rewardPercent: '0.6',
        //         rewardCurrency: 'USDT',
        //         rewardAccountType: 'TRADE'
        //       },
        //       name: null
        //     }
        //   ]
        // };
        if (res && res.data) {
          let counponData = res.data;
          counponData = counponData?.sort((a, b) => {
            return Number(b.rules.rewardPercent) - Number(a.rules.rewardPercent);
          });
          yield put({
            type: 'update',
            payload: {
              globalCounponData: counponData || [],
            },
          });
        } else if (res?.code !== '200') {
          // message.error(res.msg);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // /v1/coupons/receive?receiveReason=AB_TEST_0，如果领取成功，展示“新用户大额优惠券弹窗”
    *receiveBigCouponDialog(_, { call, put }) {
      try {
        const { data } = yield call(receiveBigCouponDialog);
        if (data.length > 0) {
          yield put({
            type: 'update',
            payload: {
              isShowBigCouponDialog: true,
            },
          });
        }
      } catch (error) {
        return null;
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {},
  },
});
