import VerifiedTag from 'src/components/Account/Kyc/common/VerifiedTag';
import { customRender } from 'test/setup';

describe('test VerifiedTag', () => {
  test('test VerifiedTag', () => {
    customRender(<VerifiedTag />, {});
  });
});
