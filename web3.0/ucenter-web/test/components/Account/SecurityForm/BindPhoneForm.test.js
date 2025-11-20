/**
 * Owner: willen@kupotech.com
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BindPhoneForm from 'src/components/Account/SecurityForm/BindPhoneForm';
import { customRender } from 'test/setup';

describe('test BindPhoneForm', () => {
  test('test BindPhoneForm', () => {
    const onSuccess = jest.fn(),
      onError = jest.fn();
    const dispatch = (e) => {
      return new Promise((res) => {
        res({
          data: {},
        });
      });
    };

    const { rerender, container } = customRender(<BindPhoneForm dropForbidden={false} />, {
      homepage: {},
    });

    fireEvent.submit(screen.getByTestId('form'));

    const phone = container.querySelector('#phone'),
      code = container.querySelector('#code');

    userEvent.click(screen.getByText('26f293c147e54000a9ee'));
    userEvent.type(phone, 'zdasd');
    fireEvent.submit(screen.getByTestId('form'));
    userEvent.type(phone, 0);
    fireEvent.submit(screen.getByTestId('form'));

    rerender(
      <BindPhoneForm
        isUpdate
        bizType="UPDATE_PHONE"
        dispatch={dispatch}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    userEvent.type(phone, '123321');
    userEvent.type(code, '123321');
    fireEvent.submit(screen.getByTestId('form'));

    rerender(
      <BindPhoneForm
        isUpdate
        bizType="UPDATE_PHONE"
        dispatch={(e) => {
          return new Promise((res, rej) => {
            const { type } = e;
            if (type === 'account_security/updatePhone') rej();
            if (type === 'account_security/sendBindCode')
              res({
                retryAfterSeconds: 1,
              });
            res({
              data: {},
            });
          });
        }}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );

    userEvent.click(screen.getByText('26f293c147e54000a9ee'));
    userEvent.type(phone, '123321');
    userEvent.type(code, '123321');
    fireEvent.submit(screen.getByTestId('form'));
  });
});
