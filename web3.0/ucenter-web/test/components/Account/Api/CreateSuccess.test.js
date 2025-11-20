/**
 * Owner: willen@kupotech.com
 */
import { fireEvent, screen } from '@testing-library/react';
import CreateSuccess from 'src/components/Account/Api/CreateSuccess';
import { customRender } from 'test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          error: () => {},
        },
      };
    },
  };
});

jest.mock('components/Router', () => {
  return {
    __esModule: true,
    withRouter: () => (Component) => (props) => {
      return <Component {...props} />;
    },
  };
});

const state = {
  api_key: {
    createSuccessData: {
      apiKey: '64b4db4174d5d100015b3e6d',
      apiName: 'tiger+2@corp.kucoin.com',
      brokerId: null,
      authGroupMap: {
        API_COMMON: true,
        API_FUTURES: false,
        API_SPOT: false,
        API_TRANSFER: false,
        API_WITHDRAW: false,
        API_MARGIN: false,
        API_EARN: false,
      },
      permissionMap: {
        API_COMMON: false,
        API_FUTURES: true,
        API_SPOT: true,
        API_TRANSFER: true,
        API_WITHDRAW: true,
        API_MARGIN: true,
        API_EARN: true,
      },
      ipWhitelistStatus: 0,
      ipWhitelist: '',
      ipWhitelistScope: null,
      currentIp: '10.133.160.83',
      apiVersion: 2,
      isActivated: true,
      createdAt: 1689574209000,
    },
    createSuccessVisible: true,
  },
};

describe('test CreateSuccess', () => {
  test('test CreateSuccess render', () => {
    customRender(<CreateSuccess />, state);

    fireEvent.click(screen.getByTestId('btn'));
  });
});
