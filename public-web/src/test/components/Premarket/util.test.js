/**
 * Owner: solar@kupotech.com
 */
import * as tma from '@kc/telegram-biz-sdk';
import JsBridge from '@knb/native-bridge';
import history from '@kucoin-base/history';

const { isApp, open } = JsBridge;

const {
  truncateDecimals,
  multiply,
  getMin,
  add,
  minus,
  getDecimalPlace,
  deleteCoinQuery,
  skip2Login,
  skip2Rules,
  skip2Faq,
  lessThan,
  greeterThan,
} = require('src/components/Premarket/util');

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

// mock history
jest.mock('@kucoin-base/history', () => ({
  push: jest.fn(),
}));

describe('skip2Login', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should skip2Login in app', () => {
    isApp.mockReturnValue(true);
    const result = skip2Login();
    expect(result).toBe();
  });

  it('should skip2Login not in app', () => {
    isApp.mockReturnValue(false);
    const result = skip2Login();
    expect(result).toBe();
  });

  it('should skip2Login default', () => {
    const isAppMock = jest.fn(() => false);
    isApp.mockImplementation(isAppMock);

    const isTMAMock = jest.fn(() => false);
    jest.spyOn(tma.bridge, 'isTMA').mockImplementation(isTMAMock);

    const historyPushMock = jest.fn(() => true);
    jest.spyOn(history, 'push').mockImplementation(historyPushMock);

    skip2Login();
    expect(isApp).toHaveBeenCalled();
    expect(historyPushMock).toHaveBeenCalled();
  });

  it('should skip2Login in tma', () => {
    const mockIsApp = jest.fn(() => false);
    isApp.mockReturnValue(mockIsApp);

    const isTMAMock = jest.fn(() => true);
    jest.spyOn(tma.bridge, 'isTMA').mockImplementation(isTMAMock);

    const accountLandingMock = jest.fn(() => true);
    jest.spyOn(tma.actions, 'accountLanding').mockImplementation(accountLandingMock);

    console.log('isTMAMock', tma.bridge.isTMA());
    console.log('accountLandingMock', tma.actions.accountLanding());

    skip2Login();
    expect(isTMAMock).toHaveBeenCalled();
    expect(accountLandingMock).toHaveBeenCalled();
  });
});

