/**
 * Owner: jessie@kupotech.com
 */
import TransferScope from 'src/components/Root/GlobalTransferScope';
import { customRender } from '../../setup';

describe('test TransferScope', () => {
  test('test TransferScope', () => {
    customRender(<TransferScope />, {
      user: {
        user: {},
      },
      categories: {},
      transfer: {
        visible: true,
        initCurrency: 'BTC',
      },
      setting: {
        currentTheme: 'dark',
      },
    });
  });

  test('test TransferScope with notlogin', () => {
    customRender(<TransferScope />, {
      user: {
        user: null,
      },
      categories: {},
      transfer: {
        visible: true,
        initCurrency: 'BTC',
      },
      setting: {
        currentTheme: 'light',
      },
    });
  });
});
