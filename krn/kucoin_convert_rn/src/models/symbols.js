/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import {getCoinsCategory} from 'services/symbols';
import {baseModel} from 'utils/dva';

const maxPrecision = 8;

export default extend(baseModel, {
  namespace: 'symbols',
  state: {
    categories: {},
  },
  effects: {
    *getCoinsCategory({payload}, {put, call}) {
      const {success, data} = yield call(getCoinsCategory);
      if (success) {
        const categories = {};
        (data.kucoin || []).forEach(item => {
          item.precision = parseInt(item.precision || maxPrecision, 10);
          categories[item.currency] = item;
        });
        yield put({type: 'update', payload: {categories}});
      }
    },
  },
});