describe('skip2Rules', () => {
  let windowOpenSpy;
  beforeEach(() => {
    jest.resetAllMocks();
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('should skip2Rules in app', () => {
    isApp.mockReturnValue(true);
    const result = skip2Rules();
    expect(result).toBe();
    expect(open).toBeCalled();
  });

  it('should skip2Rules not in app', () => {
    isApp.mockReturnValue(false);
    const result = skip2Rules();
    expect(result).toBe();
    expect(windowOpenSpy).toBeCalled();
  });
});

describe('skip2Faq', () => {
  let windowOpenSpy;
  beforeEach(() => {
    jest.resetAllMocks();
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('should skip2Faq in app', () => {
    isApp.mockReturnValue(true);
    const result = skip2Faq();
    expect(result).toBe();
    expect(open).toBeCalled();
  });

  it('should skip2Faq not in app', () => {
    isApp.mockReturnValue(false);
    const result = skip2Faq();
    expect(result).toBe();
    expect(windowOpenSpy).toBeCalled();
  });
});

describe('truncateDecimals', () => {
  it('should correctly truncate decimals to default digits', () => {
    const result = truncateDecimals(1.1234567890123456789);
    expect(result).toBe('1.123456789012');
  });

  it('should correctly truncate decimals to specified digits', () => {
    const result = truncateDecimals(1.1234567890123456789, 5);
    expect(result).toBe('1.12345');
  });

  it('should correctly handle numbers without decimals', () => {
    const result = truncateDecimals(12345, 5);
    expect(result).toBe('12345');
  });

  it('should correctly handle numbers with less decimals than specified', () => {
    const result = truncateDecimals(1.12, 5);
    expect(result).toBe('1.12');
  });
});

describe('multiply', () => {
  it('should correctly multiply numbers', () => {
    const result = multiply(2, 3, 4);
    expect(result).toBe('24');
  });

  it('should correctly multiply decimals', () => {
    const result = multiply(0.1, 0.2);
    expect(result).toBe('0.02');
  });

  it('should correctly handle zero', () => {
    const result = multiply(2, 0, 4);
    expect(result).toBe('0');
  });

  it('should correctly handle invalid input', () => {
    const result = multiply(2, 'abc', 4);
    expect(result).toBe('--');
  });

  it('should correctly handle large numbers', () => {
    const result = multiply(1e12, 1e12);
    expect(result).toBe('1000000000000000000000000');
  });

  it('should correctly handle small numbers', () => {
    const result = multiply(1e-12, 1e-12);
    expect(result).toBe('0');
  });
});

describe('getMin function', () => {
  test('should return the minimum number from the arguments', () => {
    expect(getMin(1, 2)).toBe(1);
    expect(getMin(2, 1)).toBe(1);
    expect(getMin(10, 20)).toBe(10);
  });

  test('should return "--" if any argument is "--"', () => {
    expect(getMin('--', 5)).toBe('--');
    expect(getMin('--', 4)).toBe('--');
    expect(getMin(10, '--')).toBe('--');
  });

  test('should return Infinity if no arguments are provided', () => {
    expect(getMin()).toBe();
  });
});

describe('add function', () => {
  test('should return the sum of two numbers', () => {
    expect(add(1, 2)).toBe('3');
    expect(add(0.1, 0.2)).toBe('0.3');
    expect(add(-1, -2)).toBe('-3');
  });

  test('should return the sum with maximum 12 decimal places', () => {
    expect(add(1 / 3, 2 / 3)).toBe('1');
    expect(add(0.1 / 3, 0.2 / 3)).toBe('0.1');
  });

  test('should return "--" if any argument is not a number', () => {
    expect(add('a', 1)).toBe('--');
    expect(add(1, 'b')).toBe('--');
    expect(add('a', 'b')).toBe('--');
  });

  test('should return "--" if any argument is null or undefined', () => {
    expect(add(null, 1)).toBe('--');
    expect(add(1, undefined)).toBe('--');
    expect(add(null, undefined)).toBe('--');
  });
});

describe('minus function', () => {
  test('should return the difference of two numbers', () => {
    expect(minus(2, 1)).toBe('1');
    expect(minus(0.2, 0.1)).toBe('0.1');
    expect(minus(-1, -2)).toBe('1');
  });

  test('should return the difference with maximum 12 decimal places', () => {
    expect(minus(2 / 3, 1 / 3)).toBe('0.333333333333');
    expect(minus(0.2 / 3, 0.1 / 3)).toBe('0.033333333333');
  });

  test('should return "--" if any argument is not a number', () => {
    expect(minus('a', 1)).toBe('--');
    expect(minus(1, 'b')).toBe('--');
    expect(minus('a', 'b')).toBe('--');
  });

  test('should return "--" if any argument is null or undefined', () => {
    expect(minus(null, 1)).toBe('--');
    expect(minus(1, undefined)).toBe('--');
    expect(minus(null, undefined)).toBe('--');
  });
});

describe('getDecimalPlace function', () => {
  test('should return the number of decimal places', () => {
    expect(getDecimalPlace(1.23)).toBe(2);
    expect(getDecimalPlace(0.123456789012)).toBe(12);
    expect(getDecimalPlace(-1.23)).toBe(2);
  });

  test('should return 0 if the number has no decimal places', () => {
    expect(getDecimalPlace(1)).toBe(0);
    expect(getDecimalPlace(100)).toBe(0);
    expect(getDecimalPlace(-1)).toBe(0);
  });

  test('should return the number of decimal places for very small numbers', () => {
    expect(getDecimalPlace(0.0000001)).toBe(7);
  });

  test('should return "--" if the argument is not a number', () => {
    expect(getDecimalPlace('a')).toBe(0);
    expect(getDecimalPlace('1.23')).toBe(2);
  });

  test('should return 0 if the argument is null or undefined', () => {
    expect(getDecimalPlace(null)).toBe(0);
    expect(getDecimalPlace(undefined)).toBe(0);
  });
});

// Mock window.location.search
global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    search: '?coin=bitcoin&other=value',
  },
  writable: true,
});

describe('deleteCoinQuery function', () => {
  test('should return the same url if no url is provided', () => {
    expect(deleteCoinQuery()).toBe('');
  });
});

describe('lessThan function', () => {
  test('should return true if a is less than b', () => {
    expect(lessThan(1, 2)).toBe(true);
    expect(lessThan(0.1, 0.2)).toBe(true);
    expect(lessThan(-2, -1)).toBe(true);
  });

  test('should return false if a is not less than b', () => {
    expect(lessThan(2, 1)).toBe(false);
    expect(lessThan(0.2, 0.1)).toBe(false);
    expect(lessThan(-1, -2)).toBe(false);
  });

  test('should return false if a or b is not a number', () => {
    expect(lessThan('a', 1)).toBe(false);
    expect(lessThan(1, 'b')).toBe(false);
    expect(lessThan('a', 'b')).toBe(false);
  });
});

describe('greeterThan function', () => {
  test('should return true if a is greater than b', () => {
    expect(greeterThan(2, 1)).toBe(true);
    expect(greeterThan(0.2, 0.1)).toBe(true);
    expect(greeterThan(-1, -2)).toBe(true);
  });

  test('should return false if a is not greater than b', () => {
    expect(greeterThan(1, 2)).toBe(false);
    expect(greeterThan(0.1, 0.2)).toBe(false);
    expect(greeterThan(-2, -1)).toBe(false);
  });

  test('should return false if a or b is not a number', () => {
    expect(greeterThan('a', 1)).toBe(false);
    expect(greeterThan(1, 'b')).toBe(false);
    expect(greeterThan('a', 'b')).toBe(false);
  });
});
