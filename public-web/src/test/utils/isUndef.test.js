/**
 * Owner: jessie@kupotech.com
 */
import isUndef from 'utils/isUndef';

describe('isUndef function', () => {
  it('should return true', () => {
    expect(isUndef()).toBe(true);
    expect(isUndef(null)).toBe(true);
    expect(isUndef(undefined)).toBe(true);
    expect(isUndef('')).toBe(true);
    expect(isUndef(NaN)).toBe(true);
  });

  it('should return false', () => {
    expect(isUndef('a')).toBe(false);
  });
});
