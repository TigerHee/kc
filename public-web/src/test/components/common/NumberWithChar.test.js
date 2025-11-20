/*
 * @Date: 2024-06-24 18:05:07
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 15:25:44
 */
/*
 * Owner: harry.lai@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { useSelector } from 'src/hooks/useSelector';
import NumberWithChar from 'src/routes/SlothubPage/DetailPage/components/ProjectInfo/components/NumberWithChar';
import { customRender as render } from 'src/test/setup';

jest.mock('src/hooks/useSelector', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@kucoin-base/i18n', () => ({
  useLocale: jest.fn(),
}));

describe('NumberFormatWithChar', () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'currencySelector') {
        return 'USD';
      }

      if (selector.name === 'currencyRateSelector') {
        return 1.2;
      }

      if (selector.name === 'pricesSelector') {
        return { BTC: 50000 };
      }

      if (selector.name === 'symbolsInfoMapSelector') {
        return { 'BTC-USD': { precision: 2 } };
      }

      return {};
    });

    useLocale.mockReturnValue({ currentLang: 'en' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('hides currency symbol when hideChar is true', () => {
    render(
      <NumberWithChar
        price={100}
        symbol="BTC-USD"
        hideChar={true}
        needHandlePrice={false}
        needTransfer={true}
        isUnsaleATemporary={false}
      />,
    );

    expect(screen.queryByText('$')).not.toBeInTheDocument();
  });

  test('handles null price correctly', () => {
    render(
      <NumberWithChar
        price={null}
        symbol="BTC-USD"
        hideChar={false}
        needHandlePrice={false}
        needTransfer={true}
        isUnsaleATemporary={false}
      />,
    );

    expect(screen.queryByText('$')).not.toBeInTheDocument();

    expect(screen.queryByText('60000.00')).not.toBeInTheDocument();
  });
});
