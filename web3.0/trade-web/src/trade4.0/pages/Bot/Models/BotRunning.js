/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import { runMachine } from 'Bot/services/machine';
import { getRunningLists, stopMachine } from 'Bot/services/running';
import _ from 'lodash';
import { filterRunningLists, calcRunningNum } from 'Bot/Module/BotOrderAndProfit/Running/config';
import { _t } from 'Bot/utils/lang';
import Storage from 'utils/storage';
import { _DEV_ } from 'utils/env';
import sentry from '@kc/sentry';

const trackTradeResults = (payload, isSuccess, reason = 'fail') => {
  if (!window.$KcSensors) return '';
  const { compose: _compose = () => '' } = window.$KcSensors.spm || {};
  window.$KcSensors.track('trade_results', {
    spm_id: _compose(['trade_results', '1']),
    is_success: isSuccess,
    fail_reason: isSuccess ? '' : reason,
    trade_pair: '',
    trade_currency: '',
    trade_service_type: 'bot',
    grid_type: payload?.templateId,
    is_leverage: '',
    leverage_multiplier: '',
  });
};
let isPosting = false;
export default extend(base, polling, {
  namespace: 'BotRunning',
  state: {
    lists: [], // 运行中列表
    runningNum: 0, // 运行中数量
    botType: null, // 机器人策略类型，默认null全部，GRID/FUTURES_GRID等
    isFirstRunning: false,
    hasStopFreshRunningLists: false, // 是否开启了因为有Stop状态机器人，刷新机制
    taskIdCreateJustNow: null, // 刚刚创建的网格机器人id,用于一开始进入运行列表展示进度过程
    isProgressForEditRange: false, // 标记是否是修改区间
    progressType: null, // 标记是扩展修改 还是正常修改 [extend, normal]
  },
  effects: {
    // 运行中列表
    *getRunningLists({ payload }, { call, put, select }) {
      try {
        // 开发环境提速
        const cacheKey = 'bot_running_lists';
        if (_DEV_) {
          const lists = Storage.getItem(cacheKey);
          if (lists?.length > 0) {
            yield put({
              type: 'update',
              payload: {
                lists,
                runningNum: calcRunningNum(lists),
                isFirstRunning: true,
              },
            });
          }
        }
        const { botType } = yield select((state) => state.BotRunning);
        // 入参添加策略类型的筛选字段
        const params = {
          ...(botType && { type: botType }),
        };
        const { data: running } = yield call(getRunningLists, params);
        // 因接口较慢，当前请求的类型参数与最新类型参数不同，则丢弃
        const { botType: newBotType } = yield select((state) => state.BotRunning);
        if ((!params.type && newBotType) || (params.type && params.type !== newBotType)) {
          return;
        }

        const effective = filterRunningLists(running);
        const runningNum = calcRunningNum(effective);
        // 开发环境提速
        if (_DEV_) {
          Storage.setItem(cacheKey, effective);
        }
        yield put({
          type: 'update',
          payload: {
            lists: effective,
            runningNum,
            isFirstRunning: true,
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            // running: [],
            isFirstRunning: true,
          },
        });
      }
    },
    // 关闭机器人
    *toStopMachine({ payload: { id, sellAllBase, buyBase } }, { call, select, put }) {
      try {
        yield call(stopMachine, { taskId: id, sellAllBase, buyBase });
        yield put({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('runningdetail'),
          },
        });
        // 关闭成功会影响到资产纵览
        // 运行列表 需要刷新
        // 刷新对应策略运行列表
        yield put({
          type: 'getRunningLists',
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 运行
    *runMachine({ payload }, { call, put, select }) {
      let hasErr = false;
      try {
        if (isPosting) {
          return Promise.reject();
        }
        isPosting = true;
        const { data: taskIdCreateJustNow, success, msg } = yield call(runMachine, payload);
        isPosting = false;
        if (success) {
          trackTradeResults(payload, success, msg);
        }
        // 记录显示进度过程的ID
        if (taskIdCreateJustNow) {
          yield put({
            type: 'notice/feed',
            payload: {
              type: 'message.success',
              message: _t('gridwidget9'),
            },
          });
          yield put({
            type: 'update',
            payload: {
              taskIdCreateJustNow,
            },
          });
          yield put({
            type: 'getRunningLists',
          });
          return taskIdCreateJustNow;
        }

        // 下单后更新 展示满意度调研弹窗下单标记
        yield put({
          type: 'portal/markSatisfiedSurveyPlaceOrderCondition',
        });
        return null;
      } catch (error) {
        isPosting = false;
        trackTradeResults(payload, false, error?.msg);
        // 添加一条面包屑，随report记录一起上报sentry平台
        if (window.SentryLazy?.addBreadcrumb) {
          window.SentryLazy.addBreadcrumb({
            type: 'info',
            level: 'fatal',
            category: 'message',
            message: JSON.stringify(payload),
          });
        }

        try {
          sentry.captureEvent({
            biz: '06',
            level: 'fatal',
            message: `tradeResults-failed:${error?.msg}`,
            tags: {
              tradeResultsReport: 'failed',
            },
          });
        } catch (err) {
          console.error(err);
        }
        hasErr = true;
      }
      return hasErr ? Promise.reject() : '';
    },
  },
  subscriptions: {},
});
