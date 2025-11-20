import CoinPrecision from 'src/components/common/CoinPrecision/index';
import { customRender } from 'test/setup';

describe('test CoinPrecision', () => {
  test('test CoinPrecision', () => {
    customRender(<CoinPrecision />, { categories: {} });
    customRender(<CoinPrecision coin="BTC" value={1234.5678} fillZero={false} fixZero={false} />, {
      categories: {
        BTC: { precision: 2 },
      },
    });
    customRender(<CoinPrecision coin="BTC" value={1234.5678} fillZero={true} fixZero={true} />, {
      categories: {
        BTC: { precision: 2 },
      },
    });
  });
});
