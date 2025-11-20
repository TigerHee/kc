import Toast from 'src/components/Toast';
import { customRender } from 'test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          error: () => {},
          success: () => {},
          warning: () => {},
          loading: () => {},
          info: () => {},
        },
      };
    },
  };
});

describe('test Toast', () => {
  ['success', 'info', 'error', 'warning', 'loading', 'other'].forEach((type) => {
    test(`test Toast ${type}`, () => {
      customRender(<Toast />, {
        app: {
          toastConfig: { type, message: type },
        },
      });
    });
  });
});
