import { act, fireEvent, screen } from '@testing-library/react';
import PasskeyPage from 'src/routes/AccountPage/Security/PasskeyPage/index';
import { passkeysSupported } from 'src/utils/webauthn-json';
import { customRender } from 'test/setup';
import { trackClick } from 'utils/ga';

jest.mock('services/ucenter/passkey');
jest.mock('utils/webauthn-json');
jest.mock('utils/ga');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      callPasskeyRegister: false
    }
  })
}));

describe('test PasskeyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    passkeysSupported.mockReturnValue(true);
  });

  test('renders empty state correctly when no passkeys', () => {
    const { container } = customRender(<PasskeyPage />, {
      initialState: {
        user: {
          user: {
            isSub: false
          }
        }
      }
    });
    
    expect(screen.getByText('92b3f6d83af34000a505')).toBeInTheDocument(); // 添加 Passkey 按钮
    expect(container.querySelector('[data-inspector="account_security_passkey"]')).toBeInTheDocument();
  });

  test('handles add passkey button click', async () => {
    const { container } = customRender(<PasskeyPage />, {
      initialState: {
        user: {
          user: {
            isSub: false
          }
        }
      }
    });

    const addButton = screen.getByText('92b3f6d83af34000a505');
    await act(async () => {
      fireEvent.click(addButton);
    });

    expect(trackClick).toHaveBeenCalledWith(['createPasskey', '1']);
  });
});
