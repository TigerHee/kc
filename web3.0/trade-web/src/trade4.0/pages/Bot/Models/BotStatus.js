/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import Storage from 'utils/storage';
import {
  checkSymbolMatchByBotId,
  createPathById,
  whichStrategyByBotId,
  whichStrategyByPath,
  isSymbolMatchByBotId,
} from 'Bot/config';
import { routerRedux } from 'dva/router';
import { _t } from 'Bot/utils/lang';

const isNotEqual = ({ strategyByPath, validSymbol, strategy, currentSymbol }) => {
  if (strategyByPath?.id === strategy?.id && validSymbol === currentSymbol) {
    return false;
  }
  return true;
};

/**
 * @description: 记录当前选择的是哪个策略
 * @return {*}
 */
export default extend(base, {
  namespace: 'BotStatus',
  state: {
    strategy: null, // 当前选择的哪一个策略
    currentSymbol: 'BTC-USDT', // 当前选择的交易对
  },
  effects: {
    // 整个启动/每次路由变化的时候会触发
    // 切换交易对变化会触发
    *initStrategy({ payload: { currentSymbol: validSymbol } }, { put, select }) {
      const strategyByPath = whichStrategyByPath(window.location);
      const { strategy, currentSymbol } = yield select((state) => state.BotStatus);

      // validSymbol都是合法的交易对
      // 但是需要校验交易对是否和策略是否匹配
      // 不匹配就切换到策略列表 并提示
      if (
        isNotEqual({
          strategyByPath,
          validSymbol,
          strategy,
          currentSymbol,
        })
      ) {
        if (strategyByPath?.id) {
          const botMatchSymbolMap = yield select((state) => state.BotApp.botMatchSymbolMap);
          const isMatch = isSymbolMatchByBotId(strategyByPath.id, validSymbol, botMatchSymbolMap);
          if (!isMatch) {
            yield put({
              type: 'backList',
              payload: {
                hasToast: true,
              },
            });
            return;
          }
        }

        yield put({
          type: 'update',
          payload: {
            strategy: strategyByPath,
            currentSymbol: validSymbol,
          },
        });
      }
    },
    // 点击策略列表触发
    *switchToCreate({ payload: { botId } }, { put, select }) {
      const globalCurrentSymbol = yield select((state) => state.trade.currentSymbol);
      const routeToSymbol = checkSymbolMatchByBotId(botId, globalCurrentSymbol);

      // 点击策略列表到创建需要检查
      const botMatchSymbolMap = yield select((state) => state.BotApp.botMatchSymbolMap);
      const isMatch = isSymbolMatchByBotId(botId, routeToSymbol, botMatchSymbolMap);

      if (!isMatch) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.info',
            message: _t('botnotsupportsymbol'),
          },
        });
        return;
      }

      // 1.设置自己currentSymbol
      // 2.设置选择的策略strategy
      // 以上都是为了快速切换从列表到创建

      yield put({
        type: 'update',
        payload: {
          currentSymbol: routeToSymbol,
          strategy: whichStrategyByBotId(botId),
        },
      });
      // 下面，主要用于改路有、交易对合法检查
      // 3.修改路有 ==> useInitCurrentSymbol.js ==> trade/modifyCurrentSymbol ==>
      // BotStatus/update ==> initStrategy
      const nextPath = createPathById(botId, routeToSymbol);
      yield put(routerRedux.replace(nextPath));
    },
    // 从创建返回列表
    *backList({ payload }, { put, select }) {
      const globalCurrentSymbol = yield select((state) => state.trade.currentSymbol);
      yield put({
        type: 'update',
        payload: {
          currentSymbol: null,
          strategy: null,
        },
      });
      if (payload?.hasToast) {
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.info',
            message: _t('botnotsupportsymbol'),
          },
        });
      }
      const nextPath = createPathById(null, globalCurrentSymbol);
      yield put(routerRedux.replace(nextPath));
    },
  },
  subscriptions: {},
});
