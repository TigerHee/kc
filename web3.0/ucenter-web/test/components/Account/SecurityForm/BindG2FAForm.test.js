/**
 * Owner: willen@kupotech.com
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BindG2FAForm from 'src/components/Account/SecurityForm/BindG2FAForm';
import { customRender } from 'test/setup';

describe('test BindG2FAForm', () => {
  test('test BindG2FAForm', () => {
    const { rerender, container } = customRender(<BindG2FAForm user={{}} bindKey="test" />);
    rerender(<BindG2FAForm isUpdate user={{}} bindKey="test" />);

    fireEvent.submit(screen.getByTestId('form'));

    const code = container.querySelector('#code');

    userEvent.type(code, '123321');
    fireEvent.submit(screen.getByTestId('form'));

    userEvent.click(screen.getByText('g2fa.bind.help'));
  });
});
