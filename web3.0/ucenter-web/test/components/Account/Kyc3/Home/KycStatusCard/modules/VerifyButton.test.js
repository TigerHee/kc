import VerifyButton from 'src/components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { customRender } from 'test/setup';

describe('test VerifyButton', () => {
  test('test VerifyButton', () => {
    customRender(<VerifyButton />, {});
  });
});
