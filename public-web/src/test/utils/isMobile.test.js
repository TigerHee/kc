/**
 * Owner: jessie@kupotech.com
 */
import isMobile from 'utils/isMobile';

describe('isMobile function', () => {
  it('should return true if the user agent indicates phone', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'iPhone',
      writable: true,
    });
    expect(isMobile()).toBe(true);
  });
  it('should return true if the user agent indicates pad', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'iPad',
      writable: true,
    });
    expect(isMobile()).toBe(true);
  });

  it('should return false if the user agent does not indicate isMobile', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Chrome',
      writable: true,
    });
    expect(isMobile()).toBe(false);
  });
});
