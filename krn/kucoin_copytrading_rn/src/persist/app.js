import {createTransform} from 'redux-persist';

import reducers from 'models/futures';

export default createTransform(
  inboundState => {
    return {
      futuresSymbolsMap: inboundState.futuresSymbolsMap,
      futuresCurrenciesMap: inboundState.futuresCurrenciesMap,
    };
  },
  outboundState => {
    return {
      ...reducers.state,
      ...outboundState,
    };
  },
  {whitelist: ['futures']},
);
