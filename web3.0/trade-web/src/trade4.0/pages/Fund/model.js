/**
 * Owner: mike@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import Storage from 'utils/storage';
import { fundTableHeadFilterCfg } from './config';
import { MARGIN, SPOT, ISOLATED, FUTURES } from '@/meta/const';
import { SYMBOL_FILTER_ENUM } from '../Orders/FuturesOrders/config';

/**
 * @description: 初始本地
 * @param {*} type
 * @return {*}
 */
const initLocal = (type) => {
  return Boolean(Number(Storage.getItem(fundTableHeadFilterCfg.get(type).cacheKey)));
};
export default extend(base, {
  namespace: 'fund',
  state: {
    isHideSmallAssets: initLocal(SPOT), // 小额资产
    isLiabilityOnly: initLocal(MARGIN), // 负债
    isCurrencyPairOnly: initLocal(ISOLATED), // 只显示当前交易对
    [SYMBOL_FILTER_ENUM.FUTURES_POSITION]: initLocal(FUTURES), // 合约只显示当前交易对
  },
  reducers: {
    updateFundHeadFilter(state, { payload }) {
      const { cacheKey, cacheValue, ...rest } = payload;
      Storage.setItem(cacheKey, Number(cacheValue));
      return {
        ...state,
        ...rest,
      };
    },
  },
  effects: {},
  subscriptions: {},
});
