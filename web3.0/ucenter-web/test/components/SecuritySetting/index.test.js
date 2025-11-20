/**
 * Owner: tiger@kupotech.com
 */
import { useSelector } from 'react-redux';
import SecuritySetting from 'src/components/SecuritySetting';
import { customRender } from 'test/setup';

const state = {
  user: { user: {}, securtyStatus: {} },
};

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

describe('test SecuritySetting', () => {
  test('test SecuritySetting render', () => {
    customRender(<SecuritySetting />);
    customRender(<SecuritySetting needEmail />);
  });

  test('test SecuritySetting render isSub', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: {
            isSub: true,
          },
          securtyStatus: {
            GOOGLE2FA: true,
            SMS: false,
            EMAIL: true,
          },
        },
      }),
    );
    customRender(<SecuritySetting />);
  });

  test('test SecuritySetting render other', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: {
            isSub: false,
          },
          securtyStatus: {
            GOOGLE2FA: true,
            SMS: false,
            EMAIL: true,
            WITHDRAW_PASSWORD: true,
          },
        },
      }),
    );
    customRender(<SecuritySetting needEmail />);
  });
});
