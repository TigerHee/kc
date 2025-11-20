/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';

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
