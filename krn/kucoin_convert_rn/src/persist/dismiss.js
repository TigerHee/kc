/**
 * Owner: willen@kupotech.com
 */
import {createTransform} from 'redux-persist';
import orderReducer from 'models/dismiss';

export default createTransform(
  inboundState => {
    return {
      dismissInfo: inboundState.dismissInfo,
    };
  },
  outboundState => {
    return {
      ...orderReducer.state,
      ...outboundState,
    };
  },
  {whitelist: ['dismiss']},
);
