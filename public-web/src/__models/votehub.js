/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 11:27:58
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-22 16:12:41
 * @FilePath: /public-web/src/__models/votehub.js
 * @Description:
 */
/**
 * Owner: jessie@kupotech.com
 */
import base from 'common/models/base';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
// import moment from 'moment';
import { find, get } from 'lodash';
import {
  postClaimKcsHoldReward,
  postCreateProject,
  postVoteProject,
  postWelfareTaskSignUp,
  pullActivityProjects,
  pullAvailableVotes,
  pullBaseConfig,
  pullCashInviteTaskInfo,
  pullCashInviteTaskStatus,
  pullChainConfig,
  pullCheckPermissions,
  pullCurrentActivity,
  pullHistoricallyProjects,
  pullKcsHoldRewardInfo,
  pullNominateRecords,
  pullRemainingVotes,
  pullRewardRecords,
  pullVoteRecords,
  pullWelfareTaskList,
  pullWinProjects,
} from 'services/votehub';

const emptyArr = [];
const emptyObj = {};
const initFilters = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalNum: 0,
};

const VOTE_HUB_BUSINESS_CONSTANTS = {
  // 活动结果公布状态
  ResultPublishedStatus: 4,
};

export default extend(base, polling, {
  namespace: 'votehub',
  state: {
    pageInfo: {}, // 页面信息汇总
    currenctPojectList: [], // 参与活动的提名列表
    nominatedProjectList: [], // 往期提名成功列表
    winProjectList: [], // 本期提名成功列表
    taskList: [], // 任务列表
    welfareList: [], // 福利中心任务列表
    chainList: [], // 链列表 （提名项目弹框使用）
    nominationVotesNum: 0, // 提名所需票数（提名项目弹框使用）
    remainingVotesNum: 0, //  当前项目用户最大可提名票数（提名项目弹框使用）
    voteLimitNum: 0, // 用户最大可投票数（FAQ使用）
    votesNum: 0, // 用户可用票数
    kcsHoldRewardLimit: 0, // kcs持仓数量 (任务模块使用)
    activityStatus: 0, // 活动未开始 / 活动结束 -- 0, 投票未开始 -- 1, 投票进行中 -- 2,投票结束（可能为待公布 和 获胜公布两种情况） -- 3,
    isActivityResultPublished: false, // 活动结果是否公布, 与activityStatus===3 时叠加满足业务
    voteStartTime: -1, // 投票倒计时
    voteRecordList: {
      // 投票记录
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      totalPage: 0,
      items: [],
    },
    nominateList: {
      // 提名记录
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      totalPage: 0,
      items: [],
    },
    ticketList: {
      // 上币票获得记录
      currentPage: 1,
      pageSize: 10,
      totalNum: 0,
      totalPage: 0,
      items: [],
    },
    filters: initFilters, // 用于记录提名列表、往期提名成功列表的分页
    ruleModal: false, // 规则弹框
    playModal: false, // 玩法弹框
    detailModal: false, // 详情弹框
    nominationModal: false, // 提名弹框
    ticketModal: false, // 投票弹框
    taskModal: false, // 任务弹框
    taskSuccessModal: false, // 任务领取成功弹框
    taskSuccessNum: 0, // 任务领取成功弹框 显示数量
    detailInfo: {}, // 详情信息
    kcsTaskInfo: {}, // kcs任务信息
    cashTaskInfo: {}, // 现金礼包任务信息（邀请好友）
    cashTaskStatus: false, // 判断是否显示现金礼包任务领取按钮
    kcsHoldStatus: false, // 判断是否显示kcs任务
    nominationPermission: false, // 白名单状态
  },
  reducers: {
    updateFilters(state, { payload = {} }) {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...payload,
        },
      };
    },
  },
  effects: {
    // 查询当前开始的活动
    *pullCurrentActivity(__, { call, put }) {
      const { data, success } = yield call(pullCurrentActivity);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            pageInfo: data || emptyObj,
            isActivityResultPublished:
              data?.status === VOTE_HUB_BUSINESS_CONSTANTS.ResultPublishedStatus,
          },
        });
      }
    },
    // 单独查询更新 活动是否公布业务态
    *pullActivityIsPubStatus(__, { call, put }) {
      const { data, success } = yield call(pullCurrentActivity);
      if (!success) return;
      yield put({
        type: 'update',
        payload: {
          isActivityResultPublished:
            data?.status === VOTE_HUB_BUSINESS_CONSTANTS.ResultPublishedStatus,
        },
      });
    },
    // 查询参与活动的项目列表
    *pullActivityProjects({ payload = {} }, { call, put, select }) {
      yield put({
        type: 'updateFilters',
        payload: {
          ...payload,
        },
      });
      const pageInfo = yield select((state) => state.votehub.pageInfo);
      const filters = yield select((state) => state.votehub.filters);

      const activityId = pageInfo?.id;
      if (!activityId) {
        return;
      }

      const params = {
        ...filters,
        activityId,
      };

      const { items, totalNum, currentPage, totalPage, pageSize, success } = yield call(
        pullActivityProjects,
        params,
      );

      if (success) {
        yield put({
          type: 'update',
          payload: {
            currenctPojectList: items || emptyArr,
            filters: {
              currentPage,
              pageSize,
              total: totalNum,
              totalPage,
            },
          },
        });
      }
      return items || emptyArr;
    },
    // 查询获胜项目列表
    *pullWinProjects(__, { call, put, select }) {
      const pageInfo = yield select((state) => state.votehub.pageInfo);

      const activityId = pageInfo?.id;
      if (!activityId) {
        return;
      }
      const { data, success } = yield call(pullWinProjects, activityId);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            winProjectList: data || emptyArr,
          },
        });
      }
    },
    // 查询历史获胜的项目列表
    *pullHistoricallyProjects({ payload = {} }, { call, put, select }) {
      yield put({
        type: 'updateFilters',
        payload: {
          ...payload,
        },
      });
      const filters = yield select((state) => state.votehub.filters);

      const params = {
        ...filters,
      };

      const { items, totalNum, totalPage, currentPage, pageSize, success } = yield call(
        pullHistoricallyProjects,
        params,
      );

      if (success) {
        yield put({
          type: 'update',
          payload: {
            nominatedProjectList: items || emptyArr,
            filters: {
              currentPage,
              pageSize,
              total: totalNum,
              totalPage,
            },
          },
        });
      }
      return items || emptyArr;
    },
    // 获取用户可用票数
    *pullAvailableVotes(__, { call, put, select }) {
      const { data, success } = yield call(pullAvailableVotes);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            votesNum: data,
          },
        });
      }
    },
    // 获取用户项目剩余可投票数量 (登陆下调用)
    *pullRemainingVotes({ payload }, { call, put, select }) {
      const { data, success } = yield call(pullRemainingVotes, payload);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            remainingVotesNum: data,
          },
        });
      }
    },
    // 获取链配置
    *pullChainConfig(__, { call, put, select }) {
      const { data, success } = yield call(pullChainConfig);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            chainList: data,
          },
        });
      }
    },
    // 获取基础配置
    *pullBaseConfig(__, { call, put, select }) {
      const { data, success } = yield call(pullBaseConfig);
      if (success && data) {
        // 用户投票上限
        const voteUpperItem = find(data, (item) => item.key === 'VOTE_UPPER_LIMIT') || emptyObj;
        // 提名所需票数
        const nominationThresholdItem =
          find(data, (item) => item.key === 'NOMINATION_THRESHOLD') || emptyObj;
        // kcs持仓任务开关
        const kcsHoldStatus =
          find(data, (item) => item.key === 'KCS_HOLD_REWARD_SWITCH') || emptyObj;
        // kcs持仓任务限制
        const kcsHoldRewardItem =
          find(data, (item) => item.key === 'KCS_HOLD_REWARD_LIMIT') || emptyObj;

        yield put({
          type: 'update',
          payload: {
            nominationVotesNum: nominationThresholdItem.value || 0,
            voteLimitNum: voteUpperItem.value || 0,
            kcsHoldStatus: kcsHoldStatus.value === 'true', // 值为‘true’ ‘false’
            kcsHoldRewardLimit: kcsHoldRewardItem.value || 0,
          },
        });
      }
    },
    // 查询投票记录列表
    *pullVoteRecordList({ payload }, { call, put, select }) {
      const oldVoteRecordList = yield select((state) => state.votehub.voteRecordList);
      console.log(oldVoteRecordList, 'oldVoteRecordList123');
      const { currentPage, pageSize, totalNum, totalPage, items, success } = yield call(
        pullVoteRecords,
        payload,
      );
      let newVoteRecordList = oldVoteRecordList;
      if (success) {
        newVoteRecordList = {
          ...oldVoteRecordList,
          currentPage,
          pageSize,
          totalNum,
          totalPage,
          items,
        };
        yield put({
          type: 'update',
          payload: {
            voteRecordList: newVoteRecordList,
          },
        });
        return {
          voteRecordList: newVoteRecordList,
        };
      }
    },
    // 查询上币票获得记录列表
    *pullTicketList({ payload }, { call, put, select }) {
      const oldTicketList = yield select((state) => state.votehub.ticketList);
      const { currentPage, pageSize, totalNum, totalPage, items, success } = yield call(
        pullRewardRecords,
        payload,
      );
      let newTicketList = oldTicketList;
      if (success) {
        newTicketList = {
          ...oldTicketList,
          currentPage,
          pageSize,
          totalNum,
          totalPage,
          items,
        };
        yield put({
          type: 'update',
          payload: {
            ticketList: newTicketList,
          },
        });
        return {
          ticketList: newTicketList,
        };
      }
    },
    // 查询提名记录列表
    *pullNominateList({ payload }, { call, put, select }) {
      const oldNominateList = yield select((state) => state.votehub.nominateList);
      const { currentPage, pageSize, totalNum, totalPage, items, success } = yield call(
        pullNominateRecords,
        payload,
      );
      let newNominateList = {
        ...oldNominateList,
        currentPage,
        pageSize,
        totalNum,
        totalPage,
        items,
      };
      if (success) {
        yield put({
          type: 'update',
          payload: {
            nominateList: newNominateList,
          },
        });
        return {
          nominateList: newNominateList,
        };
      }
    },
    // 用户发起项目提名
    *postCreateProject({ payload }, { call, put }) {
      const { success } = yield call(postCreateProject, payload);
      // 项目提名后重新拉取票数
      if (success) {
        yield put({
          type: 'pullAvailableVotes',
        });
      }
      return success;
    },
    // 用户投票
    *postVoteProject({ payload }, { call, put }) {
      const { data, success } = yield call(postVoteProject, payload);
      // 投完票重新拉取当前可投票列表 与 票数
      if (success) {
        yield put({
          type: 'pullAvailableVotes',
        });
        yield put({
          type: 'pullActivityProjects',
        });
      }
      return success;
    },
    // 福利中心任务：查询用户可以参与的投票上币任务以及对应的报名状态
    *pullWelfareTaskList(__, { call, put }) {
      const { data, success } = yield call(pullWelfareTaskList);

      if (success) {
        yield put({
          type: 'update',
          payload: {
            welfareList: data || emptyArr,
          },
        });
      }
    },
    // 福利中心任务：报名接口
    *postWelfareTaskSignUp({ payload }, { call, put }) {
      const { success } = yield call(postWelfareTaskSignUp, payload);
      return success;
    },
    // 获取KCS持仓奖励信息 (登陆下调用)
    *pullKcsHoldRewardInfo(__, { call, put }) {
      const { data, success } = yield call(pullKcsHoldRewardInfo);

      if (success) {
        // data.claimAmount = 100;
        yield put({
          type: 'update',
          payload: {
            kcsTaskInfo: data || emptyObj,
          },
        });
      }
    },
    // 领取KCS持仓奖励 (登陆下调用)
    *postClaimKcsHoldReward(__, { call, put }) {
      const { data, success } = yield call(postClaimKcsHoldReward);
      if (success) {
        // 领取成功打开弹框
        yield put({
          type: 'update',
          payload: {
            taskModal: false,
            taskSuccessModal: true,
            taskSuccessNum: data,
          },
        });
        // 领取成功后重新拉取数据
        yield put({
          type: 'pullKcsHoldRewardInfo',
        });
        // 获取用户可投票数
        yield put({
          type: 'pullAvailableVotes',
        });
      }
      return data;
    },
    // 获取投票上币现金礼包邀请任务信息
    *pullCashInviteTaskInfo({ payload }, { call, put }) {
      const { success, data } = yield call(pullCashInviteTaskInfo, payload);
      if (success && data) {
        const taskInfo = get(data, 'properties[0].backupValues') || emptyObj;
        const cashTaskInfo = {
          ...taskInfo,
        };
        yield put({
          type: 'update',
          payload: {
            cashTaskInfo,
          },
        });
      }
      return success;
    },
    // 获取投票上币现金礼包邀请任务完成状态 (登陆下调用)
    *pullCashInviteTaskStatus(__, { call, put }) {
      const { success, data } = yield call(pullCashInviteTaskStatus);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            cashTaskStatus: !!data.canObtainVoteCouponStatus,
          },
        });
      }
      return success;
    },
    // 获取投票上币白名单状态
    *pullCheckPermissions(__, { call, put }) {
      const { success, data } = yield call(pullCheckPermissions);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            nominationPermission: data,
          },
        });
      }
    },
  },
  subscriptions: {
    setUpPolling({ dispatch }) {
      // 投票币种1分钟刷一次
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullActivityProjects', interval: 1 * 60 * 1000 },
      });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullWinProjects', interval: 1 * 60 * 1000 },
      });
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullActivityIsPubStatus', interval: 1 * 60 * 1000 },
      });
    },
  },
});
