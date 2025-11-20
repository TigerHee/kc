/**
 * Owner: tiger@kupotech.com
 */
import { Form } from '@kux/mui';
import CommonSecurity from 'src/components/NewCommonSecurity';
import { customRender } from 'test/setup';

const { useForm } = Form;

const RenderForm = (props) => {
  const [form] = useForm();
  return (
    <Form form={form}>
      <CommonSecurity form={form} {...props} />
    </Form>
  );
};

const baseState = {
  user: { user: {} },
  security_new: {},
};

describe('test CommonSecurity', () => {
  test('test CommonSecurity render', () => {
    const propsObj = {
      bizType: 'CREATE_SUB_ACCOUNT',
      allowTypes: [['withdraw_password', 'my_email', 'google_2fa']],
      callback: () => {},
    };

    customRender(<RenderForm {...propsObj} />, baseState);

    const propsObj1 = {
      bizType: 'UPDATE_ACCOUNT',
      allowTypes: [['withdraw_password']],
      callback: jest.fn(),
    };
    customRender(<RenderForm {...propsObj1} />, baseState);

    const propsObj2 = {
      bizType: 'CREATE_SUB_ACCOUNT',
      allowTypes: [['my_email', 'google_2fa'], ['my_sms']],
      callback: () => {},
      onInit: () => {},
      autoSubmit: false,
      showAbnormalInfo: true,
      callback: jest.fn(),
    };
    const { getByText } = customRender(<RenderForm {...propsObj2} />, baseState);
  });
});
