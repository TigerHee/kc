import Description from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Description';
import { customRender } from 'test/setup';

describe('test Kyc3 Description', () => {
  test('test Kyc3  Description', () => {
    customRender(<Description onClick={() => {}}>html text</Description>, {});
    customRender(<Description />, {});
  });
});
