/**
 * Owner: eli.xiang@kupotech.com
 */

import { isRTLLanguage } from 'src/utils/langTools';

describe('isRTLLanguage', () => {
  test('should return true for Arabic language', () => {
    expect(isRTLLanguage('ar_AE')).toBe(true);
  });

  test('should return true for Urdu language', () => {
    expect(isRTLLanguage('ur_PK')).toBe(true);
  });

  test('should return false for non-RTL language', () => {
    expect(isRTLLanguage('en_US')).toBe(false);
  });

  test('should return false for an unsupported language', () => {
    expect(isRTLLanguage('fr_FR')).toBe(false);
  });

  test('should return false for an empty string', () => {
    expect(isRTLLanguage('')).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isRTLLanguage(undefined)).toBe(false);
  });

  test('should return false for null', () => {
    expect(isRTLLanguage(null)).toBe(false);
  });
});
