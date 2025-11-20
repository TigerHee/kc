import { ICAuthenticationOutlined } from '@kux/icons';
import Method from 'src/components/Account/Kyc/KycKybHome/components/Method';

import { customRender } from 'test/setup';

describe('test KYC/KYB Method', () => {
  test('test KYC/KYB Method', () => {
    customRender(
      <Method
        icon={<ICAuthenticationOutlined />}
        title="Hello1"
        description="World2"
        content="Hello World"
        active={false}
        onActive={() => {}}
        noPrefix={true}
        {...{}}
      />,
      {},
    );
  });
});
