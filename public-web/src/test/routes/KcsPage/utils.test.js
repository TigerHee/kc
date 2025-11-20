/**
 * Owner: chris@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import numberFormatKux from '@kux/mui/utils/numberFormat';
import '@testing-library/jest-dom';
import { callJump, goLock, goLogin, numberFormat, percentFormat } from 'src/routes/KcsPage/utils';
import { push } from 'src/utils/router';
jest.mock('src/utils/router', () => ({
  push: jest.fn(),
}));

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

jest.mock('@kux/mui/utils/numberFormat', () => jest.fn());

describe('callJump', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call JsBridge.open() when in app', () => {
    JsBridge.isApp.mockReturnValue(true);
    const params = { foo: 'bar' };
    const url = 'https://example.com';

    callJump(params, url);

    expect(JsBridge.open).toHaveBeenCalledWith({
      type: 'jump',
      params,
    });
  });

  it('should call window.open() when not in app', () => {
    JsBridge.isApp.mockReturnValue(false);
    const url = 'https://example.com';
    const openMock = jest.fn();
    Object.defineProperty(window, 'open', { value: openMock });

    callJump({}, url);

    expect(openMock).toHaveBeenCalledWith(url, '_blank');
  });
});

describe('percentFormat', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "< 0.01%" when value is less than 0.0001 but not 0', () => {
    numberFormatKux.mockReturnValue('0.01%');
    const result = percentFormat(0.00001);
    expect(result).toBe('< 0.01%');
  });

  it('should return the correctly formatted percentage string when value is greater than or equal to 0.0001', () => {
    numberFormatKux.mockReturnValue('10.20%');
    const result = percentFormat(0.102);
    expect(result).toBe('10.20%');
  });

  it('should return "--" when an error occurs', () => {
    const result = percentFormat('invalid');
    expect(result).toBe('--');
  });
});

describe('numberFormat', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correctly formatted number string', () => {
    numberFormatKux.mockReturnValue('123.45678');
    const result = numberFormat(123.45678);
    expect(result).toBe('123.45678');
  });

  it('should handle non-numeric inputs gracefully', () => {
    numberFormatKux.mockReturnValue('--');
    const result = numberFormat('invalid');
    expect(result).toBe('--');
  });
});

describe('goLogin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call push with the correct URL when not in app', () => {
    const isInApp = false;
    const mockLocation = 'https://example.com/path';
    Object.defineProperty(window, 'location', {
      value: { href: mockLocation },
    });

    goLogin();

    expect(push).toHaveBeenCalledWith(
      '/ucenter/signin?backUrl=' + encodeURIComponent(mockLocation),
    );
  });
});

describe('goLock', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call callJump with the correct parameters', () => {
    const params = {
      demand_product_id: 1,
      demand_product_type: 'type',
      currency: 'BTC',
      name: 'Product Name',
      product_category: 'category',
    };

    const expectedUrl = `/lock?type=${params.demand_product_type}&product_id=${params.demand_product_id}&currency=${params.currency}&name=${params.name}&category=${params.product_category}&needLogin=true&loading=2&appNeedLang=true&isBanner=1`;
    const expectedRedirectUrl = `/kcs?product_id=${params.demand_product_id}&category=${params.product_category}&type=${params.demand_product_type}&with_category_currency_group=1`;

    goLock(params);
  });
});
