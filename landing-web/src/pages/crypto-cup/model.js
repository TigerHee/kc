/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { get } from 'lodash';
import * as services from 'services/cryptoCup';
import base from 'utils/common_models/base';
import {
  toastByCode,
  toastByErrObj,
  HELP_RESULT_CONFIG,
  toastNoScore,
} from 'components/$/CryptoCup/config';

export default extend(base, {
  namespace: 'cryptoCup',
  state: {
    // 活动详情
    campaigns: {},
    campaignTeams: [],
    campaignTeamsTotalNum: 0,
    // 当前选中的赛季(默认为进行中的赛季，用户点击也会改变此状态)
    curSelectedSeasonIndex: undefined,
    // 积分排行 tabIndex 0~3
    pointsListTabIndex: 0,
    registInfo: {}, // 我的报名
    isJoin: false, // 已报名
    detailTeam: [], // 其他赛场弹窗的队伍详情
    pointRanking: [],
    inviteCode: '', // 邀请码
    teamRecords: [], // 赛季所有队伍积分
    teamIdRecords: [], // 队伍id获取的队伍积分
    raceList: [], // 比赛列表
    scoreData: { pointDetailList: [] }, // 积分列表
    scode: '', // 分享码
    innviteModalVisible: false,
    unclaimedList: [], // 比赛结果
    invitor: 0, // 邀请我助力的人
    helpModalVisible: false, // 帮别人助力的弹窗
    helpModalName: '', // 帮别人助力的结果：枚举值：login-要求登录、success-成功、joined-参与过、helped-助力过、limit-已达上限、ended-已结束
    openedRewards: [], // 比赛后开盲盒的结果
    sucRaceModalVisible: false, // 竞赛胜利中场界面
    failRaceModalVisible: false, // 竞赛失败中场界面
    sucRewardModalVisible: false, // 竞赛胜利开盲盒结果弹窗
    failRewardModalVisible: false, // 竞赛失败开盲盒结果弹窗
    isFinalRace: false, // 比赛奖励是否是决赛奖励
    isSubscribe: false, // 是否订阅
    mySeasonScore: 0, // 我的本场累计上分
    obtainedList: [], // 所有奖品的列表
    curIndex: 0, // 当前奖品的索引
    seasonNameEn: '', // 场次奖励的名称
  },
  reducers: {
    selfAddCurIndex(state) {
      return {
        ...state,
        curIndex: state.curIndex + 1,
      };
    },
  },
  effects: {
    // 5.1.活动详情
    *getCampaigns({ payload }, { call, put }) {
      try {
        const res = yield call(services.getCampaigns, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return;
        }

        yield put({
          type: 'update',
          payload: {
            campaigns: data || {},
          },
        });
        return data || {};
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    *getRanking({ payload }, { call, put }) {
      try {
        const res = yield call(services.getRanking, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return;
        }

        yield put({
          type: 'update',
          payload: {
            pointRanking: data || [],
          },
        });
        return data || [];
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取队伍
    *getCampaignTeams({ payload }, { call, put }) {
      try {
        const res = yield call(services.getCampaignTeams, payload);
        const { code = '', items, totalNum } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return;
        }

        yield put({
          type: 'update',
          payload: {
            campaignTeams: items || [],
            campaignTeamsTotalNum: totalNum || 0,
          },
        });
        return items || [];
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 活动注册(加入队伍)
    *joinTeam({ payload }, { call, put }) {
      try {
        const res = yield call(services.joinTeam, payload);
        const { code = '' } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }
        return true;
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 我的报名
    *getRegistInfo({ payload }, { call, put }) {
      try {
        const res = yield call(services.getRegistInfo, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return;
        }

        const myTeams = get(data, 'seasons[0].teams.length', 0);
        yield put({
          type: 'update',
          payload: {
            registInfo: data,
            isJoin: myTeams > 0 ? true : false,
          },
        });
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 上报首次进入&订阅
    *uploadBehavior({ payload }, { call }) {
      try {
        const res = yield call(services.uploadBehavior, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }

        return data;
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取首次进入&订阅
    *getBehavior({ payload }, { call, put }) {
      try {
        const res = yield call(services.getBehavior, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }

        yield put({
          type: 'update',
          payload: {
            isSubscribe: data,
          },
        });
        return data;
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取邀请码
    *getInviteCode(_, { call, put }) {
      try {
        const res = yield call(services.getInvitationCode);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }

        yield put({
          type: 'update',
          payload: {
            inviteCode: data || '',
          },
        });
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 队伍积分详情
    *getTeamRecords({ payload }, { call, put }) {
      try {
        const { data } = yield call(services.getTeamRecords, payload);

        // seasonId获取的数据
        if (payload.seasonId && !payload.teamIdList) {
          yield put({
            type: 'update',
            payload: {
              teamRecords: data || [],
            },
          });
        } else {
          // teamIdList获取的数据
          yield put({
            type: 'update',
            payload: {
              teamIdRecords: data || [],
            },
          });
        }
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取我的比赛列表
    *getMyRace({ payload }, { call, put }) {
      try {
        const res = yield call(services.getMyRace, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }
        yield put({
          type: 'update',
          payload: {
            raceList: data || [],
          },
        });
        return data || [];
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取我的积分列表
    *getMyScore({ payload }, { call, put }) {
      try {
        const res = yield call(services.getMyScore, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }
        if (payload?.seasonId) {
          yield put({
            type: 'update',
            payload: {
              mySeasonScore: data?.totalPoint || 0,
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              scoreData: data || { pointDetailList: [] },
            },
          });
        }

        return data || { pointDetailList: [] };
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取我的分享码
    *getShareCode({ payload }, { call, put }) {
      try {
        const res = yield call(services.getShareCode, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }
        yield put({
          type: 'update',
          payload: {
            scode: data || '',
          },
        });
        return data || '';
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 给分享助力
    *assistShare({ payload }, { call, put }) {
      try {
        yield call(services.assistShare, payload);
        yield put({
          type: 'update',
          payload: {
            helpModalName: HELP_RESULT_CONFIG[200],
          },
        });
        return true;
      } catch (error) {
        const errorCode = error?.code;
        if (HELP_RESULT_CONFIG[errorCode]) {
          yield put({
            type: 'update',
            payload: {
              helpModalName: HELP_RESULT_CONFIG[+errorCode] || '',
            },
          });
        } else {
          toastByCode(errorCode);
        }
      }
    },
    // 通过scode反查邀请者
    *queryInvitor({ payload }, { call, put }) {
      try {
        const res = yield call(services.queryInvitor, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }
        yield put({
          type: 'update',
          payload: {
            invitor: data || '',
            helpModalVisible: !!data,
          },
        });
        return data || '';
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取比赛结果
    *getRaceResult({ payload }, { call, put }) {
      try {
        const res = yield call(services.getRaceResult, payload);
        const { code = '', data } = res || {};

        if (String(code) !== '200') {
          toastByCode(code);
          return false;
        }
        yield put({
          type: 'update',
          payload: {
            unclaimedList: data || [],
          },
        });
        return data || [];
      } catch (error) {
        console.error('cryptoCup api error:', error);
        toastByErrObj(error);
      }
    },
    // 获取比赛结果、
    *obtainReward({ payload }, { call }) {
      try {
        const res = yield call(services.obtainReward, payload);
        return res;
      } catch (e) {
        return e;
      }
    },
    // 获取队伍的场次奖励结果
    *getTeamRewards({ payload }, { call, put }) {
      try {
        const res = yield call(services.getTeamRewards, payload);
        const { data } = res || {};

        yield put({
          type: 'update',
          payload: {
            openedRewards: data || [],
          },
        });
        return data || [];
      } catch (error) {
        console.error('cryptoCup api error:', error);
        const code = error?.code;
        const stringCode = String(code);

        if (stringCode === '500007' || stringCode === '500034') {
          toastNoScore();
          return false;
        }

        toastByErrObj(error);
      }
    },
  },
  subscriptions: {},
});
