import Alert from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import { customRender } from 'test/setup';

describe('test Kyc3 Alert', () => {
  test('test Kyc3  Alert', () => {
    customRender(<Alert>text</Alert>, {});
    customRender(<Alert type="error">text</Alert>, {});
  });
});
