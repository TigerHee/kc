import CoinCodeToName from 'src/components/common/CoinCodeToName/index';
import { customRender } from 'test/setup';

describe('test CoinCodeToName', () => {
  test('test CoinCodeToName', () => {
    customRender(<CoinCodeToName coin="BTC" />, {
      categories: {
        BTC: {
          currencyName: 'BTC',
        },
      },
    });
  });
});
