/*
 * Owner: melon@kupotech.com
 */

/**
 * 单测文件
 */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SetPassword, { pwdValidator } from 'src/components/UserTransfer/SetPassword';
import { customRender } from 'test/setup';
import { _t } from 'tools/i18n';

describe('pwdValidator', () => {
  const mockCallback = jest.fn(); // 创建一个 Jest 函数作为回调
  beforeEach(() => {
    mockCallback.mockClear(); // 在每个测试之前清除回调函数的调用记录
  });

  it('should call callback with no error for a valid password', () => {
    const value = '123456'; // 有效密码
    pwdValidator({}, value, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(); // 应该没有错误
  });

  it('should call callback with required error for empty value', () => {
    const value = ''; // 空密码
    pwdValidator({}, value, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(new Error(_t('form.tradeCode.required')));
  });

  it('should call callback with required error for invalid format', () => {
    const value = '12345a'; // 无效密码格式
    pwdValidator({}, value, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(new Error(_t('form.tradeCode.required')));
  });

  it('should call callback with security level error for existing password', () => {
    const value = '123456'; // 已存在的密码
    pwdValidator({}, value, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(new Error(_t('form.secLevel.error')));
  });

  it('should call callback with no error for a different valid password', () => {
    const value = '654322'; // 另一个有效密码
    pwdValidator({}, value, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(); // 应该没有错误
  });
});

describe('test SetPassword', () => {
  let props;

  beforeEach(() => {
    props = {
      dispatch: jest.fn(),
      step: 0,
      onSuccess: jest.fn(),
      onChange: jest.fn(),
      form: {
        validateFields: jest.fn(),
        getFieldValue: jest.fn(),
        resetFields: jest.fn(),
      },
    };
  });

  test('test SetPassword', () => {
    customRender(<SetPassword {...props} />, {});
  });

  test('renders SetPassword with step 0', () => {
    customRender(<SetPassword {...props} />, {});
    expect(screen.getByText('set.trade.code')).toBeInTheDocument();
  });

  test('renders SetPassword with step 1', () => {
    props.step = 1;
    customRender(<SetPassword {...props} />, {});
    expect(screen.getAllByText('trade.code.warning')[0]).toBeInTheDocument();
  });

  test('submit form with valid password', async () => {
    props.step = 1;
    props.form.validateFields.mockResolvedValue({ password: '123456', passwordr: '123456' });

    const { getByTestId, getByText } = customRender(<SetPassword {...props} />);

    const codeInput = getByTestId('trade.code').querySelector('input');
    userEvent.type(codeInput, '123456');
    const confirmInput = getByTestId('trade.code.confirm').querySelector('input');
    userEvent.type(confirmInput, '123456');
    userEvent.click(getByText('submit'));
  });

  test('displays error for invalid password', async () => {
    props.step = 1;
    props.form.validateFields.mockRejectedValue({
      errorFields: [
        {
          name: ['password'],
          errors: ['form.tradeCode.required'],
        },
      ],
    });
    const { getByTestId } = customRender(<SetPassword {...props} />);
    const codeInput = getByTestId('trade.code').querySelector('input');
    userEvent.type(codeInput, '123456');
  });

  test('handles modal visibility', async () => {
    props.step = 1;
    const { getByAltText, getByTestId } = customRender(<SetPassword {...props} />);

    expect(getByAltText('light-warning-icon')).toBeInTheDocument();
    const closeButton = getByTestId('close-button');
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(getByAltText('light-warning-icon')).not.toBeVisible();
    });
  });

  // test('validatePassword should display inconsistency error', async () => {
  //   props.step = 1;
  //   props.form.getFieldValue.mockReturnValue('123456');
  //   props.form.validateFields.mockResolvedValue({
  //     errorFields: [
  //       {
  //         name: ['passwordr'],
  //         errors: ['form.inconsistent'],
  //       },
  //     ],
  //   });
  //   const { getByTestId } = customRender(<SetPassword {...props} />);

  //   const codeInput = getByTestId('trade.code').querySelector('input');
  //   userEvent.type(codeInput, '123456');
  //   const confirmInput = getByTestId('trade.code.confirm').querySelector('input');
  //   userEvent.type(confirmInput, '654321');
  // });
});
