/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';

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
  effects: {},
  subscriptions: {
    // setUp({ dispatch }) {
    //   dispatch({ type: 'pull' });
    // },
  },
});
