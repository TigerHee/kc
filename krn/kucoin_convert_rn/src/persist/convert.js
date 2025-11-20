/**
 * Owner: willen@kupotech.com
 */
import {createTransform} from 'redux-persist';
import convertReducer from 'models/convert';

// convert持久化
export default createTransform(
  inboundState => {
    // 只持久化部分state，其他取默认state
    return {
      selectAccountType: inboundState.selectAccountType,
      // coinMap: inboundState.coinMap,
      baseConfig: inboundState.baseConfig,
      // marginMarkMap: inboundState.marginMarkMap,
    };
  },
  outboundState => {
    return {
      ...convertReducer.state,
      ...outboundState,
    };
  },
  {whitelist: ['convert']},
);
