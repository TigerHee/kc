/**
 * Owner: roger.chen@kupotech.com
 */
import extend from 'dva-model-extend';
import {
  getCurrencyList,
  flashTradeCoin,
  likeCurrencyReason,
  queryLikeCounts,
  queryTradeDetail,
} from 'services/gembox';
import {baseModel} from 'utils/dva';
import Bridge from 'utils/bridge';
import {
  TRADE_TYPE_MAP,
  _getData,
  _compare,
  _formatHighLights,
} from 'components/Gembox/config';
import {isArray} from 'lodash';

export default extend(baseModel, {
  namespace: 'gembox',
  state: {
    kline: [],
    klineMap: [],
    hotCoinList: [],
    topOneInfo: {},
    gemBoxUpdateTime: 0,
    noticeTopicId: '29',
    isFav: undefined, // 是否已自选
    isInit: false, // 是否已经查询完数据
    isFlashTrade: false, // 是否支持闪兑
    openUserTradeInfoSheet: false, // 用户交易信息弹窗
    openOrderInfoSheet: false, // 用户订单信息弹窗
    likeList: [], // 点赞列表
    bigMoneyList: [], // 大户买卖列表
    proTraderList: [], // 熟手买卖列表
    bigOrdersBuy: [], // 大单买入
    bigOrdersSell: [], // 大单卖出
    broadcast_buy: [],
    broadcast_sell: [],
    tabMap: [], //切换的tab
    changeRate: 0, // 24小时涨跌幅，埋点使用
  },
  effects: {
    *checkIsFav({payload}, {put}) {
      // 检查是否已经自选
      const {symbolCode} = payload || {};
      if (!symbolCode) {
        return;
      }
      const {isFav} = yield Bridge.checkIsFavor(symbolCode);
      yield put({type: 'update', payload: {isFav: isFav || false}});
    },
    *getCurrencyList({payload}, {put, call, select}) {
      // 老版本会报错白屏，需要后端根据version参数进行版本控制
      const params = {
        version: '1.0',
      };
      const res = yield call(getCurrencyList, params);
      const {isInit, likeList} = yield select(state => state.gembox);
      if (!isInit) {
        yield put({
          type: 'update',
          payload: {
            isInit: true,
          },
        });
      }
      const {success, data} = res;
      if (success) {
        const {currencyList, noticeTopicId, gemBoxUpdateTime} = data || {};
        const {topOneInfo, tabMap} = _getData(currencyList, likeList);
        yield put({
          type: 'update',
          payload: {
            hotCoinList: currencyList,
            topOneInfo,
            noticeTopicId,
            gemBoxUpdateTime,
            tabMap,
          },
        });
        const {name} = topOneInfo || {};
        if (name) {
          yield put({
            type: 'flashTradeCoin',
            payload: {
              coin: name,
            },
          });
        }
        return name;
      }
    },
    *flashTradeCoin({payload}, {call, put}) {
      const {success, data} = yield call(flashTradeCoin, payload.coin);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            isFlashTrade: data,
          },
        });
      }
    },

    *likeCurrencyReason({payload}, {call, put}) {
      const {currency} = payload;
      const {success} = yield call(likeCurrencyReason, payload);
      if (success) {
        // 操作成功后查询更新状态
        yield put({
          type: 'queryLikeCounts',
          payload: {
            currency,
          },
        });
        return success;
      }
    },
    *queryLikeCounts({payload}, {call, put, select}) {
      const {
        topOneInfo,
        topOneInfo: {name, highLights = []},
      } = yield select(state => state.gembox);
      let params = {
        currency: name,
      };
      if (payload) {
        params = payload;
      }
      const {success, data} = yield call(queryLikeCounts, params);
      const _highLights = _formatHighLights(highLights, data);
      const _topOneInfo = {
        ...topOneInfo,
        highLights: _highLights,
      };
      if (success) {
        yield put({
          type: 'update',
          payload: {
            likeList: data || [],
            topOneInfo: _topOneInfo,
          },
        });
      }
    },
    *queryTradeDetail({payload}, {call, put}) {
      const {tradeType, tradeDirection: _direction} = payload;
      const {success, data} = yield call(queryTradeDetail, payload);
      if (success) {
        const _data =
          data && isArray(data)
            ? data.map((i, index) => {
                return {...i, order: index + 1};
              })
            : [];
        let keyName = '';
        switch (tradeType) {
          case TRADE_TYPE_MAP.BIG_MONEY:
            keyName = 'bigMoneyList';
            break;
          case TRADE_TYPE_MAP.PRO_TRADER:
            keyName = 'proTraderList';
            break;
          case TRADE_TYPE_MAP.BIG_ORDER:
            keyName = _direction === 'BUY' ? 'bigOrdersBuy' : 'bigOrdersSell';
            break;
          case TRADE_TYPE_MAP.BROADCAST:
            keyName = _direction === 'BUY' ? 'broadcast_buy' : 'broadcast_sell';
            break;
          default:
            keyName = '';
            break;
        }
        yield put({
          type: 'update',
          payload: {
            [keyName]: _data,
          },
        });
      }
    },
    *updateCurrencyList({payload}, {put, select}) {
      const {
        topOneInfo: {name, highLights},
        likeList,
        broadcast_buy,
        broadcast_sell,
      } = yield select(state => state.gembox);
      const {currencyList, noticeTopicId, gemBoxUpdateTime} = payload || {};
      if (!currencyList) {
        return;
      }
      const {topOneInfo, tabMap} = _getData(currencyList, likeList);
      const {
        name: _name,
        broadcast = [],
        highLights: _highLights,
      } = topOneInfo || {};
      if (name !== _name) {
        yield put({
          type: 'flashTradeCoin',
          payload: {
            coin: _name,
          },
        });
      }
      // 根据点赞数likeList格式化
      yield put({
        type: 'update',
        payload: {
          hotCoinList: currencyList,
          topOneInfo,
          noticeTopicId,
          gemBoxUpdateTime,
          tabMap,
        },
      });
      // 对比新推送的字段highLights是否有新的，有新的要请求点赞接口
      const sameLikeCounts = _highLights.every(i => {
        const {type, tradeDirection} = i;
        const isSame = highLights.some(
          item => item.type === type && item.tradeDirection === tradeDirection,
        );
        return isSame;
      });
      if (!sameLikeCounts) {
        yield put({
          type: 'queryLikeCounts',
          payload: {
            currency: _name,
          },
        });
      }
      const {getBuy, getSell} = _compare(
        broadcast,
        broadcast_buy,
        broadcast_sell,
      );
      if (getBuy) {
        yield put({
          type: 'queryTradeDetail',
          payload: {
            currency: _name,
            tradeType: 'BROADCAST',
            tradeDirection: 'BUY',
          },
        });
      }
      if (getSell) {
        yield put({
          type: 'queryTradeDetail',
          payload: {
            currency: _name,
            tradeType: 'BROADCAST',
            tradeDirection: 'SELL',
          },
        });
      }
    },
  },
  subscriptions: {
    setUp({dispatch}) {
      dispatch({type: 'getCurrencyList'});
    },
  },
});
