import moment from 'moment';

import {
  capitalizeFirstLetter,
  compareVersion,
  countDecimalPlaces,
  deduplicateByContent,
  delay,
  divide,
  dropZero,
  formatNumberShow,
  formlize,
  getDigit,
  getPathname,
  isAndroid,
  isIOS,
  isStringOrNumber,
  isUndef,
  isUnfOrZero,
  isValidNumber,
  makeGroupArrayByFillNull,
  makeListAppendNo,
  numberFixed,
  removeTrailingZeros,
  removeUndefinedProperties,
  safeArray,
  showDatetime,
  timeoutPromise,
} from 'utils/helper';

jest.mock('@krn/toolkit', () => ({
  storage: {
    setItem: jest.fn(),
    getItem: jest.fn(),
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('formlize', () => {
  it('should return the same FormData instance if input is already FormData', () => {
    const formData = new FormData();
    formData.append('key1', 'value1');
    const result = formlize(formData);
    expect(result).toBe(formData); // Ensure the same instance is returned
  });

  it('should convert a plain object to FormData', () => {
    const obj = {
      key1: 'value1',
      key2: 'value2',
    };
    const result = formlize(obj);

    expect(result).toBeInstanceOf(FormData);
    expect(result.get('key1')).toBe('value1');
    expect(result.get('key2')).toBe('value2');
  });

  it('should ignore undefined values in the object', () => {
    const obj = {
      key1: 'value1',
      key2: undefined,
    };
    const result = formlize(obj);

    expect(result).toBeInstanceOf(FormData);
    expect(result.get('key1')).toBe('value1');
    expect(result.has('key2')).toBe(false); // key2 should not exist
  });

  it('should handle empty objects correctly', () => {
    const obj = {};
    const result = formlize(obj);

    expect(result).toBeInstanceOf(FormData);
    expect(Array.from(result.keys()).length).toBe(0); // No keys should exist
  });
});

describe('setNativeInfo and getNativeInfo', () => {
  beforeEach(() => {
    // We need to reset modules to clear the internal _NATIVE_INFO variable
    // and re-require the dependencies with mocks for each test.
    jest.resetModules();
    jest.mock('@krn/toolkit', () => ({
      storage: {
        setItem: jest.fn(),
        getItem: jest.fn(),
      },
    }));
  });

  it('should set native info and store it', async () => {
    const {setNativeInfo} = require('utils/helper');
    const {storage} = require('@krn/toolkit');
    const info = {version: '1.0.0'};
    await setNativeInfo(info);
    expect(storage.setItem).toHaveBeenCalledWith('NATIVE_INFO', info);
  });

  it('getNativeInfo should return from memory if available', async () => {
    const {setNativeInfo, getNativeInfo} = require('utils/helper');
    const {storage} = require('@krn/toolkit');
    const info = {version: '1.0.0'};
    await setNativeInfo(info);
    const result = await getNativeInfo();
    expect(result).toEqual(info);
    expect(storage.getItem).not.toHaveBeenCalled();
  });

  it('getNativeInfo should retrieve from storage if not in memory', async () => {
    const {getNativeInfo} = require('utils/helper');
    const {storage} = require('@krn/toolkit');
    const info = {version: '1.0.0'};
    storage.getItem.mockResolvedValue(info);
    const result = await getNativeInfo();
    expect(storage.getItem).toHaveBeenCalledWith('NATIVE_INFO');
    expect(result).toEqual(info);
  });

  it('getNativeInfo should return empty object if nothing in storage', async () => {
    const {getNativeInfo} = require('utils/helper');
    const {storage} = require('@krn/toolkit');
    storage.getItem.mockResolvedValue(null);
    const result = await getNativeInfo();
    expect(result).toEqual({});
  });

  it('setNativeInfo should do nothing if info is falsy', async () => {
    const {setNativeInfo} = require('utils/helper');
    const {storage} = require('@krn/toolkit');
    await setNativeInfo(null);
    expect(storage.setItem).not.toHaveBeenCalled();
    await setNativeInfo(undefined);
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});

describe('numberFixed', () => {
  it('should handle non-numeric values', () => {
    expect(numberFixed(NaN, 2)).toBeNaN();
    expect(numberFixed('abc', 2)).toBe('abc');
    expect(numberFixed(undefined, 2)).toBeUndefined();
  });

  it('should handle zero', () => {
    expect(numberFixed(0, 2)).toBe('0');
  });

  it('should fix decimal places with default rounding', () => {
    expect(numberFixed('123.456', 2)).toBe('123.45');
  });
});

describe('removeTrailingZeros', () => {
  it('should remove trailing zeros from a string number', () => {
    expect(removeTrailingZeros('123.4500')).toBe('123.45');
    expect(removeTrailingZeros('123.00')).toBe('123');
  });

  it('should handle numbers', () => {
    expect(removeTrailingZeros(123.45)).toBe('123.45');
    expect(removeTrailingZeros(123.0)).toBe('123');
  });

  it('should return input if not a number or string', () => {
    expect(removeTrailingZeros(null)).toBe(null);
  });
});

describe('compareVersion', () => {
  it('should correctly compare version strings', () => {
    expect(compareVersion('1.0.1', '1.0.0')).toBeGreaterThan(0);
    expect(compareVersion('1.0.0', '1.0.1')).toBeLessThan(0);
    expect(compareVersion('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersion('1.1', '1.0.1')).toBeGreaterThan(0);
  });
});

describe('isValidNumber', () => {
  it('should validate numbers correctly', () => {
    expect(isValidNumber(123)).toBe(true);
    expect(isValidNumber('123')).toBe(true);
    expect(isValidNumber(null)).toBe(false);
    expect(isValidNumber(undefined)).toBe(false);
    expect(isValidNumber('')).toBe(false);
    expect(isValidNumber(NaN)).toBe(false);
  });
});

describe('removeUndefinedProperties', () => {
  it('should remove properties with undefined values', () => {
    const obj = {a: 1, b: undefined, c: null, d: 'hello'};
    const expected = {a: 1, c: null, d: 'hello'};
    expect(removeUndefinedProperties(obj)).toEqual(expected);
  });
});

describe('isStringOrNumber', () => {
  it('should check if target is a string or a number', () => {
    expect(isStringOrNumber('hello')).toBe(true);
    expect(isStringOrNumber(123)).toBe(true);
    expect(isStringOrNumber(true)).toBe(false);
  });
});

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('WORLD')).toBe('World');
    expect(capitalizeFirstLetter('')).toBe('');
  });
});

describe('timeoutPromise', () => {
  jest.useFakeTimers();

  it('should resolve if the promise resolves before timeout', async () => {
    const fastPromise = Promise.resolve('fast');
    const promiseWithTimeout = timeoutPromise(fastPromise, 100);
    jest.runAllTimers();
    await expect(promiseWithTimeout).resolves.toBe('fast');
  });

  it('should reject if the promise rejects before timeout', async () => {
    const fastRejectingPromise = Promise.reject(new Error('fast error'));
    const promiseWithTimeout = timeoutPromise(fastRejectingPromise, 100);
    jest.runAllTimers();
    await expect(promiseWithTimeout).rejects.toThrow('fast error');
  });

  it('should reject if the promise times out', async () => {
    const slowPromise = new Promise(resolve =>
      setTimeout(() => resolve('slow'), 200),
    );
    const promiseWithTimeout = timeoutPromise(slowPromise, 100);
    jest.runAllTimers();
    await expect(promiseWithTimeout).rejects.toThrow(
      'Operation timed out after 100 ms',
    );
  });
});

describe('makeListAppendNo', () => {
  it('should append a "no" field to each object in the list', () => {
    const list = [{a: 1}, {b: 2}];
    const expected = [
      {a: 1, no: 1},
      {b: 2, no: 2},
    ];
    expect(makeListAppendNo(list)).toEqual(expected);
  });
});

describe('getDigit', () => {
  it('should get the number of decimal places for scientific notation', () => {
    expect(getDigit('0.001')).toBe(3);
    expect(getDigit('1e-5')).toBe(5);
    expect(getDigit('100', true)).toBe(0);
  });
});

describe('isIOS and isAndroid', () => {
  it('should correctly identify the platform', () => {
    // Mock is set to 'ios' at the top of the file
    expect(isIOS).toBe(true);
    expect(isAndroid).toBe(false);
  });
});

describe('isUnfOrZero', () => {
  it('should check for undefined, null, NaN or zero', () => {
    expect(isUnfOrZero(undefined)).toBe(true);
    expect(isUnfOrZero(null)).toBe(true);
    expect(isUnfOrZero(0)).toBe(true);
    expect(isUnfOrZero('0')).toBe(true);
    expect(isUnfOrZero(1)).toBe(false);
  });
});

describe('getPathname', () => {
  it('should get the pathname from a URL string', () => {
    expect(getPathname('http://example.com/path?query=1')).toBe(
      'http://example.com/path',
    );
    expect(getPathname('http://example.com/path')).toBe(
      'http://example.com/path',
    );
  });
});

describe('formatNumberShow', () => {
  it('should format numbers with units (K, M, B)', () => {
    expect(formatNumberShow(12345, 2)).toBe('12.34K');
    expect(formatNumberShow(1234567, 2)).toBe('1.23M');
    expect(formatNumberShow(1234567890, 2)).toBe('1.23B');
    expect(formatNumberShow(-12345, 2)).toBe('-12.34K');
    expect(formatNumberShow(999, 2)).toBe(999);
  });
});

describe('safeArray', () => {
  it('should return an array if the input is an array', () => {
    expect(safeArray([1, 2])).toEqual([1, 2]);
  });

  it('should return an empty array for non-array inputs', () => {
    expect(safeArray(null)).toEqual([]);
    expect(safeArray({})).toEqual([]);
  });
});

describe('makeGroupArrayByFillNull', () => {
  it('should group an array and fill with null', () => {
    const arr = [1, 2, 3, 4, 5];
    const expected = [
      [1, 2, 3],
      [4, 5, null],
    ];
    expect(makeGroupArrayByFillNull(arr, 3)).toEqual(expected);
  });
});

describe('countDecimalPlaces', () => {
  it('should count decimal places of a number', () => {
    expect(countDecimalPlaces(123.456)).toBe(3);
  });
});

describe('delay', () => {
  it('should resolve after a given time', async () => {
    const callback = jest.fn();
    const p = delay(100).then(callback);
    jest.runAllTimers();
    await p;
    expect(callback).toHaveBeenCalled();
  });
});

describe('deduplicateByContent', () => {
  it('should deduplicate an array of objects based on content', () => {
    const list = [{a: 1}, {a: 1}, {b: 2}, {a: 1, b: undefined}];
    const expected = [{a: 1}, {b: 2}];
    expect(deduplicateByContent(list)).toEqual(expected);
  });
});

describe('test helper', () => {
  let now;
  let nowTs;
  beforeAll(() => {
    // Mock current time to a specific value
    now = moment('2024-05-30T12:00:00Z'); // Mock current time as May 30, 2024 12:00:00 UTC
    nowTs = now.valueOf();
    jest.spyOn(moment, 'now').mockImplementation(() => nowTs);
  });

  afterAll(() => {
    // Restore original implementation after all tests
    jest.restoreAllMocks();
  });

  test('test isUndef', () => {
    expect(isUndef('')).toBe(true);
    expect(isUndef(null)).toBe(true);
    expect(isUndef()).toBe(true);
    expect(isUndef(0)).toBe(false);
  });
  test('test dropZero', () => {
    expect(dropZero(null)).toBe('-');
    expect(dropZero('123.456000')).toBe('123.456');
  });

  test('test showDatetime', () => {
    expect(showDatetime(nowTs)).toEqual(now.format('YYYY/MM/DD HH:mm:ss'));
  });
  test('test divide', () => {
    expect(divide('123')).toBe(0);
    expect(divide('123', '0')).toBe(0);
    expect(divide('123', 1)).toBe('123.00000000');
  });
});
