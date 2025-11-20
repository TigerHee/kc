/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import CoinTransfer from 'src/components/RocketZone/containers/NewCurrencyList/CoinTransfer.js';
import { customRender } from 'src/test/setup';

describe('test CoinTransfer', () => {
  test('test CoinTransfer return --', async () => {
    const { container } = customRender(<CoinTransfer />, {
      currency: {
        currency: 'USD',
        prices: { USDT: 1 },
      },
      categories: {
        USDT: {
          precision: 8,
        },
        BTC: {
          precision: 8,
        },
      },
    });
    expect(container.innerHTML).toContain('--');

    const { container: container1 } = customRender(<CoinTransfer value="1" />, {
      currency: {
        currency: 'USD',
        prices: {},
      },
      categories: {
        USDT: {
          precision: 8,
        },
        BTC: {
          precision: 8,
        },
      },
    });
    expect(container1.innerHTML).toContain('--');
  });

  test('test CoinTransfer', async () => {
    const { container } = customRender(
      <CoinTransfer value="1" quoteCurrency="USDT" baseCurrency="BTC" showPrefixUnit={true} />,
      {
        currency: {
          currency: 'USD',
          prices: { USDT: 1, BTC: 1 },
        },
        categories: {
          BTC: {
            precision: 8,
          },
        },
      },
    );
    expect(container.innerHTML).toContain('$');

    const { container: container1 } = customRender(
      <CoinTransfer value="0.01" quoteCurrency="USDT" baseCurrency="BTC" showPrefixUnit={false} />,
      {
        currency: {
          currency: 'USD',
          prices: { USDT: 1, BTC: 0.01 },
        },
        categories: {
          USDT: {
            precision: 1,
          },
          BTC: {
            precision: 1,
          },
        },
      },
    );
    expect(container1.innerHTML).toContain('<');
  });
});
