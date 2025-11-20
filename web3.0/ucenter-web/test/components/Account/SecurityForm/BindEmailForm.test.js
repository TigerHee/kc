/**
 * Owner: willen@kupotech.com
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BindEmailForm from 'src/components/Account/SecurityForm/BindEmailForm';
import { customRender } from 'test/setup';

describe('test BindEmailForm', () => {
  test('test BindEmailForm', () => {
    const onSuccess = jest.fn(),
      onError = jest.fn();
    const dispatch = (e) => {
      return new Promise((res) => {
        res({
          data: {},
        });
      });
    };

    const { rerender, container } = customRender(<BindEmailForm />);
    rerender(
      <BindEmailForm
        isUpdate
        bizType="UPDATE_EMAIL"
        dispatch={dispatch}
        onSuccess={onSuccess}
        onError={onError}
      />,
    );
    userEvent.click(screen.getByText('26f293c147e54000a9ee'));

    const email = container.querySelector('#email'),
      code = container.querySelector('#code');
    userEvent.type(email, '1231@qq.com');
    userEvent.click(screen.getByText('26f293c147e54000a9ee'));
    userEvent.type(code, '123321');
    fireEvent.submit(screen.getByTestId('form'));

    rerender(
      <BindEmailForm
        isUpdate
        bizType="UPDATE_EMAIL"
        dispatch={(e) => {
          return new Promise((res, rej) => {
            const { type } = e;
            if (type === 'account_security/updateEmail') rej();
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

    userEvent.type(email, '1231@qq.com');
    userEvent.click(screen.getByText('26f293c147e54000a9ee'));
    userEvent.click(screen.getByText('26f293c147e54000a9ee'));
    userEvent.type(code, '123321');
    fireEvent.submit(screen.getByTestId('form'));
  });
});
