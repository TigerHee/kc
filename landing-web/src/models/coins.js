/**
 * Owner: jesse.shao@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-07-05 16:09:39
 * @FilePath: /landing-web/src/models/coins.js
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';

export default extend(base, {
  namespace: 'coins',
  state: {
    list: [],
    coinNamesMap: {},
    poolCoinsMap: {},
    kumexCoinsMap: {},
    poolCoins: [],
    kumexCoins: [],
  },
  reducers: {},
  effects: {
  },
  subscriptions: {
    // setUp({ dispatch }) {
    //   dispatch({ type: 'pull' });
    // },
  },
});
