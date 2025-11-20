/**
 * Owner: willen@kupotech.com
 */
import {createTransform} from 'redux-persist';
import orderReducer from 'models/order';

export default createTransform(
  inboundState => {
    return {
      orderCoinList: inboundState.orderCoinList,
    };
  },
  outboundState => {
    return {
      ...orderReducer.state,
      ...outboundState,
    };
  },
  {whitelist: ['order']},
);
