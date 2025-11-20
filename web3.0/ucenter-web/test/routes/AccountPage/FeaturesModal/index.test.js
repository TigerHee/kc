/**
 * Owner: sean.shi@kupotech.com
 */
import FuturesModal from 'src/routes/AccountPage/FuturesModal';
import { customRender } from 'test/setup';

const state = {
  user: {
    user: {},
  },
  open_futures: { openFuturesVisible: true, openContract: false },
  loading: {
    effects: {
      'open_futures/openContract': false,
    },
  },
};

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          success: () => {},
          error: () => {},
        },
      };
    },
  };
});

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

describe('test FuturesModal', () => {
  test('test FuturesModal', () => {
    customRender(<FuturesModal />);
  });
});
