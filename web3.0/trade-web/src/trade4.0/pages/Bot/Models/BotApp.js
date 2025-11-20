/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { initLocale } from 'utils/lang';
import forEach from 'lodash/forEach';
import { getLangKey } from 'Bot/config';
import { getSymbolMatch, getBotUserInfo } from 'Bot/services/machine';
import { currentLang } from '@kucoin-base/i18n';

const tempStatus = {
  getBotLangLoading: false,
};
/**
 * @description:
 * @return {*}
 */
export default extend(base, {
  namespace: 'BotApp',
  state: {
    isReady: false, // 整个bot的标记
    currentLangReady: false, // 机器人自己业务语言包加载状态
    botMatchSymbolMap: {}, // 所有现货、合约支持的策略的交易对map
    kycCountryCode: undefined,
  },
  effects: {
    *getBotLang(_, { call, put, select }) {
      const currentLangReady = yield select((state) => state.BotApp.currentLangReady);
      if (currentLangReady || tempStatus.getBotLangLoading) {
        return true;
      }
      try {
        tempStatus.getBotLangLoading = true;
        // 添加机器人语言前缀B_, 以区分
        const mergeCallback = (langData = {}) => {
          const newLangData = {};
          forEach(langData, (val, key) => {
            newLangData[getLangKey(key)] = val;
          });
          return newLangData;
        };
        yield call(initLocale, currentLang, 'BotLocale', mergeCallback);
        yield put({
          type: 'update',
          payload: {
            currentLangReady: true,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        tempStatus.getBotLangLoading = false;
      }
      console.log('lang ready');
    },
    // 主要用里面kycCountryCode字段
    *getBotUserInfo({ payload }, { put, call, select }) {
      const kycCountryCode = yield select(state => state.BotApp.kycCountryCode);
      if (kycCountryCode) return kycCountryCode;

      try {
        const { data } = yield call(getBotUserInfo);
        yield put({
          type: 'update',
          payload: {
            kycCountryCode: data.kycCountryCode,
          },
        });
      } catch (error) {
        return 'none';
      }
    },
    // 所有现货、合约支持的策略的交易对map
    *getBotMatchSymbolLists(_, { call, put }) {
      try {
        const { data: map } = yield call(getSymbolMatch);
        yield put({
          type: 'update',
          payload: {
            botMatchSymbolMap: map,
          },
        });
      } catch (error) {
        console.log(error);
      }
      console.log('match ready');
    },
    // 启动
    *initBotAppData({ payload: { source } }, { put }) {
      yield put({
        type: source === 'orderCenter' ? 'initBotAppForOrder' : 'initBotAppForTrade',
      });
    },
    *initBotAppForTrade({ payload }, { put, all }) {
      // 接口可以并发
      yield all([
        // 拉取语言包
        yield put({
          type: 'getBotLang',
        }),
        // 触发订单中心情况下交易对精度获取、策略交易对匹配检查数据
        yield put({
          type: 'getBotMatchSymbolLists',
        }),
        // 智能持仓调仓频率数据
        yield put({
          type: 'smarttrade/getAjustWay',
        }),
      ]);

      console.log('initBotAppForTrade ready');
      yield put({
        type: 'update',
        payload: {
          isReady: true,
        },
      });
    },
    *initBotAppForOrder({ payload }, { put, all }) {
      // 先拉取语言包 成功后，在拉其他的
      yield put.resolve({
        type: 'getBotLang',
      });

      yield all([
        // 触发订单中心情况下交易对精度获取、策略交易对匹配检查数据
        yield put({
          type: 'BotMFInit/init',
        }),
        // 智能持仓调仓频率数据
        yield put({
          type: 'smarttrade/getAjustWay',
        }),
      ]);

      console.log('initBotAppForOrder ready');
      yield put({
        type: 'update',
        payload: {
          isReady: true,
        },
      });
    },
  },
  subscriptions: {},
});
