/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-10-20 16:35:12
 * @Description: 只需拉取一次的配置型数据处理
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { each } from 'lodash';
import { getCrossCurrencies, getKcsProfitRate, getLoanCurrencies } from 'services/margin';
import { delay } from 'utils/delay';

// dispatch过的Effect
const loadedEffect = {};

export default extend(base, {
  namespace: 'marginConfig',
  state: {
    kcsProfitRate: null,
    crossCurrencies: [],
    crossCurrenciesMap: {},
    loanCurrencies: [],
    loanCurrenciesMap: {},
  },
  reducers: {},
  effects: {
    *pullCrossCurrencies({ payload = {} }, { put, call }) {
      if (loadedEffect.pullCrossCurrencies) return;
      loadedEffect.pullCrossCurrencies = true;
      try {
        const { data } = yield call(getCrossCurrencies, payload);
        const crossCurrenciesMap = {};
        each(data, (item) => {
          crossCurrenciesMap[item.currency] = item;
        });
        yield put({
          type: 'update',
          payload: {
            crossCurrenciesMap,
            crossCurrencies: data,
          },
        });
      } catch (e) {
        loadedEffect.pullCrossCurrencies = false;
        yield call(delay, 3000);
        yield put({ type: 'pullCrossCurrencies' });
      }
    },
    *pullLoanCurrencies({ payload = {} }, { put, call }) {
      if (loadedEffect.pullLoanCurrencies) return;
      loadedEffect.pullLoanCurrencies = true;
      try {
        const { data } = yield call(getLoanCurrencies, payload);
        const loanCurrenciesMap = {};
        each(data, (item) => {
          loanCurrenciesMap[item.currency] = item;
        });
        yield put({
          type: 'update',
          payload: {
            loanCurrenciesMap,
            loanCurrencies: data,
          },
        });
      } catch (e) {
        loadedEffect.pullLoanCurrencies = false;
        yield call(delay, 3000);
        yield put({ type: 'pullCrossCurrencies' });
      }
    },
    *pullKcsProfitRate({ payload = {} }, { put, call }) {
      if (loadedEffect.pullKcsProfitRate) return;
      loadedEffect.pullKcsProfitRate = true;
      try {
        const { data } = yield call(getKcsProfitRate, payload);
        yield put({
          type: 'update',
          payload: {
            kcsProfitRate: data,
          },
        });
      } catch (e) {
        loadedEffect.pullKcsProfitRate = false;
        yield call(delay, 3000);
        yield put({ type: 'pullCrossCurrencies' });
      }
    },
  },
  subscriptions: {},
});
