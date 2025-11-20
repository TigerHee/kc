import IdentityIPFlow from 'src/components/Account/Kyc/common/IdentityIPFlow';
import { customRender } from 'test/setup';

describe('test IdentityIPFlow', () => {
  test('test IdentityIPFlow', () => {
    customRender(<IdentityIPFlow />, {});
    customRender(<IdentityIPFlow type="PI" />, {});
    customRender(<IdentityIPFlow type="KYB" />, {});
  });
});
