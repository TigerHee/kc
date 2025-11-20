/**
 * Owner: willen@kupotech.com
 */
import {createTransform} from 'redux-persist';
import symbolsReducer from 'models/symbols';

// symbols持久化
export default createTransform(
  inboundState => {
    const newCategories = {};
    Object.keys(inboundState.categories).forEach(key => {
      const item = inboundState.categories[key];
      newCategories[key] = {
        currency: item.currency,
        currencyName: item.currencyName,
        precision: item.precision,
        iconUrl: item.iconUrl,
        name: item.name,
      };
    });
    // 只持久化categories，其他取默认state
    return {categories: newCategories};
  },
  (outboundState, key) => {
    return {
      ...symbolsReducer.state,
      ...outboundState,
    };
  },
  {whitelist: ['symbols']},
);
