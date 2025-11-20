/**
 * Owner: willen@kupotech.com
 */
import SecurityForm from 'src/components/Account/Api/SecurityForm';
import { customRender } from 'test/setup';

describe('test SecurityForm', () => {
  test('test SecurityForm component', () => {
    const { asFragment, container } = customRender(
      <>
        <SecurityForm onOk={() => 'test'} bizType={'bizType'} okText={'okText'} />,
        <SecurityForm
          onOk={() => 'test'}
          bizType={'bizType'}
          okText={'okText'}
          verifyType={['my_email', 'google_2fa', 'withdraw_password', 'my_sms']}
        />
        ,
      </>,
    );
    expect(container.innerHTML).toContain('security.g2faAndEmail');
  });
});
