/**
 * Owner: eli.xiang@kupotech.com
 */

import separateNumber from 'src/utils/separateNumber';

describe('separateNumber', () => {
  test('should format integer with thousand separators', () => {
    expect(separateNumber(1000)).toBe('1,000');
    expect(separateNumber(1000000)).toBe('1,000,000');
    expect(separateNumber(123456789)).toBe('123,456,789');
  });

  test('should format float with thousand separators', () => {
    expect(separateNumber(1000.5)).toBe('1,000.5');
    expect(separateNumber(1000000.75)).toBe('1,000,000.75');
    expect(separateNumber(123456789.123)).toBe('123,456,789.123');
  });

  test('should return the same number if not a valid number', () => {
    expect(separateNumber('abc')).toBe('abc');
    expect(separateNumber(null)).toBe(null);
    expect(separateNumber(undefined)).toBe(undefined);
    expect(separateNumber(NaN)).toBe(NaN);
  });

  test('should handle negative numbers', () => {
    expect(separateNumber(-1000)).toBe(-1000);
  });

  test('should handle numbers less than 1000 without formatting', () => {
    expect(separateNumber(999)).toBe('999');
    expect(separateNumber(0)).toBe('0');
  });

  test('should cache formatted numbers', () => {
    expect(separateNumber(1000)).toBe('1,000');
    expect(separateNumber(1000)).toBe('1,000'); // Should hit the cache
  });

  test('should handle large numbers', () => {
    expect(separateNumber(1234567890123)).toBe('1,234,567,890,123');
  });
});
