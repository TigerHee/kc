import MuiCoinIcon from 'src/components/common/MuiCoinIcon/index';
import { customRender } from 'test/setup';

describe('test MuiCoinIcon', () => {
  test('test MuiCoinIcon', () => {
    customRender(<MuiCoinIcon currency="BTC" />, {});

    customRender(<MuiCoinIcon currency="BTC" />, {
      categories: {
        BTC: { precision: 2, currencyName: 'BTC' },
      },
    });

    customRender(<MuiCoinIcon currency="BTC" showName={false} />, {
      categories: {
        BTC: { precision: 2, currencyName: 'BTC' },
      },
    });
    customRender(<MuiCoinIcon currency="BTC" />, {
      categories: {
        BTC: { precision: 2, currencyName: 'BTC', iconUrl: 'iconUrl' },
      },
    });
  });
});
