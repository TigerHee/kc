/**
 * Owner: tiger@kupotech.com
 */
import CoinCurrency from 'src/components/common/CoinCurrency';
import { customRender } from 'test/setup';

describe('test CoinCurrency', () => {
  test('test CoinCurrency normal', async () => {
    customRender(<CoinCurrency coin="BTC" value="123" />, {
      currency: {
        currency: 'BTC',
        prices: {
          BTC: 2,
        },
      },
    });
  });

  test('test CoinCurrency useLegalChars', async () => {
    customRender(<CoinCurrency coin="BTC" value="123" useLegalChars />, {
      currency: {
        currency: 'BTC',
        prices: {
          BTC: 2,
        },
      },
    });
  });

  test('test CoinCurrency no rate', async () => {
    customRender(<CoinCurrency coin="BTC" value="123" />, {
      currency: {
        currency: 'BTC',
        prices: {},
      },
    });
  });
});
