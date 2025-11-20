/**
 * Owner: solar@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';

export default extend(base, {
  namespace: 'transfer',
  state: {
    visible: false,
    initCurrency: '',
    cusOnClose: null,
  },
  effects: {},
});
