// NumberFormat.test.js

import { screen } from '@testing-library/react';
import NumberFormat from 'src/components/common/NumberFormat';
import { customRender } from 'test/setup';

describe('NumberFormat', () => {
  it('renders correctly with children', () => {
    // Mocking currentLang from useLocale
    jest.mock('@kucoin-base/i18n', () => ({
      useLocale: () => ({ currentLang: 'en-US' }),
    }));

    customRender(<NumberFormat>12345.67</NumberFormat>);

    // Expect the component to render with the provided children
    const numberFormatElement = screen.getByText('12,345.67');
    expect(numberFormatElement).toBeInTheDocument();
  });

  it('does not render when children are nil or undefined', () => {
    // Mocking currentLang from useLocale
    jest.mock('@kucoin-base/i18n', () => ({
      useLocale: () => ({ currentLang: 'en-US' }),
    }));

    customRender(<NumberFormat>{null}</NumberFormat>);

    // Expect the component not to render when children are nil
    const numberFormatElement = screen.queryByText('12,345.67');
    expect(numberFormatElement).not.toBeInTheDocument();
  });
});
