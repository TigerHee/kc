/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import {
  AlertContainer,
  AlertForTransaction,
  AlertUnreasonableTip,
  TransferButton,
  validInput,
} from 'src/components/Premarket/containers/TradeModal/shared.js';
import { customRender } from 'src/test/setup';

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('test Shared', () => {
  test('test validInput', async () => {
    expect(validInput('buy', '--', 10)).toBe('err-input');
    expect(validInput('sell', '--', 10)).toBe('err-input');
    expect(validInput('buy', 11, 10)).toBe('err-noSufficient');
    expect(validInput('sell', 11, 10)).toBe('err-noSufficient');
    expect(validInput('buy', 9, 10)).toBe('success');
    expect(validInput('sell', 9, 10)).toBe('success');
  });
  test('test TransferButton', async () => {
    isApp.mockReturnValue(true);
    const { container } = customRender(<TransferButton />, {});
    // const checkbox = document.querySelector('.agreement-check');
    expect(container).toBeInTheDocument();
    fireEvent.click(container);
  });
  test('test AlertForTransaction', async () => {
    const { result } = customRender(<AlertForTransaction />, {
      aptp: {
        modalInfo: {
          side: 'buy',
        },
        deliveryCurrency: 'USDT',
        deliveryCurrencyInfo: {
          offerCurrency: 'BTC',
          pledgeCompensateRatio: 1,
        },
        priceInfo: {
          minSellPrice: '0.1',
          maxBuyPrice: '1',
        },
        taxInfo: {},
      },
    });
    expect(result).toBe();

    const { getByText } = customRender(
      <AlertForTransaction
        size={1}
        pledgeTotal={1}
        fee={0.5}
        taxFee={0.1}
        validStatus="err-noSufficient"
      />,
      {
        aptp: {
          modalInfo: {
            side: 'buy',
          },
          deliveryCurrency: 'USDT',
          deliveryCurrencyInfo: {
            offerCurrency: 'BTC',
            pledgeCompensateRatio: 1,
          },
          priceInfo: {
            minSellPrice: '0.1',
            maxBuyPrice: '1',
          },
          taxInfo: {
            taxEnable: true,
            taxRate: 0.01,
          },
        },
      },
    );
    expect(getByText('gEusa44YwmapmfviqD5K4g')).toBeInTheDocument();

    const { result: reslut1 } = customRender(
      <AlertForTransaction size={1} validStatus="err-input" />,
      {
        aptp: {
          modalInfo: {
            side: 'buy',
          },
          deliveryCurrency: 'USDT',
          deliveryCurrencyInfo: {
            offerCurrency: 'BTC',
            pledgeCompensateRatio: 1,
          },
          priceInfo: {
            minSellPrice: '0.1',
            maxBuyPrice: '1',
          },
          taxInfo: {},
        },
      },
    );
    expect(reslut1).toBe();

    const { getByText: getByText1 } = customRender(
      <AlertForTransaction size={1} pledgeTotal={1} validStatus="success" />,
      {
        aptp: {
          modalInfo: {
            side: 'buy',
          },
          deliveryCurrency: 'USDT',
          deliveryCurrencyInfo: {
            offerCurrency: 'BTC',
            pledgeCompensateRatio: 1,
          },
          priceInfo: {
            minSellPrice: '0.1',
            maxBuyPrice: '1',
          },
          taxInfo: {},
        },
      },
    );
    expect(getByText1('arBQPcSvKkfJRNmrRK9ZHF')).toBeInTheDocument();

    const { getByText: getByText2 } = customRender(
      <AlertForTransaction size={1} pledgeTotal={1} validStatus="success" />,
      {
        aptp: {
          modalInfo: {
            side: 'sell',
          },
          deliveryCurrency: 'USDT',
          deliveryCurrencyInfo: {
            offerCurrency: 'BTC',
            pledgeCompensateRatio: 1,
          },
          priceInfo: {
            minSellPrice: '0.1',
            maxBuyPrice: '1',
          },
          taxInfo: {},
        },
      },
    );
    expect(getByText2('qtKzRQA8cVrLe4cyp3sBta')).toBeInTheDocument();
  });

  test('test AlertUnreasonableTip', async () => {
    const { getByText: getByText1 } = customRender(<AlertUnreasonableTip price={0.3} />, {
      aptp: {
        modalInfo: {
          side: 'buy',
        },
        priceInfo: {
          minSellPrice: '0.1',
          maxBuyPrice: '1',
        },
        taxInfo: {},
      },
    });
    expect(getByText1('iq3RLVde3dMsM4VLgx2ZL9')).toBeInTheDocument();

    const { getByText: getByText2 } = customRender(<AlertUnreasonableTip price={0.3} />, {
      aptp: {
        modalInfo: {
          side: 'sell',
        },
        priceInfo: {
          minSellPrice: '0.1',
          maxBuyPrice: '1',
        },
        taxInfo: {},
      },
    });
    expect(getByText2('hkmDnSZZW8eor43GsZXhhj')).toBeInTheDocument();

    const { result } = customRender(<AlertUnreasonableTip price={0.6} />, {
      aptp: {
        modalInfo: {
          side: 'sell',
        },
        priceInfo: {
          minSellPrice: '0.1',
          maxBuyPrice: '1',
        },
        taxInfo: {},
      },
    });
    expect(result).toBe();
  });

  test('test AlertContainer', async () => {
    customRender(<AlertContainer>children</AlertContainer>, {});
  });
});
