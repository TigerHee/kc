import {createTransform} from 'redux-persist';
import reducers from 'models/kyc';

export default createTransform(
  inboundState => {
    return {
      privileges: inboundState.privileges,
      kycInfo: inboundState.kycInfo,
      kybInfo: inboundState.kybInfo,
      kycClearInfo: inboundState.kycClearInfo,
      rewardInfo: inboundState.rewardInfo,
      recharged: inboundState.recharged,
      traded: inboundState.traded,
      financeListKYC: inboundState.financeListKYC,
    };
  },
  outboundState => {
    return {
      ...reducers.state,
      ...outboundState,
    };
  },
  {whitelist: ['kyc']},
);
