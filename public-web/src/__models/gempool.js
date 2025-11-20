/**
 * Owner: jessie@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import sort from 'common/models/sort';
import extend from 'dva-model-extend';
import {
  postGemPoolExamSubmit,
  postGemPoolRewardByPoolId,
  postGemPoolRewards,
  postGemPoolStaking,
  postGemPoolUnstaking,
  pullEarningsRecordList,
  pullEarningsSummaryList,
  pullGempoolBalance,
  pullGemPoolBanner,
  pullGemPoolBonusTask,
  pullGemPoolEarnTokenList,
  pullGemPoolExam,
  pullGemPoolHistoryRecords,
  pullGemPoolProjectDetail,
  pullGemPoolRecords,
  pullGemPoolUnclaimedRewards,
  pullGemPoolUnclaimedRewardsNum,
  pullInviteActivity,
  postSignupInvite
} from 'services/gempool';

const emptyArr = [];
const emptyObj = {};

const calculateTimeRange = (dateTime) => {
  const now = new Date();
  let startTime = 0;
  let endTime = now.getTime();
  switch (dateTime) {
    case 'all':
      startTime = 0;
      break;
    case 1:
      startTime = new Date(now.setMonth(now.getMonth() - 1)).getTime();
      break;
    case 3:
      startTime = new Date(now.setMonth(now.getMonth() - 3)).getTime();
      break;
    case 6:
      startTime = new Date(now.setMonth(now.getMonth() - 6)).getTime();
      break;
    default:
      startTime = 0;
  }
  return { startTime, endTime };
};

const sortTaskList = (taskList) => {
  if (!taskList || !taskList.length) return;
  taskList.sort((a, b) => {
    const isInvite = a.taskType === 3;
    if (isInvite) return -1;
    return a.taskType - b.taskType;
  })
  return taskList;
}

export default extend(base, sort, filter, polling, {
  namespace: 'gempool',
  state: {
    currentInfo: {}, // 详情页面信息
    earnTokenList: [], // 所有挖矿tokenlist
    totalUnclaimedNums: 0, // 未领取奖励数量
    unclaimedCampaigns: [], // 未领取奖励列表
    bannerInfo: {}, // banner
    poolInfo: {}, // 质押、解除质押 奖池内容
    bonusTaskList: [], // 任务信息
    currentRecords: [],
    inviteBonusLevel: [], // 邀请奖励等级信息
    historyRecords: {
      // 历史项目
      currentPage: 1,
      pageSize: 5,
      totalNum: 0,
      totalPage: 0,
      items: [],
    },
    activityCode: '', // 邀请任务的活动code, 用于报名邀请任务
    stakeModal: false, // 质押弹框
    unstakeModal: false, // 解除质押弹框
    taskModal: false, // 任务弹框
    rewardsModal: false, // 待领取奖励弹框
    questionModal: false, // 答题弹框
    headerHeight: 0, // header高度
    taskShowVisible: false, // 是否显示任务（结果弹框）
    earningsRecordList: {},
    earningsSummaryList: {},
    questionId: null, // 查询答题和提交答题的id, 存储campaignId
    // 仅用于记录上次查询 bonus 和 邀请 信息
    lastTaskCampaignId: '',
    currentTab: 'ended', // 当前页面tab
    tasksMap: {}, // 任务数据
  },
  reducers: {},
  effects: {
    // 切换 gempool 活动
    *switchCampaign({ payload }, { put, all, select }) {
      const nextCampaignId = payload.poolInfo?.campaignId;
      const updateExtra = put.resolve({
        type: 'updateCampaignExtra',
        payload: {
          campaignId: nextCampaignId,
        },
      })
      // 优先更新campaign, 再更新相关数据
      yield put({
        type: 'update',
        payload,
      });

      yield updateExtra;
    },
    /**
     * 更新活动相关数据
     * 1. 更新活动加成数据
     * 2. 更新邀请配置数据
     * 3. 报名邀请任务
     */
    *updateCampaignExtra({ payload = { } }, { select, put, call }) {
      const campaignId = payload.campaignId || '';
      const previousCampaignId = yield select((state) => state.gempool.lastTaskCampaignId);
      if (!campaignId) return;
      const isCampaignChanged = previousCampaignId !== campaignId;
      if (!isCampaignChanged) return;
      const resetState = {
        lastTaskCampaignId: campaignId,
        activityCode: '',
        inviteBonusLevel: [],
        bonusTaskList: [],
      };
      yield put({
        type: 'update',
        payload: resetState,
      });
      // put.resolve 保证 generator 执行完毕后再执行下一个
      yield put.resolve({
        type: 'pullGemPoolBonusTask',
        payload: {
          id: campaignId,
        },
      })

      const bonusTaskList = yield select((state) => state.gempool.bonusTaskList);
      // 没有加成任务则无需后续的操作
      if (!bonusTaskList || !bonusTaskList.length) return;
      // taskType 3: 邀请任务
      // 不存在邀请任务则无需后续的操作
      if (!bonusTaskList.some(item => item.taskType === 3)) return;
      // 拉取邀请活动配置
      yield put.resolve({
        type: 'pullInviteActivity',
        payload: {
          id: campaignId,
        },
      });
      const activityCode = yield select((state) => state.gempool.activityCode);
      if (!activityCode) return;
      // 报名邀请任务
      yield call(postSignupInvite, activityCode);
    },
    *pullGemPoolHistoryRecords({ payload = {} }, { select, call, put }) {
      const historyRecords = yield select((state) => state.gempool.historyRecords) || {};
      const params = {
        currentPage: historyRecords.currentPage,
        pageSize: historyRecords.pageSize,
        ...payload,
      };

      const { items, totalNum, totalPage, currentPage, pageSize, success } = yield call(
        pullGemPoolHistoryRecords,
        params,
      );

      if (success) {
        yield put({
          type: 'update',
          payload: {
            historyRecords: {
              currentPage,
              pageSize,
              totalNum,
              totalPage,
              items: items || emptyArr,
            },
          },
        });
      }
      return items || emptyArr;
    },
    *pullGemPoolRecords(__, { call, put }) {
      const { data, success } = yield call(pullGemPoolRecords);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            currentRecords: data || emptyArr,
          },
        });
      }
      return data || emptyArr;
    },
    *pullGemPoolBanner(__, { call, put }) {
      const { data, success } = yield call(pullGemPoolBanner);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            bannerInfo: data || emptyObj,
          },
        });
      }
    },
    *pullGemPoolUnclaimedRewardsNum(__, { call, put }) {
      const { data, success } = yield call(pullGemPoolUnclaimedRewardsNum);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            totalUnclaimedNums: data?.totalUnclaimedNums || 0,
          },
        });
      }
    },
    *pullGemPoolUnclaimedRewards(__, { call, put }) {
      const { data, success } = yield call(pullGemPoolUnclaimedRewards);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            unclaimedCampaigns: data || emptyArr,
          },
        });
      }
    },
    *pullGemPoolProjectDetail({ payload: { currency } }, { call, put }) {
      const { data, success } = yield call(pullGemPoolProjectDetail, currency);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            currentInfo: data || emptyObj,
          },
        });
      }
    },
    *postGemPoolRewards({ payload }, { call, put }) {
      const { data, success } = yield call(postGemPoolRewards, payload);
      if (success) {
        // 重新获取待领取奖励信息
        yield put({
          type: 'pullGemPoolUnclaimedRewards',
        });
        // 重新获取列表信息
        yield put({
          type: 'pullGemPoolRecords',
        });
      }
      return success;
    },
    *postGemPoolRewardByPoolId({ payload }, { select, call, put }) {
      const { earnTokenName } = yield select((state) => state.gempool.currentInfo);
      const { data, success } = yield call(postGemPoolRewardByPoolId, payload?.id);

      if (success) {
        // 重新获取详情信息
        yield put({
          type: 'pullGemPoolProjectDetail',
          payload: {
            currency: earnTokenName,
          },
        });
      }
      return success;
    },
    *postGemPoolStaking({ payload }, { call }) {
      const { success } = yield call(postGemPoolStaking, payload);
      return success;
    },
    *postGemPoolUnstaking({ payload }, { select, call, put }) {
      const { success } = yield call(postGemPoolUnstaking, payload);
      const { earnTokenName } = yield select((state) => state.gempool.currentInfo);
      if (success) {
        // 重新获取详情信息
        yield put({
          type: 'pullGemPoolProjectDetail',
          payload: {
            currency: earnTokenName,
          },
        });
      }
      return success;
    },
    // 拉取题目列表
    *pullGemPoolExam({ payload }, { select, call, put }) {
      const { data, success } = yield call(pullGemPoolExam, payload);
      if (success) {
        return data;
        // yield put({
        //   type: 'update',
        //   payload: {
        //     currentInfo: data || emptyObj,
        //   },
        // });
      }
    },
    *postGemPoolExamSubmit({ payload }, { select, call, put }) {
      const { data, success } = yield call(postGemPoolExamSubmit, payload);
      if (success) {
        return data;
      }
    },
    *pullGemPoolBonusTask({ payload: { id }, fullData = false }, { select, call, put }) {
      const { data, success } = yield call(pullGemPoolBonusTask, id);
      const tasksMap = yield select((state) => state.gempool.tasksMap) || {};
      if (success) {
        const currentData = !fullData ? {
          bonusTaskList: sortTaskList(data?.taskCompletion) || emptyArr,
          taskShowVisible: !!(data?.openBonusTask && !data?.userBonusTaskFinish),
        } : {}
        yield put({
          type: 'update',
          payload: {
            ...currentData,
            tasksMap: {
              ...tasksMap,
              [id]: data,
            }
          },
        });
      }
    },
    *pullGemPoolEarnTokenList(__, { call, put }) {
      const { data, success } = yield call(pullGemPoolEarnTokenList);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            earnTokenList: data || emptyArr,
          },
        });
      }
    },
    // 查询历史收益记录列表
    *pullEarningsRecordList({ payload }, { call, put, select }) {
      const oldEarningsRecordList = yield select((state) => state.gempool.earningsRecordList);
      const { startTime, endTime } = calculateTimeRange(payload.dateTime);
      if (startTime !== 0) {
        payload.startTime = startTime;
        payload.endTime = endTime;
      }
      if (payload.earnToken === 'all' || payload.earnToken === '') {
        delete payload.earnToken;
      }
      const { currentPage, pageSize, totalNum, totalPage, items, success } = yield call(
        pullEarningsRecordList,
        payload,
      );
      if (success) {
        let newEarningsRecordList = {
          ...oldEarningsRecordList,
          currentPage,
          pageSize,
          totalNum,
          totalPage,
          items,
        };
        yield put({
          type: 'update',
          payload: {
            earningsRecordList: newEarningsRecordList,
          },
        });
        return {
          earningsRecordList: newEarningsRecordList,
        };
      }
    },
    // 查询历史收益记录列表
    *pullEarningsSummaryList({ payload }, { call, put, select }) {
      const oldEarningsSummaryList = yield select((state) => state.gempool.earningsSummaryList);
      const { startTime, endTime } = calculateTimeRange(payload.dateTime);
      if (startTime !== 0) {
        payload.startTime = startTime;
        payload.endTime = endTime;
      }
      if (payload.earnToken === 'all' || payload.earnToken === '') {
        delete payload.earnToken;
      }
      const { currentPage, pageSize, totalNum, totalPage, items, success } = yield call(
        pullEarningsSummaryList,
        payload,
      );
      if (success) {
        let newEarningsSummaryList = {
          ...oldEarningsSummaryList,
          currentPage,
          pageSize,
          totalNum,
          totalPage,
          items,
        };
        yield put({
          type: 'update',
          payload: {
            earningsSummaryList: newEarningsSummaryList,
          },
        });
        return {
          earningsSummaryList: newEarningsSummaryList,
        };
      }
    },
    // gempool质押查询kcs可用余额
    *pullGempoolBalance(__, { call, put }) {
      const { data, success } = yield call(pullGempoolBalance);

      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            kcsAvailable: data.available_balance,
          },
        });
      }
    },
    // gempool 查询邀请任务奖励的等级信息, 邀请人数与加成的映射关系
    *pullInviteActivity({ payload: { id } }, { call, put }) {
      const { data, success } = yield call(pullInviteActivity, id);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            activityCode: data?.activityCode,
            inviteBonusLevel: formatInviteLevel(data?.bonusCoefficientMap),
          },
        });
      }
    },
  },
  subscriptions: {
    watchPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullGemPoolRecords',
          interval: 30 * 1000,
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullGemPoolUnclaimedRewardsNum',
          interval: 30 * 1000,
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullGemPoolProjectDetail',
          interval: 30 * 1000,
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullGemPoolBanner',
          interval: 30 * 1000,
        },
      });
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullGempoolBalance',
          interval: 30 * 1000,
        },
      });
    },
  },
});


function formatInviteLevel(bonusMap) {
  const result = [];
  if (!bonusMap) {
    return result;
  }
  return Object.keys(bonusMap).sort((a, b) => a - b).map((key) => ({
    // 邀请人数
    userAmount: key,
    // 加成
    boost: bonusMap[key],
  }))
}
