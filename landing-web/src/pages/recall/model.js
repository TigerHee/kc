/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import {
  getRecallInfo,
  getRecallInfoById,
  getRecommendCoins,
  recallDraw,
  recallReceive,
  recallWithdraw,
} from 'services/userRecall';
import { _t } from 'utils/lang';
import { getSymbolTick } from 'services/market';

export default extend(base, {
  namespace: 'userRecall',
  state: {
    noAccess: undefined, // undefined表示未初始化，true表示没有权限，false表示有权限
    generalInfo: {}, // 当前状态信息
    stagesInProgress: [], // 各阶段数据
    currentStageInfo: {}, // 当前阶段数据
    queue1Coins: [], // 队列1推荐币种
    queue2Coins: [], // 队列2推荐币种
    queue3Coins: [], // 队列3推荐币种
    cacheSymbolTickMap: {}, // 缓存交易对最新行情
  },
  effects: {
    // 获取召回基础配置信息
    *getUserRecallInfo({ payload }, { call, put }) {
      try {
        const { success, data } = yield call(
          payload?.recordId ? getRecallInfoById : getRecallInfo,
          payload,
        );
        if (success) {
          const generalInfo = data?.generalInfo || {};
          const stagesInProgress = data?.stagesInProgress || [];
          // 获取当前阶段信息
          const currentStageInfo =
            stagesInProgress.find((i) => i.order === generalInfo.curStageOrder) || {};
          yield put({
            type: 'update',
            payload: {
              noAccess: false,
              generalInfo: {
                ...generalInfo,
              },
              stagesInProgress,
              currentStageInfo,
            },
          });
        }
      } catch (e) {
        const { code } = e || {};
        if (+code === 20220400 || +code === 20220401 || +code === 20220404) {
          // 没有权限
          yield put({ type: 'update', payload: { noAccess: true } });
        } else {
          yield put({ type: 'update', payload: { noAccess: false } });
          throw {
            success: false,
            code: e.code,
            msg: _t('taskCenterTwo.adTask.sign.error1'),
          };
        }
      }
    },
    // 立即提现
    *recallWithdraw({ payload }, { call }) {
      yield call(recallWithdraw, payload);
    },
    // 翻开牌子
    *openCard({ payload }, { call }) {
      yield call(recallDraw, payload);
    },
    // 领取任务
    *recallReceive({ payload }, { call }) {
      yield call(recallReceive, payload);
    },
    // 获取推荐币种
    *getRecommendCoins({ payload }, { call, put }) {
      const { success, data } = yield call(getRecommendCoins);
      if (success) {
        const { recommendList = [] } = data;
        yield put({
          type: 'update',
          payload: {
            queue1Coins: recommendList[0]?.currencyList?.length
              ? recommendList[0]?.currencyList
              : [{ code: 'KCS', symbolCode: 'KCS-USDT' }],
            queue2Coins: recommendList[1]?.currencyList?.length
              ? recommendList[1]?.currencyList
              : [{ code: 'BTC', symbolCode: 'BTC-USDT' }],
            queue3Coins: recommendList[2]?.currencyList?.length
              ? recommendList[2]?.currencyList
              : [{ code: 'ETH', symbolCode: 'ETH-USDT' }],
          },
        });
      }
    },
    // 获取多个交易对的最新行情
    *getSymbolTick({ payload }, { call, put, select }) {
      const { success, data } = yield call(getSymbolTick, payload);
      const { cacheSymbolTickMap } = yield select((state) => state.userRecall);
      if (success) {
        let updated = {};
        data.forEach((item) => {
          updated[item.symbolCode] = {
            lastTradedPrice: item.lastTradedPrice,
            changeRate: item.changeRate,
          };
        });
        yield put({
          type: 'update',
          payload: {
            cacheSymbolTickMap: { ...cacheSymbolTickMap, ...updated },
          },
        });
      }
    },
  },
});
