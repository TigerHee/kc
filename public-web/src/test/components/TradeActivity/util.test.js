/**
 * Owner: jessie@kupotech.com
 */
import * as tma from '@kc/telegram-biz-sdk';
import { isApp } from '@knb/native-bridge';
const {
  skip2Login,
  transformTimeStr,
  locateToUrl,
  locateToUrlInApp,
  locateToTrade,
  greeterThan,
  lessThan,
  transformNumberPrecision,
} = require('TradeActivity/utils');

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('skip2Login', () => {
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

    skip2Login();
    expect(isApp).toHaveBeenCalled();
  });
});

describe('locateToTrade', () => {
  it('should locateToTrade in app', () => {
    isApp.mockReturnValue(true);
    locateToTrade('BTC-USDT');
    locateToTrade();
  });

  it('should locateToTrade not in app', () => {
    isApp.mockReturnValue(false);
    locateToTrade('BTC-USDT');
    locateToTrade();
  });
});

describe('locateToUrl', () => {
  it('should locateToUrl in app', () => {
    isApp.mockReturnValue(true);
    const result = locateToUrl('/');
    expect(result).toBe();

    const result2 = locateToUrl('https://test.com');
    expect(result2).toBe();
  });

  it('should locateToUrl not in app', () => {
    isApp.mockReturnValue(false);
    const result = locateToUrl('/');
    expect(result).toBe();
  });
});

describe('locateToUrlInApp', () => {
  it('should locateToUrlInApp in app', () => {
    isApp.mockReturnValue(true);
    locateToUrlInApp('/');
    locateToUrlInApp('https://test.com');
  });

  it('should locateToUrlInApp not in app', () => {
    isApp.mockReturnValue(false);
    const result = locateToUrlInApp('/');
    expect(result).toBe();
  });
});

describe('transformTimeStr', () => {
  it('should return 00', () => {
    const result = transformTimeStr(-1);
    expect(result).toBe('00');
    const result2 = transformTimeStr('--');
    expect(result2).toBe('00');
  });

  it('should return value itself', () => {
    const result = transformTimeStr(10);
    expect(result).toBe(10);
    const result2 = transformTimeStr('10');
    expect(result2).toBe('10');
  });

  it('should return value with 0', () => {
    const result = transformTimeStr(9);
    expect(result).toBe('09');
    const result2 = transformTimeStr('9');
    expect(result2).toBe('09');
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

describe('transformNumberPrecision function', () => {
  test('should return value', () => {
    expect(transformNumberPrecision()).toBe(undefined);
  });

  test('should return format number', () => {
    expect(transformNumberPrecision('0.0000001000')).toBe('0.0000001');
    expect(transformNumberPrecision('100000.0000000001000')).toBe('100000');
    expect(transformNumberPrecision('100.0000000001000')).toBe('100');
    expect(transformNumberPrecision('100.8796')).toBe('100.87');
  });
});
