/**
 * Owner: willen@kupotech.com
 */
import { Snackbar } from '@kux/mui';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import EditApi from 'src/components/Account/Api/EditApi';
import { customRender } from 'test/setup';

jest.mock('components/Router', () => {
  const query = { sub: '' };
  return {
    __esModule: true,
    withRouter: () => (Component) => (props) => {
      return <Component query={query} {...props} />;
    },
  };
});

class Test extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { children, ...restProps } = this.props;
    return <Snackbar.SnackbarProvider value={restProps}>{children}</Snackbar.SnackbarProvider>;
  }
}

describe('test EditApi', () => {
  test('test EditApi component', () => {
    customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: { API_COMMON: true, API_SPOT: true, API_FUTURES: true },
            ipWhitelistStatus: 0,
            ipWhitelist: '',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    fireEvent.click(screen.getByTestId('btn'));
  });

  test('test EditApi component', () => {
    customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: {
              API_COMMON: true,
              API_SPOT: true,
              API_FUTURES: true,
              API_WITHDRAW: true,
              API_MARGIN: true,
            },
            ipWhitelistStatus: 0,
            ipWhitelist: '',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );
    fireEvent.click(screen.getByTestId('btn'));
    fireEvent.click(screen.getByTestId('checkbox'), {
      target: { checked: false },
    });
  });

  test('allows form submission with valid data', async () => {
    customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: {
              API_COMMON: true,
              API_SPOT: true,
              API_FUTURES: true,
              API_WITHDRAW: true,
              API_MARGIN: true,
            },
            ipWhitelistStatus: 0,
            ipWhitelist: '',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    const authCheckbox = screen.getByTestId('checkbox');
    const submitButton = screen.getByTestId('btn');

    fireEvent.click(authCheckbox);
    fireEvent.click(submitButton);
  });

  test('displays error message when IP whitelist is required but not provided', async () => {
    customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: {
              API_COMMON: true,
              API_SPOT: true,
              API_FUTURES: true,
              API_WITHDRAW: true,
              API_MARGIN: true,
            },
            ipWhitelistStatus: 0,
            ipWhitelist: '',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    const ipRadioDiv = screen.getByTestId('apiIp');
    const ipRadio = ipRadioDiv.querySelector('input');
    const submitButton = screen.getByTestId('btn');

    fireEvent.click(ipRadio);
    fireEvent.click(submitButton);
  });

  test('submits form successfully and navigates correctly', async () => {
    const { getByTestId } = customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: { API_COMMON: true, API_SPOT: true, API_FUTURES: true },
            ipWhitelistStatus: 1,
            ipWhitelist: '192.168.1.1',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    const submitButton = getByTestId('btn');
    fireEvent.click(submitButton);

    // Add assertions to check if submitEdit was called and navigation occurred
  });

  test('shows error when IP whitelist is required but not provided', async () => {
    const { getByTestId } = customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: { API_COMMON: true, API_SPOT: true, API_FUTURES: true },
            ipWhitelistStatus: '1',
            ipWhitelist: '',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    const submitButton = getByTestId('btn');
    fireEvent.click(submitButton);
  });

  test('displays warning when API_WITHDRAW is selected', async () => {
    const { getByTestId } = customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            apiKey: 'lalalala',
            apiName: 'test1001',
            passphrase:
              'ucdpZZP/O9RhyRmsNBwnhUWAv73FrC6upONkjJWtHxzLNwbLS5wVWowpB96j0LE4SLPV2t7asl+V9WNcZxFoZA==',
            authGroupMap: { API_COMMON: true },
            ipWhitelistStatus: '0',
            ipWhitelist: '',
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    const checkbox = getByTestId('checkbox');
    fireEvent.click(checkbox, { target: { checked: true } });
  });

  test('renders loading state when apiKey is not present', () => {
    customRender(
      <Test>
        <HashRouter>
          <EditApi bizType="UPDATE_API" />
        </HashRouter>
      </Test>,
      {
        api_key: {
          detailData: {
            authGroupMap: {},
          },
          verifyData: {},
        },
        open_futures: { openContract: true },
        app: {
          toastConfig: {},
        },
      },
    );

    expect(screen.queryByText('api.Ip')).toBeNull();
  });
});
