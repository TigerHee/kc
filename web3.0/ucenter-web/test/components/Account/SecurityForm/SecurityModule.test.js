import { useDispatch } from 'react-redux';
import configureStore from 'redux-mock-store';
import SecurityModule from 'src/components/Account/SecurityForm/SecurityModule';
import { customRender } from 'test/setup';

const mockStore = configureStore([]);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('helper', () => {
  const evtEmitter = {
    getEvt: () => ({
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    }),
  };
  return { evtEmitter };
});

describe('ModalSecurity component', () => {
  let store;
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn(() => Promise.resolve()));

    store = mockStore({
      user: {
        user: {},
      },
      security_new: {
        retryAfterSeconds: 0,
      },
      loading: {
        effects: {
          'security_new/get_verify_type': false,
          'ecurity_new/sec_verify': false,
        },
      },
    });
  });

  it('renders ModalSecurity correctly', async () => {
    const onSuccess = jest.fn();
    customRender(
      <SecurityModule visible={true} bizType="UPDATE_API" onSuccess={onSuccess} />,
      store,
    );
  });
});
