/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import mulPagination from 'common/models/mulPagination';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import { forEach } from 'lodash';
import { getSymbolTick } from 'services/market';
import { getCoinList } from 'services/newCurrency';
import * as serv from 'services/newhomepage';

// 获取交易对行情数据map
const getSymbolTickMap = (list) => {
  if (!list || !list.length) {
    return {};
  }
  const map = {};
  forEach(list, (item) => {
    const { changeRate, lastTradedPrice, symbolCode } = item || {};
    if (symbolCode) {
      map[symbolCode] = {
        change: changeRate || 0,
        price: lastTradedPrice || 0,
        name: '',
        symbolCode,
      };
    }
  });
  return map;
};

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
    ads: [], // 广告列表，轮播图
    statistics: initStatistics,
    currencies: [], // 所有的币种
    filters: {
      page: 1,
      pageSize: 5,
      hasMore: true,
    },
    newCoins: [], // 新币列表
    topList: [], // 涨幅榜
    hotCoins: [], // 热搜榜
    trendMap: {}, // 趋势数据
    recharged: false, // 用户充值记录
    extraParams: {}, // 新手专区开关合集
    KuRewardsConfig: {}, // 福利中心新人配置数据
    totalAssets: null, // 用户余额
  },
  effects: {
    *getCoinList({ payload }, { call, put }) {
      // INCREASE NEW_CURRENCY  algorithm传参
      try {
        const { success, data } = yield call(getCoinList, {
          algorithm: payload.algorithm,
          type: 'LIST',
        });
        if (success) {
          const result = [];
          const list = data && data.items ? data.items : [];
          // 按时间排序，优先取最新的
          // const list = orderBy(_list, 'openingTime', 'desc');  // 更换的接口返回有排序，去掉前端排序
          // 取出所有交易对，去获取实时数据，只取前5条，后续提出技术优化卡来改进，直接从接口拿5条
          const symbolList = [];
          if (list.length) {
            for (let i = 0; i < list.length; i++) {
              const item = list[i] || {};
              const { symbolCode } = item;
              if (symbolCode) {
                symbolList.push(symbolCode);
                result.push(item);
              }
              if (symbolList.length >= 5) {
                break;
              }
            }
          }
          if (symbolList && symbolList.length) {
            const symbols = symbolList.join(',');
            const { success: _success, data: _data } = yield call(getSymbolTick, { symbols });
            if (_success && _data && _data.length) {
              const map = getSymbolTickMap(_data);
              // 将实时数据写入结果
              forEach(result, (item, index) => {
                const { symbolCode, iconUrl, name, item: currencyCode } = item || {};
                const obj = map[symbolCode || ''] || null;
                if (obj) {
                  result[index] = {
                    ...obj,
                    indexName: '',
                    iconUrl,
                    currencyCode,
                    currency: name,
                    name,
                  };
                } else {
                  result[index] = {
                    ...item,
                    currencyCode,
                    currency: name,
                    symbolCode: symbolCode || '',
                    name,
                  };
                }
              });
            }
          }
          yield put({
            type: 'update',
            payload: {
              [payload.keyName]: result || [],
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *getKLineData({ payload }, { call, put, select }) {
      try {
        const { trendMap } = yield select((state) => state.newhomepage);
        const { symbol, begin, end } = payload || {};
        if (trendMap[symbol]) {
          // 不重复查询
          return;
        }
        const { success, data } = yield call(serv.getKLineData, {
          symbol,
          type: '5min',
          begin,
          end,
        });
        if (success) {
          const list = data || [];
          const result = [];
          forEach(list, (item) => {
            if (item && item.length > 2) {
              const key = item[0];
              const val = item[2];
              if (key && val !== undefined) {
                result.push([Number(key), Number(val)]);
              }
            }
          });
          result.sort((a, b) => Number(a[0]) - Number(b[0]));
          trendMap[symbol] = result;
          yield put({
            type: 'update',
            payload: {
              trendMap: { ...trendMap },
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *getKuRewardsNewcomerConfig(_, { put, call }) {
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
});
