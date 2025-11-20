/**
 * Owner: mcqueen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import polling from 'common/models/polling';
import mulPagination from 'common/models/mulPagination';
import * as serv from 'services/newhomepage';
import * as redPacketServ from 'services/redPacket.js';
import { HOME_CURRENCY } from 'config/base';
import { separateNumber } from 'helper';
const initStatistics = [
  {
    num: 576804751,
  },
  {
    num: 59435916755,
  },
];

export default extend(base, polling, mulPagination, {
  namespace: 'newhomepage',
  state: {
    news: [], // 最新的活动三条,
    banners: [], // 轮播活动banner
    transactions: 0, // 交易人次
    volumes: 0, // 成交总额
    ads: [], // 广告列表，轮播图
    tickers: [],
    statistics: initStatistics,
    currencies: [], // 所有的币种
    redPacketList: [], // 红包领取记录
    redPacketInfo: {}, // 红包弹窗信息
    receivedInfo: {}, // 领取红包信息
    redPacketPhone: {}, // 记录当前领取手机号信息
    KuRewardsConfig: {}, // 福利中心新人配置数据
    filters: {
      page: 1,
      pageSize: 5,
      hasMore: true,
    },
    summary: {
      TRADING_VOLUME: 576804751,
    },
    configItems: {}, // 页面配置项，比如用户总数，币种总数等
  },
  effects: {
    // 获取首页配置，下载链接，FAQ，数据
    *pullPageConfigItems({ payload }, { put, call }) {
      const { data } = yield call(serv.getPageConfigItems, {
        businessLine: 'platform-reward',
        codes: ['webHomepageData'].join(','),
      });
      const items = data?.properties || [];
      let configItems = {};
      items.forEach((item) => {
        // 只保留有用的配置项
        configItems[item.property] = { value: item.value, backupValues: item.backupValues };
      });

      yield put({ type: 'update', payload: { configItems } });
    },
    *pullRedPacketInfo({ payload }, { put, call }) {
      const { data } = yield call(redPacketServ.pullRedPacketInfo, payload);
      const { sendRecordId } = data;
      yield put({
        type: 'update',
        payload: {
          redPacketInfo: data,
        },
      });
      yield put({
        type: 'getReceiveInfo',
        payload: { sendRecordId },
      });
    },
    // POST-领取奖励
    *getReward({ payload, callBack }, { put, call, select }) {
      const { isLogin } = yield select((state) => state.user);
      const { success, data } = isLogin
        ? yield call(redPacketServ.getRewardByLogin, payload)
        : yield call(redPacketServ.getRewardByPhone, payload);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            redPacketPhone: { ...payload },
            receivedInfo: data,
          },
        });
        if (callBack) {
          callBack();
        }
      }
    },
    // 获得领取信息（已经领取2/3个，总计500kcs，以及领取人信息）
    *getReceiveInfo({ callBack }, { put, call, select }) {
      const { isLogin } = yield select((state) => state.user);
      const { redPacketPhone, redPacketInfo } = yield select((state) => state.newhomepage);
      const { phone } = redPacketPhone;
      const { sendRecordId } = redPacketInfo;
      let footerData = {};
      if (!isLogin && phone) {
        const { data } = yield call(redPacketServ.queryRecord, { ...redPacketPhone, sendRecordId });
        footerData = data;
      } else {
        const { data } = yield call(redPacketServ.queryRecordbyLogin, { sendRecordId });
        footerData = data;
      }
      yield put({
        type: 'update',
        payload: {
          redPacketFooterInfo: footerData,
        },
      });
      if (callBack) {
        callBack(footerData);
      }
    },
    // 获得红包领取列表
    *getRedPacketList({ payload }, { put, call, select }) {
      const { filters, redPacketInfo, redPacketList } = yield select((state) => state.newhomepage);
      const { sendRecordId } = redPacketInfo;
      const { page } = payload;
      const { pageSize } = filters;
      try {
        const params = { sendRecordId, size: pageSize };
        if (page !== 1) {
          // 不是查询首页
          if (redPacketList && redPacketList.length) {
            // 取出已有列表的最后一个索引值
            const { index = 0 } = redPacketList[redPacketList.length - 1] || {};
            params.index = index;
          }
        }
        const { hasMore = true, dataList } = yield call(redPacketServ.getReceiveList, params);
        const _list = page === 1 ? dataList : [...redPacketList, ...dataList];
        yield put({
          type: 'update',
          payload: {
            redPacketList: _list,
            filters: {
              ...filters,
              hasMore,
            },
          },
        });
      } catch (e) {
        console.error(e);
        yield put({
          type: 'update',
          payload: {
            list: [],
            filters: {
              ...filters,
              hasMore: false,
            },
          },
        });
      }
    },
    *pullNews(action, { call, put }) {
      try {
        const { items } = yield call(serv.getNews, { pageSize: 3 });
        yield put({
          type: 'update',
          payload: {
            news: (items || []).sort((a, b) => {
              return a.stick - b.stick;
            }),
          },
        });
      } catch (e) {
        console.log('newhomepage pullNews error');
        // Raven.captureException(e);
      }
    },
    *pullStatistics(action, { select, call, put }) {
      try {
        const { statistics } = yield select((state) => state.newhomepage);
        const { data } = yield call(serv.pullContractStatistics);
        const { transactions, volumes } = data;
        const _statistics = [...statistics];
        _statistics[0].num = transactions;
        _statistics[1].num = volumes;
        yield put({ type: 'update', payload: { statistics: _statistics } });
      } catch (e) {
        console.log('newhomepage pullStatistics error');
        // Raven.captureException(e);
      }
    },
    *getAds({ payload }, { call, put }) {
      try {
        const { data } = yield call(serv.getAds, payload);
        yield put({ type: 'update', payload: { ads: data } });
      } catch (e) {
        console.log('newhomepage getAds error');
        // Raven.captureException(e);
      }
    },
    *queryTickers(action, { call, put }) {
      try {
        const { items } = yield call(serv.queryTickers);
        yield put({ type: 'update', payload: { tickers: items } });
      } catch (e) {
        console.log('newhomepage queryTickers error');
        // Raven.captureException(e);
      }
    },
    *pullNewStatistics(action, { call, put }) {
      try {
        const { data } = yield call(serv.getSummary, HOME_CURRENCY);
        let contractData = null;
        try {
          contractData = yield call(serv.getContractSummary, 'USDT');
        } catch (e) {
          contractData = { data: { volume: 0 } };
        }
        const {
          data: { volume: contractVolume },
        } = contractData;
        const summary = {
          map: {},
        };
        if (data) {
          data.forEach((item) => {
            summary.map[item.type] = item;
            summary[item.type] = item.amount;
          });
        }
        // 交易量统计加入合约的交易量
        if (summary.TRADING_VOLUME !== undefined) {
          const item = summary.map.TRADING_VOLUME;
          item.amount = contractVolume;
          summary.TRADING_VOLUME = item.amount;
        }
        yield put({
          type: 'update',
          payload: { summary },
        });
      } catch (error) {}
    },
    *getKuRewardsNewcomerConfig(_, { select, put, call }) {
      const { data } = yield call(serv.getKuRewardsNewcomerConfig, {});
      yield put({
        type: 'update',
        payload: {
          KuRewardsConfig: {
            ...data,
            totalRewardAmountNum: data?.totalRewardAmount || 0, // 新人福利总金额
            signUpDisplayAmountNum: data?.signUpDisplayAmount || 0, // 注册福利总金额
          },
        },
      });
    },
  },
  reducers: {},
  subscriptions: {
    watchTotalPolling({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: {
          effect: 'pullNewStatistics',
          interval: 20 * 1000,
        },
      });
    },
  },
});
