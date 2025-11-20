import Card from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Card';
import { customRender } from 'test/setup';

describe('test Kyc3 Card', () => {
  test('test Kyc3  Card', () => {
    customRender(
      <Card leftSlot="leftSlot" rightSlot="rightSlot">
        text
      </Card>,
      {},
    );
    customRender(<Card />, {});
  });
});
