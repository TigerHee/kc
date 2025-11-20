import Button from 'src/components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { customRender } from 'test/setup';

describe('test Kyc3 Button', () => {
  test('test Kyc3  Button', () => {
    customRender(<Button>Button</Button>, {});
    customRender(<Button size="basic">Button</Button>, {});
    customRender(
      <Button showIcon={false} size="">
        Button
      </Button>,
      {},
    );
  });
});
