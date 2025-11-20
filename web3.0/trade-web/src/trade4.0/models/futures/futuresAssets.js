/**
 * Owner: garuda@kupotech.com
 * 该 models 存储合约的资产
 * 合约的资产后续有可能会有全仓账户等，先单独拆出来
 */

import base from 'common/models/base';
import polling from 'common/models/polling';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';

import extend from 'dva-model-extend';
import { forEach } from 'lodash';

import { ABC_WALLET } from '@/components/AbnormalBack/constant';
import { triggerOrderChange } from '@/hooks/futures/useCalcData';
import { isOpenFuturesCross } from '@/meta/const';
import { futuresCalcControl } from '@/pages/Futures/components/SocketDataFormulaCalc/utils';
import { pullTotalEquityL3, getSymbolDetail } from '@/services/futures';
import { checkFuturesSocketTopic } from '@/utils/socket';

const WALLET_TOPIC = '/contractAccount/wallet';
let getOverviewPolling = false;
export default extend(base, polling, {
  namespace: 'futuresAssets',
  state: {
    walletList: [], // 资产 items
  },
  effects: {
    /**
     * 获取资产
     */
    *pullOverview(__, { call, put, select }) {
      if (getOverviewPolling) return;
      getOverviewPolling = true;
      const isLogin = yield select((state) => state.user.isLogin);
      if (!isLogin) {
        getOverviewPolling = false;
        return;
      }
      const balanceCurrency = yield select((state) => state.user.balanceCurrency);
      try {
        const { data: l3Data } = yield call(pullTotalEquityL3, {
          balanceCurrency,
          includeTrialFund: true,
        });

        const items = [];

        // TIPS: 先用 forEach 循环出来，后续有可能会加其它数据
        forEach(l3Data, (item, key) => {
          if (item && item.items) {
            items.push(...item.items);
          }
        });

        yield put({
          type: 'updateWorkerWalletSocketData',
          payload: {
            walletList: items,
            needPullCost: true,
          },
        });
      } catch (e) {
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_WALLET,
            status: false,
            locationId: '4',
            error: e,
          },
        });
        throw e;
      } finally {
        getOverviewPolling = false;
      }
    },
    // check socket 资产轮询
    *checkWalletSocket(__, { put }) {
      const checkFuturesTopic = yield checkFuturesSocketTopic({ topic: WALLET_TOPIC });
      if (!checkFuturesTopic) {
        yield put({ type: 'pullOverview' });
      }
    },

    // 获取仓位详情
    *getPositionDetail({ payload: { symbol } }, { call }) {
      try {
        return yield call(getSymbolDetail, symbol);
      } catch (err) {
        throw err;
      }
    },
    // 更新仓位数据
    *updateWorkerWalletSocketData({ payload }, { put }) {
      const { walletList, needPullCost, needUpdateWallet } = payload;
      yield put({
        type: 'update',
        payload: { walletList },
      });
      yield put({
        type: 'futuresCommon/updateCrossAbnormal',
        payload: {
          updateKey: ABC_WALLET,
          status: true,
          locationId: '4',
        },
      });
      // 开关关闭，直接触发
      if (!isOpenFuturesCross() && needUpdateWallet) {
        // 触发一次计算
        futuresCalcControl.triggerCalc();
      } else if (needPullCost) {
        // 通知订单拉取占用，拉取时需要锁住更新
        // TIPS: 锁住更新的目的是防止另外一个触发更新源 标记价格变化 导致计算回退的问题
        futuresCalcControl.lockUpdate();
        triggerOrderChange();
      }
    },
  },
  subscriptions: {
    initLoop({ dispatch }) {
      // 30s
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'checkWalletSocket', interval: 30000 },
      });
    },
    initSocketTopicMessage({ dispatch }) {
      futuresWorkerSocket.topicWallet(({ walletList, needPullCost } = {}) => {
        dispatch({
          type: 'updateWorkerWalletSocketData',
          payload: { walletList, needPullCost, needUpdateWallet: !needPullCost },
        });
      });
    },
  },
});
