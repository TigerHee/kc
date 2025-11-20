/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { map, get, size } from 'lodash';
import * as serv from 'services/nftQuiz';
import base from 'utils/common_models/base';
import polling from 'utils/common_models/polling';
import {
  NFT_QUIZ_TYPES as TYPES,
  NFT_QUIZ_STATUS,
} from 'config';

const pageSize = 10;

// const videoUrl = 'https://assets.staticimg.com/static/KYC2.mp4';

const getActivityStatus = (start, end, now) => {
  if (now < start) return NFT_QUIZ_STATUS.NOT_BEGIN;
  if (now > end) return NFT_QUIZ_STATUS.EXPIRED;
  return NFT_QUIZ_STATUS.CURRENT;
};


// 处理活动配置数据，增加相关标志及附加字段。
const handleConfig = (actConfig = {}) => {
  if (!actConfig) return ({
    activityStatus: NFT_QUIZ_STATUS.NOT_BEGIN
  });
  const { start, end, now, config, answer } = actConfig || {};
  const activityStatus = getActivityStatus(start, end, now);
  const configItem = (config && config[0]) || {};
  // 获取有奖视频学习，视频链接
  const { learnVideoUrl } = answer || {};
  const finalConfig = {
    ...(actConfig || {}),
    activityStatus,
    currentId: configItem.id,
    currentConfig: configItem,
    currentPrize: get(configItem, 'prize[0]'),
    learnVideoUrl,
  }
  return finalConfig;
};

export default extend(base, polling, {
  namespace: 'nftQuiz',
  state: {
    viewType: TYPES.MAIN, // 当前界面显示的内容
    inviteCode: '', // 邀请码
    todayAnswerInfo: {}, // 用户当天的答题情况
    learnDetail: {}, // 用户参与学习的抽奖情况
    answerList: [], // 当天活动的答题列表，含答案
    answerListProgress: {
      current: 0,
    }, //当前答题进度
    historyList: {
      currentPage: 1,
      items: [],
      pageSize: 10,
      totalNum: 0,
      totalPage: 0,
    }, // 历史答题记录
    activityConfig: {}, // 活动配置数据
    isActivityRegister: false, // 初始为 false
  },
  effects: {
    // 获取邀请码
    *getInviteCode(_, { call, put }) {
      const { data } = yield call(serv.getInvitationCode);
      yield put({
        type: 'update',
        payload: {
          inviteCode: data || '',
        },
      });
    },
    /**
     * 提交活动答题的答案
     * @param {*} param0 
     * @param {*} param1 
     */
    *postAnswer({ payload }, { call, put, select }) {
      const { data } = yield call(serv.commitAnswer, payload);
      if (!data) return;
      // 提交问题答案成功，更新当天答题情况
      const { todayAnswerInfo, activityConfig } = yield select((state) => state.nftQuiz);
      yield put({
        type: 'update',
        payload: {
          todayAnswerInfo: {
            ...(todayAnswerInfo || {}),
            ...(data || {})
          },
          answerListProgress: {
            current: 0,
          }
        }
      });
      yield put({
        type: 'getTodayAnswerInfo',
        payload: {
          id: activityConfig?.currentId,
        }
      });
    },
    /**
     * 提交NFT学习并抽奖
     * @param {*} param0 
     * @param {*} param1 
     */
    *applyLearnBouns({ payload }, { call, put }) {
      const { data } = yield call(serv.learnBounsApply, payload);
      return data;
    },
    /**
     * 获取题目及答案列表
     * @param {*} param0 
     * @param {*} param1 
     */
    *getAnswerList({ payload }, { call, put }) {
      const { data } = yield call(serv.getAnswerList, payload);
      if (!data) return;
      // 更新题目及答案列表
      yield put({
        type: 'update',
        payload: {
          answerList: data,
          answerListProgress: {
            current: 0,
          }
        },
      })
    },
    /**
     * 获取当天所属活动轮次的答题情况
     * @param {*} param0 
     * @param {*} param1 
     */
    *getTodayAnswerInfo({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.getTodayAnswerInfo, payload);
        if (!data) return;
        // 更新当天所属活动轮次的答题情况
        yield put({
          type: 'update',
          payload: {
            todayAnswerInfo: data,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * 获取历史答题记录
     * @param {*} param0 
     * @param {*} param1 
     */
    *getActivityRecords({ payload, withNext = false }, { call, put, select }) {
      const { historyList } = yield select((state) => state.nftQuiz);
      const {
        currentPage,
        totalPage,
        items: oldItems,
      } = historyList || {};
      const params = {
        pageSize,
        ...(payload || {}),
      };
      if (!params.currentPage) {
        params.currentPage = 1;
      }
      // 下拉加载下一页
      if (withNext) {
        // 分页参数不合法
        if (!currentPage || currentPage < 1) return;
        if (currentPage + 1 > totalPage) return;
        params.currentPage = currentPage + 1;
      }
      const { data } = yield call(serv.userActivityRecords, params);
      const items = (data && data.items) || [];
      const hasData = size(items) > 0;
      if (!data || !hasData) return;
      let listData = data;
      if (withNext) {
        const fragment = items;
        listData = {
          ...(data || {}),
          items: [
            ...(oldItems || []),
            ...(fragment || []),
          ]
        }
      }
      // 更新历史答题记录
      yield put({
        type: 'update',
        payload: {
          historyList: listData,
        },
      });
    },
    /**
     * 获取活动相关配置，如奖池，参与人数等
     * @param {*} param0 
     * @param {*} param1 
     */
    *getQuizConfig({ payload }, { call, put, select }) {
      const { activityConfig } = yield select((state) => state.nftQuiz);
      const _oldCurrentId = activityConfig.currentId;
      const { data } = yield call(serv.getQuizConfig, payload);
      if (!data) return;
      // 更新活动相关配置，如奖池，参与人数等
      const filterd = handleConfig(data);
      yield put({
        type: 'update',
        payload: {
          activityConfig: filterd,
        },
      });
      filterd._oldCurrentId = _oldCurrentId;
      return filterd;
    },
    /**
     * 请求用户是否参加活动的flag
     * @param {*} param0 
     * @param {*} param1 
     */
    getIsActivityRegister: [
      function* ({ payload: { userPass } = {} }, { put, call }) {
        const { data } = yield call(serv.isActivityRegister);
        // 更新用户是否参加活动的flag
        const isReg = !!data;
        yield put({
          type: 'update',
          payload: {
            isActivityRegister: isReg,
          },
        });
        if (!isReg && userPass) {
          yield put({
            type: 'applyActivity',
          })
        }
      },
      { type: 'takeLatest' },
    ],
    /**
     * 登记参与活动，没有的话，自动参与
     * @param {*} param0 
     * @param {*} param1 
     */
    *applyActivity({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.activityApply, payload);
        // 更新用户是否参加活动的flag
        yield put({
          type: 'update',
          payload: {
            isActivityRegister: !!data,
          },
        });
      } catch (e) {
        console.error(e);
        yield put({
          type: 'update',
          payload: {
            isActivityRegister: false,
          },
        });
      }
    },
    /**
     * 用户提交答题结果
     * @param {*} param0 
     * @param {*} param1 
     */
    *userCommitAnswer({ payload: { list, config } }, { call, put }) {
      if (!list || !config) return;
      const params = {
        id: config.id,
        answers: map(list, (item) => {
          return ({
            id: item.id,
            option: item._result,
          });
        })
      };
      yield put({
        type: 'postAnswer',
        payload: params,
      })
    },
  },
});
