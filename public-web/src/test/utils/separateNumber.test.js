/**
 * Owner: willen@kupotech.com
 */

import separateNumber from 'utils/separateNumber';

describe('separateNumber', () => {
  test('separateNumber with integer', () => {
    expect(separateNumber(1234567)).toBe('1,234,567');
  });

  test('separateNumber with float', () => {
    expect(separateNumber(1234567.89)).toBe('1,234,567.89');
  });

  test('separateNumber with string', () => {
    expect(separateNumber('1234567')).toBe('1,234,567');
  });

  test('separateNumber with non-number string', () => {
    expect(separateNumber('abc')).toBe('abc');
  });

  test('separateNumber with NaN', () => {
    expect(separateNumber(NaN)).toBe(NaN);
  });

  test('separateNumber with undefined', () => {
    expect(separateNumber(undefined)).toBe(undefined);
  });

  test('separateNumber with null', () => {
    expect(separateNumber(null)).toBe(null);
  });
});
