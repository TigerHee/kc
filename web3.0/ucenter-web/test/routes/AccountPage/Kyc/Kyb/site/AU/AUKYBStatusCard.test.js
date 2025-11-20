import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import AUKYBStatusCard from 'src/routes/AccountPage/Kyc/Kyb/Home/site/AU/components/AUKYBStatusCard/index';
import { customRender } from 'test/setup';

const INIT_KYC_INFO = {
  status: KYC_STATUS_ENUM.UNVERIFIED,
  failReasonList: [],
  extraInfo: null,
};
const state = {
  kyc_au: {
    kyb1: INIT_KYC_INFO,
    kyb2: INIT_KYC_INFO,
    kyb3: INIT_KYC_INFO,
    kybCountryList: [],
  },
  kyc: {
    kybInfo: {},
  },
};

describe('test AUKYBStatusCard', () => {
  test('test AUKYBStatusCard', () => {
    customRender(<AUKYBStatusCard onBack={() => {}} isInMigrate={false} />, state);
    customRender(<AUKYBStatusCard isInMigrate={true} />, state);
  });
});
