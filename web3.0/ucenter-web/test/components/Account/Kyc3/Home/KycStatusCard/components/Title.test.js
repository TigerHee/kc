import Title from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { customRender } from 'test/setup';

describe('test Kyc3 Title', () => {
  test('test Kyc3  Title', () => {
    customRender(<Title>text</Title>, {});
    customRender(<Title />, {});
  });
});
