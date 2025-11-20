/**
 * Owner: tiger@kupotech.com
 */
import { Form } from '@kux/mui';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewCommonSecurity from 'src/components/NewCommonSecurity';
import { customRender } from 'test/setup';

// 模拟 sentry 模块，并覆盖特定方法
jest.mock('@kc/sentry', () => {
  return {
    ...jest.requireActual('@kc/sentry'),
    init: jest.fn(),
    captureException: jest.fn(),
  };
});

const sentry = require('@kc/sentry');

const { useForm } = Form;

const RenderForm = (props) => {
  const [form] = useForm();
  return (
    <Form form={form}>
      <NewCommonSecurity form={form} {...props} />
    </Form>
  );
};

const baseState = {
  user: { user: {} },
  security_new: {},
};

describe('test NewCommonSecurity', () => {
  test('test NewCommonSecurity render', () => {
    const propsObj = {
      bizType: 'CREATE_SUB_ACCOUNT',
      allowTypes: [
        ['withdraw_password', 'my_email', 'google_2fa'],
        ['my_email', 'google_2fa'],
        ['withdraw_password', 'my_email'],
      ],
      showAbnormalInfo: true,
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

    fireEvent.click(getByText('swicth.g2fa.and.email'));
    // Assert the state has switched
    waitFor(() => {
      expect(getByText('switch.sms')).toBeInTheDocument();
    });
  });

  test('test NewCommonSecurity change withdraw password', () => {
    const propsObj1 = {
      bizType: 'UPDATE_ACCOUNT',
      allowTypes: [['withdraw_password']],
      callback: jest.fn(),
    };
    const { getByTestId } = customRender(<RenderForm {...propsObj1} />, baseState);
    const withdrawPasswordInput = getByTestId('withdraw-password-input');
    userEvent.type(withdrawPasswordInput, '123456');
    userEvent.click(getByTestId('new-security-submit'));
  });
});
