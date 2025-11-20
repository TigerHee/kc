/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import { customRender } from 'src/test/setup';
import AssetsComp from 'TradeActivityCommon/AssetsComp';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(() => jest.fn()),
}));

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('AssetsComp', () => {
  it('renders AssetsComp with no user', () => {
    customRender(<AssetsComp stakingToken="BTC" tokenScale={6} />, {
      user: {
        user: null,
      },
      user_assets: {
        tradeMap: {
          BTC: {
            availableBalance: 0,
          },
        },
      },
      currency: {},
      market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] },
    });
  });

  it('renders AssetsComp', () => {
    useResponsive.mockReturnValue({ sm: true, lg: true });
    customRender(<AssetsComp stakingToken="BTC" tokenScale={6} isTotal={true} />, {
      user: {
        user: {},
      },
      user_assets: {
        tradeMap: {
          BTC: {
            availableBalance: '100',
          },
        },
      },
      currency: {
        currency: 'USD',
      },
      market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] },
    });
    const svg = document.getElementsByTagName('svg');
    expect(svg[0]).toBeInTheDocument();
    fireEvent.click(svg[0]);
    const buttons = document.getElementsByClassName('assetsBtn');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
  });

  it('renders AssetsComp 2', () => {
    customRender(<AssetsComp stakingToken="BTC" tokenScale={6} isTotal={true} />, {
      user: {
        user: {},
      },
      user_assets: {
        tradeMap: {
          BTC: {
            availableBalance: '100',
          },
        },
      },
      currency: {
        currency: 'USD',
      },
      market: { records: [{ code: 'BTC-USDT' }, { code: 'KCS-USDT' }] },
    });
  });

  it('renders AssetsComp with mini', () => {
    useResponsive.mockReturnValue({ sm: false, lg: true });
    customRender(<AssetsComp stakingToken="BTC" isMini={true} tokenScale={6} />, {
      user: {
        user: {},
      },
      user_assets: {
        tradeMap: {},
      },
      currency: {
        currency: 'USD',
      },
      market: {},
    });

    const svg = document.getElementsByClassName('icon');
    expect(svg[0]).toBeInTheDocument();
    fireEvent.click(svg[0]);

    const buttons1 = document.getElementsByTagName('button');
    expect(buttons1[0]).toBeInTheDocument();
    expect(buttons1[1]).toBeInTheDocument();
    expect(buttons1[2]).toBeInTheDocument();
    fireEvent.click(buttons1[0]);
    fireEvent.click(buttons1[1]);
    fireEvent.click(buttons1[2]);
  });

  it('renders AssetsComp with app', () => {
    useResponsive.mockReturnValue({ sm: false, lg: true });
    JsBridge.isApp.mockReturnValue(true);
    customRender(<AssetsComp stakingToken="BTC" isMini={true} tokenScale={6} />, {
      user: {
        user: {},
      },
      user_assets: {
        tradeMap: {},
      },
      currency: {
        currency: 'USD',
      },
      market: {},
    });

    const svg = document.getElementsByClassName('icon');
    expect(svg[0]).toBeInTheDocument();
    fireEvent.click(svg[0]);

    // const buttons1 = document.getElementsByClassName('create-option');
    const buttons1 = document.getElementsByTagName('button');
    expect(buttons1[0]).toBeInTheDocument();
    expect(buttons1[1]).toBeInTheDocument();
    expect(buttons1[2]).toBeInTheDocument();
    fireEvent.click(buttons1[0]);
    fireEvent.click(buttons1[1]);
    fireEvent.click(buttons1[2]);
  });
});
