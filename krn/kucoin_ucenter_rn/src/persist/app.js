import {createTransform} from 'redux-persist';
import reducers from 'models/app';

export default createTransform(
  inboundState => {
    return {
      currencyList: inboundState.currencyList,
      __uid: inboundState?.userInfo?.uid,
    };
  },
  outboundState => {
    return {
      ...reducers.state,
      ...outboundState,
    };
  },
  {whitelist: ['app']},
);
